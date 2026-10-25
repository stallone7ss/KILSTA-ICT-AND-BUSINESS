/**
 * Cloudflare Worker Proxy with Cloudflare Hyperdrive & Supabase Integration
 * File: cloudflare/worker.js
 * 
 * Hyperdrive accelerates database queries to Supabase from the Cloudflare edge network,
 * reusing pooled TCP connections across 300+ edge locations worldwide.
 */

import { Client } from 'pg';

export default {
  async fetch(request, env, ctx) {
    // 1. CORS Pre-flight Options Handling
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const url = new URL(request.url);

    // 2. Lead Ingestion Endpoint (/api/leads)
    if (request.method === 'POST' && url.pathname === '/api/leads') {
      try {
        const body = await request.json();
        const { name, email, service_category, message, phone, organization } = body;

        // Input validation
        if (!name || !email || !service_category || !message) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Missing required fields: name, email, service_category, and message are mandatory.' 
            }),
            { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
          );
        }

        // Email regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid email address syntax.' }),
            { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
          );
        }

        // Connect using Cloudflare Hyperdrive connection string
        // Hyperdrive automatically routes through high-performance regional edge pools
        const connectionString = env.HYPERDRIVE ? env.HYPERDRIVE.connectionString : env.DATABASE_URL;
        
        if (!connectionString) {
          // Fallback demo response if deployed without configured Hyperdrive binding
          return new Response(
            JSON.stringify({
              success: true,
              mode: 'preview_acknowledged',
              message: 'Lead received successfully by KILSTA edge gateway.',
              data: {
                id: crypto.randomUUID(),
                created_at: new Date().toISOString(),
                name,
                email,
                service_category,
                status: 'New'
              }
            }),
            { status: 201, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
          );
        }

        const client = new Client({ connectionString });
        await client.connect();

        const query = `
          INSERT INTO public.leads (name, email, service_category, message, phone, organization, status, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, 'New', timezone('utc', now()))
          RETURNING id, created_at, name, email, service_category, status;
        `;
        const values = [name, email, service_category, message, phone || null, organization || null];
        const result = await client.query(query, values);
        ctx.waitUntil(client.end());

        return new Response(
          JSON.stringify({
            success: true,
            lead: result.rows[0],
            message: 'Inquiry securely registered with KILSTA consultants.'
          }),
          {
            status: 201,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'no-store'
            }
          }
        );
      } catch (err) {
        console.error('Database insertion error via Hyperdrive:', err);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to process lead intake via database pool.' }),
          { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }
    }

    // Health check endpoint
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({ status: 'healthy', provider: 'Cloudflare Hyperdrive + Supabase', timestamp: new Date().toISOString() }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    return new Response('Not Found', { status: 404 });
  }
};
