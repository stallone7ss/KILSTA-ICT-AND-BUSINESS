import express from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createLead, getLeads, updateLead, deleteLead } from './src/db/leads.ts';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

import { adminDb } from './src/lib/firebase-admin.ts';
import { ai } from './src/lib/gemini.ts';

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
   - Transitioning informal village trades, clan associations, and local contractors into tender-ready corporate entities.

2. Section B: ICT Infrastructure & Starlink Satellite Engineering
   - Turnkey Starlink Low-Earth Orbit (LEO) satellite terminal deployments across maritime islands and mainland PNG.
   - Cyclone-rated heavy-duty roof brackets, tower masts, and salt-mist resistant cabling.
   - Direct lightning arrestor surge suppression, grounding rods, and solar battery / UPS integration for off-grid operations.
   - Multi-building rural Wi-Fi mesh networks, point-to-point microwave links, and structured ethernet distribution.
   - Hands-on ICT capacity training: office productivity software workshops, computer maintenance, and network troubleshooting.

Response Guidelines:
- Adopt a professional, respectful, articulate, and culturally attuned tone appropriate for PNG government, SMEs, church groups, health posts, schools, and private enterprises.
- Structure responses clearly with bold section headings, bullet points, and numbered action steps.
- Explain statutory processes clearly (e.g. required forms, identification, typical timelines, and compliance rules).
- For ICT and satellite inquiries, emphasize practical PNG field realities: coastal corrosion protection, jungle canopy clearances, solar backup, and storm protection.
- Guide clients to book an official consultation or submit an inquiry through the KILSTA Contact Desk when they are ready for formal engagement.`;

// Multi-turn Gemini AI Chat Route
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], mode = 'general' } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A valid message is required' });
    }

    // Determine model according to task: general (gemini-3.8-flash), fast (gemini-3.1-flash-lite), complex (gemini-4-argon)
    let selectedModel = 'gemini-3.8-flash';
    if (mode === 'fast') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else if (mode === 'complex') {
      selectedModel = 'gemini-4-argon';
    }

    // Assemble multi-turn history into the GenAI contents format
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (item && item.text && (item.role === 'user' || item.role === 'model')) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    try {
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction: KILSTA_SYSTEM_INSTRUCTION,
        },
      });

      const reply = response.text || 'Thank you for consulting KILSTA Business & ICT Consultants. Please let us know how we can assist further.';
      return res.json({
        success: true,
        reply,
        modelUsed: selectedModel,
      });
    } catch (modelErr: any) {
      // If complex model (gemini-4-argon) faces access/tier constraints, transparently fallback to gemini-3.8-flash
      if (selectedModel === 'gemini-4-argon') {
        console.warn('Fallback from gemini-4-argon to gemini-3.8-flash:', modelErr?.message);
        const fallbackResp = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: KILSTA_SYSTEM_INSTRUCTION,
          },
        });
        return res.json({
          success: true,
          reply: fallbackResp.text || 'Thank you for consulting KILSTA Business & ICT Consultants.',
          modelUsed: 'gemini-3.8-flash',
        });
      }
      throw modelErr;
    }
  } catch (error: any) {
    console.error('Server Gemini Chat Route Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate AI response. Please check back shortly.',
    });
  }
});


// Public leads intake route: stores client inquiry directly into PostgreSQL and Firebase Firestore
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, organization, service_category, message } = req.body;
    if (!name || !email || !service_category || !message) {
      return res.status(400).json({ error: 'Missing required inquiry fields' });
    }

    // 1. Record lead in PostgreSQL database via Drizzle ORM
    const newLead = await createLead({
      name,
      email,
      phone,
      organization,
      serviceCategory: service_category,
      message,
    });

    // 2. Save lead directly into Firebase Firestore 'leads' collection for Firebase Console review
    let firebaseDocId = null;
    try {
      const fbRef = await adminDb.collection('leads').add({
        name,
        email,
        phone: phone || null,
        organization: organization || null,
        service_category,
        message,
        status: 'New',
        postgresId: newLead.id,
        createdAt: new Date().toISOString(),
      });
      firebaseDocId = fbRef.id;
    } catch (fbErr) {
      console.warn('Firebase Firestore write notice:', fbErr);
    }

    res.status(201).json({
      success: true,
      lead: newLead,
      firebaseDocId,
      message: 'Inquiry successfully saved to PostgreSQL and Firebase Firestore.',
    });
  } catch (error: any) {
    console.error('Lead submission endpoint error:', error);
    res.status(500).json({ error: error.message || 'Failed to record lead in database' });
  }
});

// Authenticated leads list route (for admin staff review)
app.get('/api/leads', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (req.user?.uid && req.user?.email) {
      await getOrCreateUser(req.user.uid, req.user.email);
    }
    const allLeads = await getLeads();
    res.json({ leads: allLeads });
  } catch (error: any) {
    console.error('Failed to retrieve leads:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve leads' });
  }
});

// Update lead route (for administrators to edit status, organization, etc.)
app.put('/api/leads/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const leadId = parseInt(req.params.id, 10);
    const { status, phone, organization, serviceCategory, firestoreId } = req.body;

    const updated = await updateLead(leadId, {
      status,
      phone,
      organization,
      serviceCategory,
    });

    // Update in Firestore if doc ID exists
    if (firestoreId) {
      try {
        await adminDb.collection('leads').doc(firestoreId).update({
          status: status || 'New',
          phone: phone || null,
          organization: organization || null,
          service_category: serviceCategory,
          updatedAt: new Date().toISOString(),
        });
      } catch (fbErr) {
        console.warn('Firestore update sync notice:', fbErr);
      }
    }

    res.json({ success: true, lead: updated });
  } catch (error: any) {
    console.error('Failed to update lead:', error);
    res.status(500).json({ error: error.message || 'Failed to update lead' });
  }
});

// Delete lead route
app.delete('/api/leads/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const leadId = parseInt(req.params.id, 10);
    const { firestoreId } = req.body || {};

    const deleted = await deleteLead(leadId);

    if (firestoreId) {
      try {
        await adminDb.collection('leads').doc(firestoreId).delete();
      } catch (fbErr) {
        console.warn('Firestore delete notice:', fbErr);
      }
    }

    res.json({ success: true, lead: deleted });
  } catch (error: any) {
    console.error('Failed to delete lead:', error);
    res.status(500).json({ error: error.message || 'Failed to delete lead' });
  }
});

// Authenticated user sync route
app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.uid || !req.user?.email) {
      return res.status(400).json({ error: 'Missing user credentials in token' });
    }
    const user = await getOrCreateUser(req.user.uid, req.user.email);
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to sync user' });
  }
});

// Vite middleware in development or static serve in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  app.get('*', (_req, res) => {
    res.sendFile('dist/index.html', { root: '.' });
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
