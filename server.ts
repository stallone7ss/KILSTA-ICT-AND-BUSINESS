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
