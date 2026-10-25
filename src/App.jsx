import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  FileCode2, 
  Database, 
  Zap, 
  Satellite, 
  Globe2, 
  Compass, 
  Award, 
  Building2, 
  Layers,
  Sparkles,
  X,
  Copy,
  Check,
  Facebook,
  Linkedin,
  Youtube
} from 'lucide-react';
import Services from './components/Services';
import Team from './components/Team';
import ContactForm from './components/ContactForm';
import MarqueeStrip from './components/MarqueeStrip';

export default function App() {
  const [selectedService, setSelectedService] = useState('');
  const [showArchitectureModal, setShowArchitectureModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSelectService = (serviceTitle) => {
    setSelectedService(serviceTitle);
  };

  const copySchemaSql = () => {
    const sqlContent = `-- ==============================================================================
-- KILSTA Business & ICT Consultants: Supabase PostgreSQL Architecture
-- IPA Reg: 6-129295384 | TIN: 502603269 | Alotau, Milne Bay Province, PNG
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    name TEXT NOT NULL CHECK (char_length(trim(name)) >= 2),
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    phone TEXT,
    organization TEXT,
    service_category TEXT NOT NULL CHECK (char_length(trim(service_category)) >= 2),
    service_division TEXT NOT NULL DEFAULT 'General Corporate',
    message TEXT NOT NULL CHECK (char_length(trim(message)) >= 5),
    status TEXT NOT NULL DEFAULT 'New',
    priority TEXT NOT NULL DEFAULT 'Standard',
    assigned_to TEXT,
    admin_notes TEXT,
    ip_address INET,
    client_timezone TEXT DEFAULT 'Pacific/Port_Moresby',
    source TEXT DEFAULT 'KILSTA Cloudflare Portal',
    metadata JSONB DEFAULT '{}'::jsonb
);

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

-- Row-Level Security Configuration
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to leads"
    ON public.leads FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        char_length(trim(name)) >= 2 AND
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' AND
        char_length(trim(message)) >= 5
    );

CREATE POLICY "Allow authenticated read leads"
    ON public.leads FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated update leads"
    ON public.leads FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);`;
    navigator.clipboard?.writeText(sqlContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#2B4257] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. State Credentials Trust Banner */}
      <div className="bg-[#1F3142] border-b border-[#3B546D] py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-slate-300">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-[#53A58B]" />
              <span>Certified PNG Entity</span>
            </span>
            <span className="text-slate-500 hidden sm:inline" aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <img 
                src="/assets/aistudio/image_56d8a76b.png" 
                alt="Milne Bay Province Flag" 
                className="w-4 h-2.5 object-cover rounded-xs border border-slate-600 inline-block shrink-0" 
              />
              <span className="text-white font-medium">Milne Bay Province</span>
            </span>
            <span className="text-slate-500 hidden sm:inline" aria-hidden="true">·</span>
            <span>
              IPA Reg No: <strong className="font-mono text-white tracking-wider">6-129295384</strong>
            </span>
            <span className="text-slate-500 hidden sm:inline" aria-hidden="true">·</span>
            <span>
              Tax ID (TIN): <strong className="font-mono text-[#FFE715] tracking-wider">502603269</strong>
            </span>
          </div>

          <div className="flex items-center gap-3.5 text-slate-300">
            <a 
              href="tel:+67582545274" 
              className="hover:text-[#FFE715] transition-colors flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-[#53A58B]" />
              <span className="font-mono">+675 82545274</span>
            </a>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
            <div className="flex items-center gap-2.5">
              <a
                href="https://facebook.com/kilsta.consultants"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="KILSTA on Facebook"
                title="Follow KILSTA on Facebook"
                className="text-slate-400 hover:text-[#1877F2] transition-colors hover:scale-110"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com/company/kilsta-business-ict-consultants"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="KILSTA on LinkedIn"
                title="Connect with KILSTA on LinkedIn"
                className="text-slate-400 hover:text-[#0A66C2] transition-colors hover:scale-110"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com/@kilsta-consultants"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="KILSTA on YouTube"
                title="Watch KILSTA on YouTube"
                className="text-slate-400 hover:text-[#FF0000] transition-colors hover:scale-110"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
            <span className="text-slate-600 hidden md:inline" aria-hidden="true">·</span>
            <button
              onClick={() => setShowArchitectureModal(true)}
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] underline underline-offset-2"
            >
              <FileCode2 className="w-3.5 h-3.5 text-[#FFE715]" />
              <span>Cloudflare / Supabase Specs</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-40 bg-[#243748]/95 backdrop-blur-md border-b border-[#3A556F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark + official emblem */}
          <a href="#" className="flex items-center gap-3 shrink-0 whitespace-nowrap group">
            <img 
              src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png" 
              alt="KILSTA Business & ICT Consultants Emblem"
              className="w-10 h-10 object-contain rounded-full shadow-sm"
            />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white group-hover:text-[#FFE715] transition-colors">
              KILSTA Consultants
            </span>
          </a>

          {/* Zone 2: 4-5 single-line clean text links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <a href="#about" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              About &amp; History
            </a>
            <a href="#services" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Services Portfolio
            </a>
            <a href="#starlink" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Starlink Deployment
            </a>
            <a href="#team" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Credentials Grid
            </a>
            <a href="#contact" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Contact Desk
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#contact"
              className="px-4 py-2.5 text-xs sm:text-sm font-bold text-[#2B4257] bg-[#FFE715] hover:bg-[#ECCC00] rounded-xl shadow transition-colors whitespace-nowrap shrink-0"
            >
              Request Consultation
            </a>
          </div>

        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2B4257] via-[#243A4D] to-[#25394B] pt-12 pb-20 border-b border-[#3A556F]">
        {/* Subtle decorative background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-[#53A58B]/12 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* TOP OF HERO: Official Emblem of KILSTA Business & ICT Consultants, Company Name & Certified Advisory */}
          <div className="max-w-3xl mx-auto text-center mb-10">
            {/* Prominent Animated Emblem Logo */}
            <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 mb-5 transition-transform hover:scale-105 duration-300 animate-float">
              <div className="absolute inset-0 bg-[#FFE715]/20 rounded-full blur-xl pointer-events-none animate-pulse-halo" />
              <img
                src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png"
                alt="Official Emblem of KILSTA Business & ICT Consultants"
                className="w-full h-full object-contain filter drop-shadow-2xl relative z-10"
              />
            </div>

            {/* Official Company Title & Subtitle */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              KILSTA Business &amp; ICT Consultants
            </h2>
            <p className="text-xs sm:text-sm font-bold text-[#FFE715] tracking-widest uppercase mt-2">
              Certified Corporate &amp; Technology Advisory
            </p>

            {/* State Credentials & Physical HQ Strip */}
            <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 bg-[#1E3040]/90 border border-[#3E5C7A] px-4 py-2 rounded-2xl text-xs text-slate-300 shadow-sm">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-[#53A58B]" />
                <span>IPA Reg: <strong className="font-mono text-white">6-129295384</strong></span>
              </div>
              <span className="text-slate-600 hidden sm:inline" aria-hidden="true">|</span>
              <div className="flex items-center gap-1.5 font-semibold">
                <span>IRC Tax ID: <strong className="font-mono text-[#FFE715]">502603269</strong></span>
              </div>
              <span className="text-slate-600 hidden sm:inline" aria-hidden="true">|</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <img 
                  src="/assets/aistudio/image_56d8a76b.png" 
                  alt="Milne Bay Province Flag" 
                  className="w-4 h-2.5 object-cover rounded-xs border border-slate-600 shrink-0" 
                />
                <MapPin className="w-3.5 h-3.5 text-[#53A58B]" />
                <span>Gumini Village, Huhu LLG, Alotau, Milne Bay Province</span>
              </div>
            </div>
          </div>

          {/* DOWN: Motto, Main Headline, Narrative, Action Buttons & Compliance Badges */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Motto Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A2A38] border border-[#3E5C7A] text-xs font-bold text-[#FFE715] shadow-sm">
              <Sparkles className="w-4 h-4 text-[#FFE715]" />
              <span>Enhancing Through Business &amp; ICT Innovations</span>
            </div>

            {/* Main Value Proposition Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.18] text-balance">
              Accelerating Corporate Compliance &amp; High-Speed ICT Connectivity Across Papua New Guinea.
            </h1>

            {/* Body Narrative */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
              KILSTA bridges the critical gap between statutory business formalization and modern digital infrastructure. From Investment Promotion Authority (IPA) incorporations and IRC TIN compliance to turnkey Starlink satellite deployments and enterprise LAN networks, we empower PNG organisations with verified governance and resilient communications.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <a
                href="#services"
                className="px-6 py-3.5 text-sm font-bold text-white bg-[#53A58B] hover:bg-[#469179] hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>Explore Dual Expertise</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="px-6 py-3.5 text-sm font-bold text-[#2B4257] bg-[#FFE715] hover:bg-[#ECCC00] hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>Initiate Project Inquiry</span>
              </a>
            </div>

            {/* Verified Compliance & Ownership Badges */}
            <div className="pt-8 border-t border-[#37526D]/80 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#53A58B]" />
                <span>100% Papua New Guinea Owned</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#53A58B]" />
                <span>Investment Promotion Authority (IPA) Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#53A58B]" />
                <span>Internal Revenue Commission (IRC) Compliant</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive Infinite Credentials & Capabilities Marquee Ribbon */}
      <MarqueeStrip speed="normal" />

      {/* 4. Operational History & Corporate Objectives */}
      <section id="about" className="py-20 bg-[#2B4257] border-b border-[#37526D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#FFE715] tracking-wider uppercase mb-2">
              <Compass className="w-4 h-4 text-[#FFE715]" />
              Institutional Heritage &amp; Mission
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
              Operational History &amp; Corporate Objectives
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-300">
              Formed in Milne Bay Province, KILSTA was established to answer an urgent national challenge: empowering local enterprises with verified statutory compliance while delivering modern ICT and satellite broadband.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-[#243748] border border-[#3A556F] rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#53A58B]/20 text-[#53A58B] flex items-center justify-center font-bold text-lg mb-5">
                  01
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Transitioning Informal Trade into Registered Enterprises
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Too many capable community groups, agricultural producers, and contractors in PNG are locked out of commercial finance and state procurement due to incomplete IPA records or unfiled IRC tax documentation. KILSTA systematizes formal registration and bookkeeping discipline.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#344F69] text-xs text-[#FFE715] font-semibold">
                Objective: 100% Statutory Tender Eligibility
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#243748] border border-[#3A556F] rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FFE715]/20 text-[#FFE715] flex items-center justify-center font-bold text-lg mb-5">
                  02
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Frontier Broadband &amp; Rural Satellite Telemetry
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Rugged topography and island geography make traditional terrestrial fibre prohibitively expensive for rural Milne Bay. By engineering professional Starlink installations, solar-backed UPS setups, and structured Wi-Fi mesh, KILSTA delivers low-latency connectivity to remote outposts.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#344F69] text-xs text-[#53A58B] font-semibold">
                Objective: Zero Communication Blackouts
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#243748] border border-[#3A556F] rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#53A58B]/20 text-[#53A58B] flex items-center justify-center font-bold text-lg mb-5">
                  03
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Sustainable Local Human Capital Transfer
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Technology without skills transfer creates external dependency. KILSTA's training division conducts practical administrative bookkeeping, computing seminars, and technical troubleshooting workshops so local staff independently operate their systems.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#344F69] text-xs text-[#FFE715] font-semibold">
                Objective: Sustainable Community Self-Reliance
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Spotlight: Starlink Satellite Kit Installation */}
      <section id="starlink" className="py-20 bg-[#213241] border-b border-[#354F68] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-r from-[#24384A] to-[#1E2E3E] border border-[#3E5C7A] rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FFE715] tracking-wider uppercase">
                  <Satellite className="w-4 h-4 text-[#FFE715]" />
                  <span>High-Priority Rural Service</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Starlink Satellite Kit Installations across Maritime &amp; Mainland PNG
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Eliminate connectivity bottlenecks. KILSTA provides turnkey deployment of Starlink Low-Earth Orbit (LEO) satellite terminals for health posts, schools, eco-lodges, agricultural stations, and local government offices in Milne Bay Province and beyond.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle className="w-4 h-4 text-[#53A58B] shrink-0" />
                    <span>Rigid cyclone-rated roof &amp; tower pole mounts</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle className="w-4 h-4 text-[#53A58B] shrink-0" />
                    <span>Ethernet bypass &amp; multi-building LAN distribution</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle className="w-4 h-4 text-[#53A58B] shrink-0" />
                    <span>Lightning surge suppression &amp; UPS power matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle className="w-4 h-4 text-[#53A58B] shrink-0" />
                    <span>Field obstruction calibration &amp; speed certification</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedService('Starlink Satellite Kit Installation');
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-3 text-xs sm:text-sm font-bold text-[#2B4257] bg-[#FFE715] hover:bg-[#ECCC00] hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all flex items-center gap-2"
                  >
                    <Satellite className="w-4 h-4" />
                    <span>Book Starlink Site Assessment</span>
                  </button>
                  <a
                    href="tel:+67582545274"
                    className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-[#53A58B] hover:bg-[#469179] hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Starlink Field Desk</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Real Milne Bay Maritime & Island Deployment Showcase */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full rounded-2xl overflow-hidden border border-[#486B8C] bg-[#1A2835] shadow-2xl group transition-all duration-300 hover:border-[#53A58B]">
                  {/* Photo Container */}
                  <div className="relative h-60 sm:h-68 w-full overflow-hidden">
                    <img
                      src="/assets/aistudio/image_cef9c81d.png"
                      alt="Milne Bay Province Island Community & Maritime Transport"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A2835] via-[#1A2835]/30 to-transparent" />
                    
                    {/* Badge on Photo */}
                    <div className="absolute top-3 left-3 bg-[#1A2835]/90 border border-[#4A6987] backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <img 
                        src="/assets/aistudio/image_56d8a76b.png" 
                        alt="Milne Bay Provincial Flag" 
                        className="w-4 h-2.5 object-cover rounded-xs border border-slate-600 shrink-0" 
                      />
                      <span className="text-[11px] font-bold text-white tracking-wide">
                        Milne Bay Maritime Deployment
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="font-semibold text-slate-200 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                        Island &amp; Coastal LLGs
                      </span>
                      <span className="font-mono font-bold text-[#FFE715] bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                        150–250 Mbps LEO
                      </span>
                    </div>
                  </div>

                  {/* Caption & Specs */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="flex items-center gap-1.5">
                        <Satellite className="w-4 h-4 text-[#53A58B]" />
                        <span>Bridging Geographical Isolation</span>
                      </span>
                      <span className="text-xs text-[#53A58B] font-mono">Turnkey Service</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Deploying high-speed satellite broadband to remote island schools, aid posts, tourist eco-lodges, and maritime communities across Milne Bay's archipelagos.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Reverse Edge Capabilities Marquee */}
      <MarqueeStrip reverse speed="fast" />

      {/* 6. Corporate Solutions Infrastructure (Services Component) */}
      <Services onSelectService={handleSelectService} />

      {/* 7. Management & Credentials Grid (Team Component) */}
      <Team />

      {/* 8. Lead Intake Engine (ContactForm Component) */}
      <ContactForm 
        preselectedService={selectedService} 
        onResetPreselected={() => setSelectedService('')} 
      />

      {/* 9. Corporate Footer */}
      <footer className="bg-[#1D2B37] border-t border-[#344D64] pt-16 pb-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#2C4155]">
            
            {/* Col 1: Brand & Emblem */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png" 
                  alt="KILSTA Logo" 
                  className="w-10 h-10 object-contain rounded-full"
                />
                <span className="text-base font-extrabold text-white">
                  KILSTA Consultants
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enhancing Through Business &amp; ICT Innovations. Certified corporate consultancy and technology engineering firm in Papua New Guinea.
              </p>
              <div className="text-[11px] text-slate-400 font-mono">
                <div>IPA No: 6-129295384</div>
                <div>TIN No: 502603269</div>
              </div>

              {/* Social Channels */}
              <div className="pt-1">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Official Channels
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://facebook.com/kilsta.consultants"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="KILSTA Facebook Page"
                    title="Follow on Facebook"
                    className="w-8 h-8 rounded-lg bg-[#25394B] hover:bg-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-[#3A5672] hover:scale-110"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com/company/kilsta-business-ict-consultants"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="KILSTA LinkedIn Profile"
                    title="Connect on LinkedIn"
                    className="w-8 h-8 rounded-lg bg-[#25394B] hover:bg-[#0A66C2] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-[#3A5672] hover:scale-110"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com/@kilsta-consultants"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="KILSTA YouTube Channel"
                    title="Watch on YouTube"
                    className="w-8 h-8 rounded-lg bg-[#25394B] hover:bg-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-[#3A5672] hover:scale-110"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Col 2: Navigation Mirror */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3">
                Corporate Tracks
              </span>
              <ul className="space-y-1.5">
                <li><a href="#about" className="hover:text-white transition-colors">Operational History</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Section A: Business Services</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Section B: ICT &amp; Training</a></li>
                <li><a href="#starlink" className="hover:text-white transition-colors">Starlink Satellite Kits</a></li>
                <li><a href="#team" className="hover:text-white transition-colors">Executive Management</a></li>
              </ul>
            </div>

            {/* Col 3: Direct Contacts */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3">
                Direct Communications
              </span>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#FFE715]" />
                  <a href="tel:+67582545274" className="hover:text-white transition-colors font-mono">
                    +675 82545274
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#53A58B]" />
                  <a href="mailto:kilsta2023@gmail.com" className="hover:text-white transition-colors">
                    kilsta2023@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Gumini Village, Huhu LLG, Alotau District, Milne Bay Province, PNG</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Technical Gateway Specs */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Edge Architecture
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deployed via Cloudflare Pages edge network with Cloudflare Hyperdrive connection pooling to Supabase PostgreSQL for low-latency rural intake.
              </p>
              <button
                onClick={() => setShowArchitectureModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25394B] hover:bg-[#2F475D] border border-[#3C5874] rounded-lg text-[11px] font-semibold text-slate-200 transition-colors"
              >
                <FileCode2 className="w-3.5 h-3.5 text-[#FFE715]" />
                <span>View schema.sql &amp; RLS Blueprint</span>
              </button>
            </div>

          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-300">
            <div>
              &copy; {new Date().getFullYear()} KILSTA Business &amp; ICT Consultants. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Milne Bay Province, Papua New Guinea</span>
              <span aria-hidden="true">·</span>
              <span>IPA Reg: 6-129295384</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 10. Cloudflare Hyperdrive & Supabase Schema Modal */}
      {showArchitectureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#243748] border border-[#3E5C7A] rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#354F68] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#53A58B]/20 text-[#53A58B] flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Database Architecture &amp; Hyperdrive Gateway
                  </h3>
                  <span className="text-xs text-[#FFE715]">
                    Supabase PostgreSQL + Cloudflare Edge Pipeline
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowArchitectureModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#2F475D] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="bg-[#1C2B38] p-4 rounded-xl border border-[#31485E] space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Pipeline Mechanics
                </span>
                <p>
                  <strong>Cloudflare Hyperdrive</strong> pools and accelerates database connections across 300+ global edge cities. Instead of initiating heavy TLS handshakes from client devices or cold serverless lambdas, queries reuse established connections to Supabase PostgreSQL, reducing latency on mobile 3G/4G/Starlink connections.
                </p>
                <p>
                  <strong>Row-Level Security (RLS)</strong> is strictly enforced in PostgreSQL: anonymous visitors are granted INSERT permission exclusively, whereas administrative reading and modifications require authenticated JWT credentials.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white uppercase tracking-wider">
                    schema.sql (Supabase DDL &amp; RLS)
                  </span>
                  <button
                    onClick={copySchemaSql}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2D455A] hover:bg-[#53A58B] text-white transition-colors text-[11px]"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-[#FFE715]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy SQL'}</span>
                  </button>
                </div>
                <pre className="bg-[#17232E] p-4 rounded-xl border border-[#2F4457] font-mono text-[11px] text-slate-200 overflow-x-auto leading-normal">
{`CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Core Leads Ingestion Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    name TEXT NOT NULL CHECK (char_length(trim(name)) >= 2),
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    phone TEXT,
    organization TEXT,
    service_category TEXT NOT NULL,
    service_division TEXT NOT NULL DEFAULT 'General Corporate',
    message TEXT NOT NULL CHECK (char_length(trim(message)) >= 5),
    status TEXT NOT NULL DEFAULT 'New',
    priority TEXT NOT NULL DEFAULT 'Standard',
    assigned_to TEXT,
    ip_address INET,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Row-Level Security (RLS) Configuration
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to leads"
    ON public.leads FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        char_length(trim(name)) >= 2 AND
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
    );

CREATE POLICY "Allow authenticated read leads"
    ON public.leads FOR SELECT
    TO authenticated
    USING (true);`}
                </pre>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#354F68] bg-[#1F2F3E] flex justify-end">
              <button
                onClick={() => setShowArchitectureModal(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#53A58B] hover:bg-[#469179] rounded-lg transition-colors"
              >
                Close Architecture View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
