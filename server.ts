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

// Local KILSTA Knowledge Base emergency fallback generator (used if upstream AI APIs experience temporary demand spikes)
function getKilstaKnowledgeFallback(userQuery: string): string {
  const q = (userQuery || '').toLowerCase();

  if (q.includes('ipa') || q.includes('register') || q.includes('company') || q.includes('business name')) {
    return `### **IPA Company & Business Name Registration | KILSTA Advisory**
*(Official Registration No: 6-129295384)*

Formalizing your enterprise with the **Investment Promotion Authority (IPA)** is the foundation for legal recognition, bank account opening, and government tender eligibility in Papua New Guinea.

---

### **1. Core IPA Services We Deliver:**
- **Business Name Registration (Sole Trader / Partnership):** Fast-track filing for individuals and local ventures.
- **Full Company Incorporation (Pty Ltd):** Complete Form 1, Company Constitution, shareholder registry, and directorship filings under the *Companies Act 1997*.
- **Annual Return Compliance:** Statutory lodgments to keep your entity active and in good standing.

### **2. Required Prerequisite Documents:**
1. Valid Identification (PNG National ID Card or current Passport) for all Directors & Shareholders.
2. Physical Residential & Principal Operating Address in PNG (e.g. Alotau, Milne Bay).
3. 2–3 Proposed Entity Names for reservation clearance.
4. Active email and contact phone for official electronic certification.

### **3. Post-Incorporation IRC Integration:**
Following IPA clearance, KILSTA immediately transitions your business to the **Internal Revenue Commission (IRC)** to obtain your **Tax Identification Number (TIN)** and **Certificate of Compliance (COC)**.

**Direct Consultations:**
- **Office:** Gumini Village, Huhu LLG, Alotau District, Milne Bay Province
- **Phone / WhatsApp:** +675 82545274 | **Email:** kilsta2023@gmail.com`;
  }

  if (q.includes('starlink') || q.includes('satellite') || q.includes('internet') || q.includes('wifi') || q.includes('network') || q.includes('solar')) {
    return `### **Starlink Turnkey Deployment & Rural ICT Infrastructure**
*KILSTA Section B: ICT Engineering & Field Deployments*

High-speed Low-Earth Orbit (LEO) satellite connectivity engineered specifically for Milne Bay's maritime, island, and rural conditions.

---

### **1. Hardware & Installation Packages:**
- **Turnkey Starlink Kit Sourcing:** Standard & High-Performance terminals.
- **Cyclone-Rated Structural Mounts:** Heavy-duty, anti-corrosion galvanized brackets engineered for coastal salt spray and high wind loads.
- **Direct Lightning & Surge Protection:** Solid copper grounding rods and inline gigabit surge suppressors.
- **Solar & Hybrid Power Integration:** Dedicated Pure Sine Wave inverters and battery backup for remote off-grid clinics, schools, and eco-resorts.
- **Campus LAN & Wi-Fi Mesh:** Multi-building coverage links connecting administrative offices, classrooms, or accommodation blocks.

### **2. Typical Deployment Timeline:**
- **Milne Bay Mainland (Alotau / Huhu):** 24–48 hours upon kit arrival.
- **Maritime Islands (Samarai, Misima, Losuia):** Coordinated dispatch via charter vessel or domestic logistics.

**Contact Our Field Engineering Team:**
- **Phone / WhatsApp:** +675 82545274 | **Email:** kilsta2023@gmail.com`;
  }

  if (q.includes('tin') || q.includes('irc') || q.includes('tax') || q.includes('gst') || q.includes('coc')) {
    return `### **IRC Tax Identification (TIN) & Statutory Compliance**
*(KILSTA TIN: 502603269)*

Operating without tax compliance restricts your business from winning government tenders, corporate contracts, and establishing commercial trade accounts in PNG.

---

### **1. Tax Filing Services We Manage:**
- **IRC TIN Application:** Rapid issuance of formal Tax Identification Numbers for newly incorporated companies and sole traders.
- **Goods and Services Tax (GST):** Monthly returns and compliance filing for qualified businesses.
- **Salary/Business Withholding Tax (SWT/BWT):** Payroll withholding records and statutory remittances.
- **Certificate of Compliance (COC):** Crucial documentation required for contractors participating in public or provincial tenders.

### **2. Bookkeeping & SME Financial Records:**
KILSTA provides organized record-keeping templates and staff workshops so your enterprise maintains audit-ready ledgers throughout the financial year.

**Schedule an Appointment:**
- **Phone:** +675 82545274 | **Email:** kilsta2023@gmail.com`;
  }

  return `### **KILSTA Business & ICT Consultants**
*Enhancing Through Business & ICT Innovations*
- **IPA Registration:** 6-129295384 | **IRC TIN:** 502603269
- **Headquarters:** Gumini Village, Huhu LLG, Alotau, Milne Bay Province, Papua New Guinea

---

### **How We Can Assist Your Organization:**
1. **Section A (Corporate Services):** IPA Company Incorporation, Business Names, IRC TIN & GST registrations, corporate profiles, and tender kits.
2. **Section B (ICT Infrastructure):** Starlink satellite installation, cyclone-rated mast engineering, off-grid solar integration, Wi-Fi mesh networking, and digital literacy training.

Please ask a specific question above or submit an inquiry via our **Contact Desk** to receive a tailored quotation.
**Direct Line:** +675 82545274 | **Email:** kilsta2023@gmail.com`;
}

// Multi-turn Gemini AI Chat Route with Cascade Failover & Timeout Protection
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], mode = 'general' } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(200).json({ 
        success: false, 
        error: 'Please enter a message to begin consultation.' 
      });
    }

    // Determine cascade priority list of models to try
    // We prioritize fast, high-availability models:
    let candidateModels: string[] = [];
    if (mode === 'fast') {
      candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
    } else if (mode === 'complex') {
      candidateModels = ['gemini-4-argon', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    } else {
      // General mode: try flash-lite first for instant response, or flash-latest
      candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    }

    // Assemble multi-turn history into GenAI format
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) { // keep last 8 messages for tight context
        if (item && item.text && (item.role === 'user' || item.role === 'model')) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(item.text) }],
          });
        }
      }
    }

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    let generatedReply: string | null = null;
    let successfulModel: string | null = null;
    let lastError: any = null;

    // Try candidate models in order with a 10s timeout per attempt
    for (const modelName of candidateModels) {
      try {
        console.log(`[Chat API] Attempting generation with model: ${modelName}`);
        
        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: KILSTA_SYSTEM_INSTRUCTION,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout after 10000ms with ${modelName}`)), 10000)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        
        if (response && response.text) {
          generatedReply = response.text;
          successfulModel = modelName;
          console.log(`[Chat API] Success with ${modelName}`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Chat API] Model ${modelName} failed or timed out:`, err?.message || err);
        // Continue to next model in cascade
      }
    }

    // If all AI models failed or experienced demand spikes (503/429), use KILSTA knowledge base fallback
    if (!generatedReply) {
      console.warn('[Chat API] All live AI models unavailable; serving KILSTA knowledge base response.');
      generatedReply = getKilstaKnowledgeFallback(message);
      successfulModel = 'kilsta-knowledge-engine';
    }

    return res.status(200).json({
      success: true,
      reply: generatedReply,
      modelUsed: successfulModel,
    });
  } catch (error: any) {
    console.error('Server Gemini Chat Route Catch-all Error:', error);
    // Never fail with raw 500 or broken JSON; provide verified fallback
    const fallback = getKilstaKnowledgeFallback(req.body?.message || '');
    return res.status(200).json({
      success: true,
      reply: fallback,
      modelUsed: 'kilsta-knowledge-engine',
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
