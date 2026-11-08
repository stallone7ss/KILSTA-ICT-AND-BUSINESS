import express from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createLead, getLeads } from './src/db/leads.ts';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Public leads intake route: stores client inquiry directly into PostgreSQL
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, organization, service_category, message } = req.body;
    if (!name || !email || !service_category || !message) {
      return res.status(400).json({ error: 'Missing required inquiry fields' });
    }

    const newLead = await createLead({
      name,
      email,
      phone,
      organization,
      serviceCategory: service_category,
      message,
    });

    res.status(201).json({
      success: true,
      lead: newLead,
      message: 'Inquiry successfully saved to PostgreSQL database.',
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
