-- ==============================================================================
-- KILSTA Business & ICT Consultants
-- Production Supabase PostgreSQL Database Architecture & RLS Security Script
-- File: schema.sql
-- 
-- Credentials:
--   IPA Registration No: 6-129295384
--   Tax Identification No (TIN): 502603269
--   Headquarters: Gumini Village, Huhu LLG, Alotau District, Milne Bay Province, PNG
--
-- Infrastructure Integration:
--   - Cloudflare Pages Frontend
--   - Cloudflare Worker Proxy
--   - Cloudflare Hyperdrive Connection Pooling (TCP/SSL Acceleration)
--   - Supabase Managed PostgreSQL
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & CORE PREREQUISITES
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ------------------------------------------------------------------------------
-- 2. CUSTOM DOMAINS & ENUM TYPES
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status_enum') THEN
        CREATE TYPE public.lead_status_enum AS ENUM (
            'New',
            'Contacted',
            'In Scoping',
            'Proposal Sent',
            'In Progress',
            'Completed',
            'Archived'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_priority_enum') THEN
        CREATE TYPE public.lead_priority_enum AS ENUM (
            'Standard',
            'High',
            'Urgent',
            'Deferred'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_division_enum') THEN
        CREATE TYPE public.service_division_enum AS ENUM (
            'Business Compliance',
            'ICT & Satellite',
            'Capacity Building',
            'General Corporate'
        );
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 3. CORE TABLE: LEADS (Client Inquiries & Project Intakes)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    
    -- Client Contact Particulars
    name TEXT NOT NULL CHECK (char_length(trim(name)) >= 2),
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone TEXT,
    organization TEXT,
    
    -- Service Classification & Scoping
    service_category TEXT NOT NULL CHECK (char_length(trim(service_category)) >= 2),
    service_division public.service_division_enum NOT NULL DEFAULT 'General Corporate',
    message TEXT NOT NULL CHECK (char_length(trim(message)) >= 5),
    
    -- Internal Workflow Governance
    status public.lead_status_enum NOT NULL DEFAULT 'New',
    priority public.lead_priority_enum NOT NULL DEFAULT 'Standard',
    assigned_to TEXT,
    admin_notes TEXT,
    
    -- Telemetry & Network Provenance (from Cloudflare Worker Proxy)
    ip_address INET,
    client_timezone TEXT DEFAULT 'Pacific/Port_Moresby',
    source TEXT DEFAULT 'KILSTA Cloudflare Portal',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ------------------------------------------------------------------------------
-- 4. AUDIT & ACTIVITY LOGGING TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lead_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    action TEXT NOT NULL,
    actor TEXT NOT NULL DEFAULT 'system',
    previous_state JSONB,
    new_state JSONB,
    notes TEXT
);

-- ------------------------------------------------------------------------------
-- 5. PERFORMANCE & HYPERDRIVE INDEXING PIPELINE
-- ------------------------------------------------------------------------------
-- Hyperdrive pools and caches prepared queries across Cloudflare edge PoPs
CREATE INDEX IF NOT EXISTS idx_leads_created_at_desc ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_service_division ON public.leads (service_division);
CREATE INDEX IF NOT EXISTS idx_leads_service_category ON public.leads (service_category);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads (assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_metadata_gin ON public.leads USING GIN (metadata);

-- Trigram full-text search index across name, organization, and message
CREATE INDEX IF NOT EXISTS idx_leads_search_gin ON public.leads USING GIN (
    to_tsvector('english', name || ' ' || coalesce(organization, '') || ' ' || message)
);

CREATE INDEX IF NOT EXISTS idx_lead_logs_lead_id ON public.lead_activity_logs (lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_logs_timestamp ON public.lead_activity_logs (timestamp DESC);

-- ------------------------------------------------------------------------------
-- 6. AUTOMATED BUSINESS LOGIC TRIGGERS & FUNCTIONS
-- ------------------------------------------------------------------------------

-- Function A: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_leads_updated_at ON public.leads;
CREATE TRIGGER trg_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_set_updated_at();

-- Function B: Intelligent Departmental Routing
-- Automatically categorizes division and assigns responsible founding director:
--   - Wilson Hugh: Business Services, IPA, IRC TIN, Proposals, Bookkeeping
--   - Clifford Jones: Technical Workshops, Staff Training, Computing
--   - Stallone Yabom: Starlink Satellite Kits, Networking, Databases, Web Systems
CREATE OR REPLACE FUNCTION public.fn_route_lead_department()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.service_category ILIKE '%IPA%' 
       OR NEW.service_category ILIKE '%TIN%' 
       OR NEW.service_category ILIKE '%Profile Writing%'
       OR NEW.service_category ILIKE '%Proposal%'
       OR NEW.service_category ILIKE '%Bookkeeping%' THEN
        NEW.service_division := 'Business Compliance';
        NEW.assigned_to := coalesce(NEW.assigned_to, 'Mr. Wilson Hugh (Principle Director)');
    
    ELSIF NEW.service_category ILIKE '%Training%' 
       OR NEW.service_category ILIKE '%Workshop%' 
       OR NEW.service_category ILIKE '%Computing%' THEN
        NEW.service_division := 'Capacity Building';
        NEW.assigned_to := coalesce(NEW.assigned_to, 'Mr. Clifford Jones (Training Manager)');
    
    ELSIF NEW.service_category ILIKE '%Starlink%' 
       OR NEW.service_category ILIKE '%Network%' 
       OR NEW.service_category ILIKE '%Database%' 
       OR NEW.service_category ILIKE '%Web%' THEN
        NEW.service_division := 'ICT & Satellite';
        NEW.assigned_to := coalesce(NEW.assigned_to, 'Mr. Stallone Yabom (ICT Manager)');
    ELSE
        NEW.service_division := 'General Corporate';
        NEW.assigned_to := coalesce(NEW.assigned_to, 'KILSTA Executive Desk');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_leads_route_department ON public.leads;
CREATE TRIGGER trg_leads_route_department
    BEFORE INSERT ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_route_lead_department();

-- Function C: Automatic Audit Logging on Lead Creation and Status Changes
CREATE OR REPLACE FUNCTION public.fn_audit_lead_events()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.lead_activity_logs (lead_id, action, actor, new_state, notes)
        VALUES (
            NEW.id,
            'LEAD_INGESTED',
            'Cloudflare Hyperdrive Gateway',
            to_jsonb(NEW),
            'Inquiry received from ' || NEW.name || ' (' || NEW.service_category || ')'
        );
    ELSIF (TG_OP = 'UPDATE') AND (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.lead_activity_logs (lead_id, action, actor, previous_state, new_state, notes)
        VALUES (
            NEW.id,
            'STATUS_TRANSITION',
            coalesce(current_setting('request.jwt.claim.email', true), 'admin_session'),
            jsonb_build_object('status', OLD.status),
            jsonb_build_object('status', NEW.status),
            'Lead state altered from ' || OLD.status || ' to ' || NEW.status
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_leads_audit ON public.leads;
CREATE TRIGGER trg_leads_audit
    AFTER INSERT OR UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_audit_lead_events();

-- ------------------------------------------------------------------------------
-- 7. ROW-LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activity_logs ENABLE ROW LEVEL SECURITY;

-- 7.1 Public / Anonymous INSERT Policy:
-- Unauthenticated prospective clients submitting inquiries via Cloudflare Pages
CREATE POLICY "Allow public insert to leads"
    ON public.leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        char_length(trim(name)) >= 2 AND
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
        char_length(trim(message)) >= 5
    );

-- 7.2 Authenticated Administrator SELECT Policy:
-- Restricted exclusively to authorized KILSTA staff and administrators
CREATE POLICY "Allow authenticated read leads"
    ON public.leads
    FOR SELECT
    TO authenticated
    USING (true);

-- 7.3 Authenticated Administrator UPDATE Policy:
CREATE POLICY "Allow authenticated update leads"
    ON public.leads
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7.4 Authenticated Administrator DELETE Policy:
CREATE POLICY "Allow authenticated delete leads"
    ON public.leads
    FOR DELETE
    TO authenticated
    USING (true);

-- 7.5 Activity Logs RLS: Authenticated Admins Only
CREATE POLICY "Allow authenticated read activity logs"
    ON public.lead_activity_logs
    FOR SELECT
    TO authenticated
    USING (true);

-- ------------------------------------------------------------------------------
-- 8. EXECUTIVE REPORTING & PIPELINE VIEWS
-- ------------------------------------------------------------------------------

-- View 1: Service Division Metrics Summary
CREATE OR REPLACE VIEW public.v_lead_metrics_summary AS
SELECT 
    service_division,
    COUNT(*) AS total_inquiries,
    COUNT(*) FILTER (WHERE status = 'New') AS new_leads,
    COUNT(*) FILTER (WHERE status IN ('Contacted', 'In Scoping', 'Proposal Sent', 'In Progress')) AS active_leads,
    COUNT(*) FILTER (WHERE status = 'Completed') AS completed_contracts,
    ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600)::numeric, 1) AS avg_turnaround_hours
FROM public.leads
GROUP BY service_division;

-- View 2: High-Priority Executive Action Pipeline
CREATE OR REPLACE VIEW public.v_executive_pipeline AS
SELECT 
    id,
    created_at,
    name,
    organization,
    service_category,
    service_division,
    assigned_to,
    status,
    priority,
    DATE_PART('day', now() - created_at) AS days_open
FROM public.leads
WHERE status NOT IN ('Completed', 'Archived')
ORDER BY 
    CASE priority
        WHEN 'Urgent' THEN 1
        WHEN 'High' THEN 2
        WHEN 'Standard' THEN 3
        ELSE 4
    END,
    created_at ASC;

-- ------------------------------------------------------------------------------
-- 9. SCHEMA AUDIT & DOCUMENTATION METADATA
-- ------------------------------------------------------------------------------
COMMENT ON TABLE public.leads IS 'Primary ingestion repository for KILSTA Business & ICT Consultants inquiries, accelerated via Cloudflare Hyperdrive';
COMMENT ON COLUMN public.leads.id IS 'Cryptographic UUID primary key generated via pgcrypto gen_random_uuid()';
COMMENT ON COLUMN public.leads.assigned_to IS 'Responsible executive director automatically routed by trigger';
COMMENT ON COLUMN public.leads.service_division IS 'High-level business cluster: Business Compliance, ICT & Satellite, Capacity Building';
COMMENT ON TABLE public.lead_activity_logs IS 'Append-only audit ledger tracking every status change and worker ingestion event';
COMMENT ON VIEW public.v_lead_metrics_summary IS 'Real-time statistical aggregation view for KILSTA executive dashboard';
