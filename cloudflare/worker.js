/**
 * Cloudflare Worker Entrypoint with Static Assets, Gemini AI Chat, & Hyperdrive/Postgres Integration
 * File: cloudflare/worker.js
 */

import { Client } from 'pg';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const KILSTA_SYSTEM_INSTRUCTION = `You are "KILSTA AI Advisory Assistant", the official digital corporate consultant and technical strategist for KILSTA Business & ICT Consultants, situated in Gumini Village, Huhu LLG, Alotau District, Milne Bay Province, Papua New Guinea (PNG).

Official Enterprise Credentials:
- Investment Promotion Authority (IPA) Registration No: 6-129295384
- Internal Revenue Commission (IRC) Tax Identification Number (TIN): 502603269
- Corporate Location: Gumini Village, Alotau, Milne Bay Province, Papua New Guinea
- Executive Inquiries: +675 82545274 | kilsta2023@gmail.com
- Identity: 100% Papua New Guinea owned and community-anchored

Your Core Divisions & Advisory Scope:
1. Section A: Business Advisory, Governance & Compliance
   - IPA company registrations, business names, certificate renewals, and statutory annual return filings.
   - IRC Tax Identification Number (TIN) applications, GST registration, Salary or Business Withholding Tax, and Certificate of Compliance (COC).
   - SME corporate profiles, formal bank account opening kits, and structured bookkeeping seminars.

2. Section B: ICT Infrastructure & Starlink Satellite Engineering
   - Turnkey Starlink Low-Earth Orbit (LEO) satellite terminal deployments across maritime islands and mainland PNG.
   - Cyclone-rated heavy-duty roof brackets, tower masts, salt-mist resistant cabling, lightning surge suppression, and solar battery integration.
   - Multi-building rural Wi-Fi mesh networks and hands-on ICT capacity training.`;

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

function getKilstaKnowledgeFallback(userQuery) {
  const q = (userQuery || '').toLowerCase();

  if (q.includes('ipa') || q.includes('register') || q.includes('company') || q.includes('business name')) {
    return `### **IPA Company & Business Name Registration | KILSTA Advisory**
*(Official Registration No: 6-129295384)*

Formalizing your enterprise with the **Investment Promotion Authority (IPA)** is the foundation for legal recognition, bank account opening, and government tender eligibility in Papua New Guinea.

- **Business Name Registration (Sole Trader / Partnership):** Fast-track filing for individuals and local ventures.
- **Full Company Incorporation (Pty Ltd):** Form 1, Company Constitution, shareholder registry, and directorship filings.
- **Annual Return Compliance:** Statutory lodgments to keep your entity active and in good standing.

**Direct Consultations:** +675 82545274 | kilsta2023@gmail.com`;
  }

  if (q.includes('starlink') || q.includes('satellite') || q.includes('internet') || q.includes('wifi') || q.includes('solar')) {
    return `### **Starlink Turnkey Deployment & Rural ICT Infrastructure**
*KILSTA Section B: ICT Engineering & Field Deployments*

High-speed Low-Earth Orbit (LEO) satellite connectivity engineered specifically for Milne Bay's maritime, island, and rural conditions:
- **Turnkey Starlink Kit Sourcing & Cyclone-Rated Mounts**
- **Direct Lightning & Surge Protection + Solar/Hybrid Backup**
- **Campus LAN & Wi-Fi Mesh Networking**

**Contact Our Field Engineering Team:** +675 82545274 | kilsta2023@gmail.com`;
  }

  if (q.includes('tin') || q.includes('irc') || q.includes('tax') || q.includes('gst') || q.includes('coc')) {
    return `### **IRC Tax Identification (TIN) & Statutory Compliance**
*(KILSTA TIN: 502603269)*

We manage **IRC TIN Applications**, **GST**, **Salary/Business Withholding Tax (SWT/BWT)**, and **Certificates of Compliance (COC)** for tenders and commercial trade accounts.

**Schedule an Appointment:** +675 82545274 | kilsta2023@gmail.com`;
  }

  return `### **KILSTA Business & ICT Consultants**
*Enhancing Through Business & ICT Innovations*
- **IPA Registration:** 6-129295384 | **IRC TIN:** 502603269
- **Headquarters:** Gumini Village, Huhu LLG, Alotau, Milne Bay Province, Papua New Guinea

**Direct Line / WhatsApp:** +675 82545274 | **Email:** kilsta2023@gmail.com`;
}

async function handleChat(request, env) {
  try {
    const body = await request.json();
    const { message, history = [], mode = 'general' } = body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return jsonResponse({ success: false, error: 'Please enter a message to begin consultation.' });
    }

    const apiKey = env.GEMINI_API_KEY;
    if (apiKey) {
      const candidateModels =
        mode === 'fast'
          ? ['gemini-3.1-flash-lite', 'gemini-flash-latest']
          : mode === 'complex'
            ? ['gemini-4-argon', 'gemini-3.1-flash-lite']
            : ['gemini-3.1-flash-lite', 'gemini-flash-latest'];

      const contents = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-8)) {
          if (item && item.text && (item.role === 'user' || item.role === 'model')) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: String(item.text) }],
            });
          }
        }
      }
      contents.push({ role: 'user', parts: [{ text: message.trim() }] });

      for (const modelName of candidateModels) {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 10000);
          const apiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(apiKey)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal,
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: KILSTA_SYSTEM_INSTRUCTION }] },
                contents,
              }),
            }
          );
          clearTimeout(timer);

          if (apiRes.ok) {
            const data = await apiRes.json();
            const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (replyText) {
              return jsonResponse({ success: true, reply: replyText, modelUsed: modelName });
            }
          }
        } catch (err) {
          console.warn(`Worker chat cascade error (${modelName}):`, err);
        }
      }
    }

    return jsonResponse({
      success: true,
      reply: getKilstaKnowledgeFallback(message),
      modelUsed: 'kilsta-knowledge-engine',
    });
  } catch (err) {
    console.error('Worker /api/chat error:', err);
    return jsonResponse({
      success: true,
      reply: getKilstaKnowledgeFallback(''),
      modelUsed: 'kilsta-knowledge-engine',
    });
  }
}

async function handleLeadPost(request, env, ctx) {
  try {
    const body = await request.json();
    const { name, email, service_category, message, phone, organization } = body || {};

    if (!name || !email || !service_category || !message) {
      return jsonResponse(
        {
          success: false,
          error: 'Missing required fields: name, email, service_category, and message are mandatory.',
        },
        400
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return jsonResponse({ success: false, error: 'Invalid email address syntax.' }, 400);
    }

    const connectionString =
      env.HYPERDRIVE?.connectionString || env.DATABASE_URL || env.NEON_DATABASE_URL || env.POSTGRES_URL;

    if (!connectionString) {
      return jsonResponse(
        {
          success: true,
          mode: 'preview_acknowledged',
          message: 'Lead received successfully by KILSTA edge gateway.',
          data: {
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            name: String(name).trim(),
            email: String(email).trim(),
            service_category,
            status: 'New',
          },
        },
        201
      );
    }

    const client = new Client({
      connectionString,
      ssl:
        connectionString.includes('neon.tech') ||
        connectionString.includes('supabase') ||
        connectionString.includes('sslmode=require')
          ? { rejectUnauthorized: false }
          : undefined,
    });
    await client.connect();

    const query = `
      INSERT INTO public.leads (name, email, service_category, message, phone, organization, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, 'New', timezone('utc', now()))
      RETURNING id, created_at, name, email, service_category, status;
    `;
    const values = [
      String(name).trim(),
      String(email).trim(),
      service_category,
      String(message).trim(),
      phone ? String(phone).trim() : null,
      organization ? String(organization).trim() : null,
    ];
    const result = await client.query(query, values);
    ctx.waitUntil(client.end());

    return jsonResponse(
      {
        success: true,
        lead: result.rows[0],
        message: 'Inquiry securely registered with KILSTA consultants.',
      },
      201,
      { 'Cache-Control': 'no-store' }
    );
  } catch (err) {
    console.error('Database insertion error via Hyperdrive:', err);
    return jsonResponse({ success: false, error: 'Failed to process lead intake via database pool.' }, 500);
  }
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: { ...CORS_HEADERS, 'Access-Control-Max-Age': '86400' },
      });
    }

    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/api/chat') {
      return handleChat(request, env);
    }

    if (request.method === 'POST' && (url.pathname === '/api/leads' || url.pathname === '/api/submit')) {
      return handleLeadPost(request, env, ctx);
    }

    if (request.method === 'GET' && (url.pathname === '/api/health' || url.pathname === '/api/submit')) {
      return jsonResponse({
        status: 'healthy',
        provider: 'Cloudflare Workers + Assets',
        timestamp: new Date().toISOString(),
      });
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
