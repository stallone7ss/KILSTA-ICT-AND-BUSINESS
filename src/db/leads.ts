import { db } from './index.ts';
import { leads } from './schema.ts';
import { desc } from 'drizzle-orm';

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  serviceCategory: string;
  message: string;
}

export async function createLead(data: CreateLeadInput) {
  try {
    const result = await db
      .insert(leads)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        organization: data.organization || null,
        serviceCategory: data.serviceCategory,
        message: data.message,
        status: 'New',
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to create lead in PostgreSQL:', error);
    throw new Error('Database insertion failed. Please try again later.', { cause: error });
  }
}

export async function getLeads() {
  try {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  } catch (error) {
    console.error('Failed to fetch leads from PostgreSQL:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
