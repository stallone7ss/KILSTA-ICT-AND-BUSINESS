import pg from 'pg';
const { Client } = pg;

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  try {
    const { name, email, service_category, message } = await request.json();

    if (!name || !email || !service_category) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Connects via your KILSTA_DB Hyperdrive binding pool
    const client = new Client({ connectionString: env.KILSTA_DB.connectionString });
    await client.connect();

    const query = `
      INSERT INTO leads (name, email, service_category, message, status) 
      VALUES ($1, $2, $3, $4, 'New') 
      RETURNING id;
    `;
    const values = [name, email, service_category, message || ''];
    const result = await client.query(query, values);
    
    await client.end();

    return new Response(JSON.stringify({ success: true, id: result.rows.id }), {
      status: 201,
      headers: corsHeaders
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Database error", details: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}
