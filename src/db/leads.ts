import { db } from './index.ts';
import { leads } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  serviceCategory: string;
  message: string;
}

export interface UpdateLeadInput {
  status?: string;
  phone?: string | null;
  organization?: string | null;
  serviceCategory?: string;
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

export async function updateLead(id: number, data: UpdateLeadInput) {
  try {
    const updateData: Record<string, any> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.organization !== undefined) updateData.organization = data.organization;
    if (data.serviceCategory !== undefined) updateData.serviceCategory = data.serviceCategory;

    const result = await db
      .update(leads)
      .set(updateData)
      .where(eq(leads.id, id))
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to update lead in PostgreSQL:', error);
    throw new Error('Database update failed. Please try again later.', { cause: error });
  }
}

export async function deleteLead(id: number) {
  try {
    const result = await db
      .delete(leads)
      .where(eq(leads.id, id))
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to delete lead in PostgreSQL:', error);
    throw new Error('Database deletion failed. Please try again later.', { cause: error });
  }
}
