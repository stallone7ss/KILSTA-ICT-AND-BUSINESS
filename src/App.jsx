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
  Youtube,
  Lock
} from 'lucide-react';
import Services from './components/Services';
import Team from './components/Team';
import ContactForm from './components/ContactForm';
import MarqueeStrip from './components/MarqueeStrip';
import StarSparkles from './components/StarSparkles';
import AdminPortal from './components/AdminPortal';

export default function App() {
  const [selectedService, setSelectedService] = useState('');
  const [showArchitectureModal, setShowArchitectureModal] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSelectService = (serviceTitle) => {
    setSelectedService(serviceTitle);
  };

  const copySchemaSql = () => {
    const sqlContent = `// src/db/schema.ts - Drizzle ORM PostgreSQL Schema
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  organization: text('organization'),
  serviceCategory: text('service_category').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('New'),
  createdAt: timestamp('created_at').defaultNow(),
});`;
    navigator.clipboard?.writeText(sqlContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. State Credentials Trust Banner */}
      <div className="bg-orange-50/80 border-b border-orange-200/80 py-2 px-4 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-slate-700">
            <span className="flex items-center gap-1.5 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>Certified PNG Entity</span>
            </span>
            <span className="text-orange-300 hidden sm:inline" aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <img 
                src="/assets/aistudio/image_56d8a76b.png" 
                alt="Milne Bay Province Flag" 
                className="w-4 h-2.5 object-cover rounded-xs border border-slate-300 inline-block shrink-0" 
              />
              <span className="text-slate-900 font-semibold">Milne Bay Province</span>
            </span>
            <span className="text-orange-300 hidden sm:inline" aria-hidden="true">·</span>
            <span>
              IPA Reg No: <strong className="font-mono text-slate-900 tracking-wider">6-129295384</strong>
            </span>
            <span className="text-orange-300 hidden sm:inline" aria-hidden="true">·</span>
            <span>
              Tax ID (TIN): <strong className="font-mono text-orange-600 font-bold tracking-wider">502603269</strong>
            </span>
          </div>

          <div className="flex items-center gap-3.5 text-slate-700">
            <a 
              href="tel:+67582545274" 
              className="hover:text-orange-600 transition-colors flex items-center gap-1 text-slate-700 font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-orange-600" />
              <span className="font-mono">+675 82545274</span>
            </a>
            <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
            <div className="flex items-center gap-2.5">
              <a
                href="https://facebook.com/kilsta.consultants"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="KILSTA on Facebook"
                title="Follow KILSTA on Facebook"
                className="text-slate-500 hover:text-[#1877F2] transition-colors hover:scale-110"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com/company/kilsta-business-ict-consultants"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="KILSTA on LinkedIn"
                title="Connect with KILSTA on LinkedIn"
                className="text-slate-500 hover:text-[#0A66C2] transition-colors hover:scale-110"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com/@kilsta-consultants"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="KILSTA on YouTube"
                title="Watch KILSTA on YouTube"
                className="text-slate-500 hover:text-[#FF0000] transition-colors hover:scale-110"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
            <span className="text-slate-300 hidden md:inline" aria-hidden="true">·</span>
            <button
              onClick={() => setShowArchitectureModal(true)}
              className="text-slate-700 hover:text-orange-600 transition-colors flex items-center gap-1 text-[11px] underline underline-offset-2 font-medium"
            >
              <FileCode2 className="w-3.5 h-3.5 text-orange-500" />
              <span>PostgreSQL Database Specs</span>
            </button>
            <span className="text-slate-300 hidden md:inline" aria-hidden="true">·</span>
            <button
              onClick={() => setShowAdminPortal(true)}
              className="text-orange-700 hover:text-orange-800 font-bold transition-colors flex items-center gap-1 text-[11px] bg-orange-100 hover:bg-orange-200 px-2 py-0.5 rounded-md border border-orange-200 cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
              <span>Admin Portal</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark + official emblem */}
          <a href="#" className="flex items-center gap-3 shrink-0 whitespace-nowrap group">
            <img 
              src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png" 
              alt="KILSTA Business & ICT Consultants Emblem"
              className="w-10 h-10 object-contain rounded-full shadow-xs group-hover:scale-105 transition-transform"
            />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
              KILSTA Consultants
            </span>
          </a>

          {/* Zone 2: 4-5 single-line clean text links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <a href="#about" className="hover:text-orange-600 transition-colors whitespace-nowrap shrink-0">
              About &amp; History
            </a>
            <a href="#services" className="hover:text-orange-600 transition-colors whitespace-nowrap shrink-0">
              Services Portfolio
            </a>
            <a href="#starlink" className="hover:text-orange-600 transition-colors whitespace-nowrap shrink-0">
              Starlink Deployment
            </a>
            <a href="#team" className="hover:text-orange-600 transition-colors whitespace-nowrap shrink-0">
              Credentials Grid
            </a>
            <a href="#contact" className="hover:text-orange-600 transition-colors whitespace-nowrap shrink-0">
              Contact Desk
            </a>
          </nav>

          {/* Zone 3: 1 primary action + Admin Portal */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowAdminPortal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-orange-600 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-orange-600" />
              <span>Admin Portal</span>
            </button>
            <a
              href="#contact"
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-xs hover:shadow transition-all whitespace-nowrap shrink-0"
            >
              Request Consultation
            </a>
          </div>

        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/40 to-white pt-12 pb-20 border-b border-slate-200">
        {/* Animated starry spark background */}
        <StarSparkles count={34} />

        {/* Subtle decorative background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-orange-400/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* TOP OF HERO: Official Emblem of KILSTA Business & ICT Consultants, Company Name & Certified Advisory */}
          <div className="max-w-3xl mx-auto text-center mb-10">
            {/* Prominent Animated Emblem Logo with Star Sparkles */}
            <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 mb-5 transition-transform hover:scale-105 duration-300 animate-float">
              <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-xl pointer-events-none animate-pulse-halo" />
              
              {/* Surrounding Sparkling Stars */}
              <span className="absolute -top-2 -right-2 text-amber-500 animate-star-sparkle w-6 h-6 pointer-events-none z-20">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full filter drop-shadow-[0_0_6px_#f59e0b]">
                  <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
                </svg>
              </span>
              <span className="absolute -bottom-2 -left-2 text-orange-500 animate-star-sparkle w-5 h-5 pointer-events-none z-20" style={{ animationDelay: '1.2s' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full filter drop-shadow-[0_0_6px_#ea580c]">
                  <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
                </svg>
              </span>
              <span className="absolute top-1/2 -left-4 text-amber-400 animate-star-twinkle w-4 h-4 pointer-events-none z-20" style={{ animationDelay: '0.6s' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
                </svg>
              </span>
              <span className="absolute top-1/3 -right-3 text-orange-400 animate-star-twinkle w-4 h-4 pointer-events-none z-20" style={{ animationDelay: '1.8s' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
                </svg>
              </span>

              <img
                src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png"
                alt="Official Emblem of KILSTA Business & ICT Consultants"
                className="w-full h-full object-contain filter drop-shadow-xl relative z-10"
              />
            </div>

            {/* Official Company Title & Subtitle */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              KILSTA Business &amp; ICT Consultants
            </h2>
            <p className="text-xs sm:text-sm font-bold text-orange-600 tracking-widest uppercase mt-2">
              Certified Corporate &amp; Technology Advisory
            </p>

            {/* State Credentials & Physical HQ Strip */}
            <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 bg-white border border-slate-200 px-4 py-2 rounded-2xl text-xs text-slate-700 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                <span>IPA Reg: <strong className="font-mono text-slate-900">6-129295384</strong></span>
              </div>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">|</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <span>IRC Tax ID: <strong className="font-mono text-orange-600 font-bold">502603269</strong></span>
              </div>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">|</span>
              <div className="flex items-center gap-1.5 text-slate-700">
                <img 
                  src="/assets/aistudio/image_56d8a76b.png" 
                  alt="Milne Bay Province Flag" 
                  className="w-4 h-2.5 object-cover rounded-xs border border-slate-300 shrink-0" 
                />
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span>Gumini Village, Huhu LLG, Alotau, Milne Bay Province</span>
              </div>
            </div>
          </div>

          {/* DOWN: Motto, Main Headline, Narrative, Action Buttons & Compliance Badges */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Motto Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 shadow-xs">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Enhancing Through Business &amp; ICT Innovations</span>
            </div>

            {/* Main Value Proposition Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.18] text-balance">
              Accelerating Corporate Compliance &amp; High-Speed ICT Connectivity Across Papua New Guinea.
            </h1>

            {/* Body Narrative */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
              KILSTA bridges the critical gap between statutory business formalization and modern digital infrastructure. From Investment Promotion Authority (IPA) incorporations and IRC TIN compliance to turnkey Starlink satellite deployments and enterprise LAN networks, we empower PNG organisations with verified governance and resilient communications.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <a
                href="#services"
                className="px-6 py-3.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>Explore Dual Expertise</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="px-6 py-3.5 text-sm font-bold text-slate-800 bg-white hover:bg-orange-50 border border-slate-300 hover:border-orange-300 hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-xs transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>Initiate Project Inquiry</span>
              </a>
            </div>

            {/* Verified Compliance & Ownership Badges */}
            <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-600" />
                <span>100% Papua New Guinea Owned</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-600" />
                <span>Investment Promotion Authority (IPA) Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-600" />
                <span>Internal Revenue Commission (IRC) Compliant</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive Infinite Credentials & Capabilities Marquee Ribbon */}
      <MarqueeStrip speed="normal" />

      {/* 4. Operational History & Corporate Objectives */}
      <section id="about" className="py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 tracking-wider uppercase mb-2">
              <Compass className="w-4 h-4 text-orange-600" />
              Institutional Heritage &amp; Mission
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
              Operational History &amp; Corporate Objectives
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Formed in Milne Bay Province, KILSTA was established to answer an urgent national challenge: empowering local enterprises with verified statutory compliance while delivering modern ICT and satellite broadband.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg mb-5">
                  01
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Transitioning Informal Trade into Registered Enterprises
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Too many capable community groups, agricultural producers, and contractors in PNG are locked out of commercial finance and state procurement due to incomplete IPA records or unfiled IRC tax documentation. KILSTA systematizes formal registration and bookkeeping discipline.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-orange-600 font-semibold">
                Objective: 100% Statutory Tender Eligibility
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg mb-5 shadow-xs">
                  02
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Frontier Broadband &amp; Rural Satellite Telemetry
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rugged topography and island geography make traditional terrestrial fibre prohibitively expensive for rural Milne Bay. By engineering professional Starlink installations, solar-backed UPS setups, and structured Wi-Fi mesh, KILSTA delivers low-latency connectivity to remote outposts.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-orange-600 font-semibold">
                Objective: Zero Communication Blackouts
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg mb-5">
                  03
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Sustainable Local Human Capital Transfer
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Technology without skills transfer creates external dependency. KILSTA's training division conducts practical administrative bookkeeping, computing seminars, and technical troubleshooting workshops so local staff independently operate their systems.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-orange-600 font-semibold">
                Objective: Sustainable Community Self-Reliance
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Spotlight: Starlink Satellite Kit Installation */}
      <section id="starlink" className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-r from-orange-50/80 via-white to-orange-50/50 border border-orange-200/90 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xs">
            {/* Celestial Star Sparkles Ambiance */}
            <StarSparkles count={20} />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 tracking-wider uppercase">
                  <Satellite className="w-4 h-4 text-orange-600" />
                  <span>High-Priority Rural Service</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Starlink Satellite Kit Installations across Maritime &amp; Mainland PNG
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Eliminate connectivity bottlenecks. KILSTA provides turnkey deployment of Starlink Low-Earth Orbit (LEO) satellite terminals for health posts, schools, eco-lodges, agricultural stations, and local government offices in Milne Bay Province and beyond.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Rigid cyclone-rated roof &amp; tower pole mounts</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Ethernet bypass &amp; multi-building LAN distribution</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Lightning surge suppression &amp; UPS power matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Field obstruction calibration &amp; speed certification</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedService('Starlink Satellite Kit Installation');
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-xs transition-all flex items-center gap-2"
                  >
                    <Satellite className="w-4 h-4" />
                    <span>Book Starlink Site Assessment</span>
                  </button>
                  <a
                    href="tel:+67582545274"
                    className="px-5 py-3 text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-orange-50 border border-slate-300 hover:border-orange-300 hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-orange-600" />
                    <span>Call Starlink Field Desk</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Real Milne Bay Maritime & Island Deployment Showcase */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full rounded-2xl overflow-hidden border border-orange-200/90 bg-white shadow-xl group transition-all duration-300 hover:border-orange-400">
                  {/* Photo Container */}
                  <div className="relative h-60 sm:h-68 w-full overflow-hidden">
                    <img
                      src="/assets/aistudio/image_cef9c81d.png"
                      alt="Milne Bay Province Island Community & Maritime Transport"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    
                    {/* Badge on Photo */}
                    <div className="absolute top-3 left-3 bg-white/95 border border-slate-200 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-xs">
                      <img 
                        src="/assets/aistudio/image_56d8a76b.png" 
                        alt="Milne Bay Provincial Flag" 
                        className="w-4 h-2.5 object-cover rounded-xs border border-slate-300 shrink-0" 
                      />
                      <span className="text-[11px] font-bold text-slate-900 tracking-wide">
                        Milne Bay Maritime Deployment
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="font-semibold text-slate-100 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                        Island &amp; Coastal LLGs
                      </span>
                      <span className="font-mono font-bold text-orange-400 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                        150–250 Mbps LEO
                      </span>
                    </div>
                  </div>

                  {/* Caption & Specs */}
                  <div className="p-5 space-y-2.5 bg-white">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span className="flex items-center gap-1.5">
                        <Satellite className="w-4 h-4 text-orange-600" />
                        <span>Bridging Geographical Isolation</span>
                      </span>
                      <span className="text-xs text-orange-600 font-mono font-bold">Turnkey Service</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
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
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-12 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-200">
            
            {/* Col 1: Brand & Emblem */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png" 
                  alt="KILSTA Logo" 
                  className="w-10 h-10 object-contain rounded-full shadow-xs"
                />
                <span className="text-base font-extrabold text-slate-900">
                  KILSTA Consultants
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enhancing Through Business &amp; ICT Innovations. Certified corporate consultancy and technology engineering firm in Papua New Guinea.
              </p>
              <div className="text-[11px] text-slate-600 font-mono space-y-0.5">
                <div>IPA No: <strong className="text-slate-800">6-129295384</strong></div>
                <div>TIN No: <strong className="text-orange-600 font-bold">502603269</strong></div>
              </div>

              {/* Social Channels */}
              <div className="pt-1">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Official Channels
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://facebook.com/kilsta.consultants"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="KILSTA Facebook Page"
                    title="Follow on Facebook"
                    className="w-8 h-8 rounded-lg bg-white hover:bg-[#1877F2] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-200 shadow-2xs hover:scale-110"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com/company/kilsta-business-ict-consultants"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="KILSTA LinkedIn Profile"
                    title="Connect on LinkedIn"
                    className="w-8 h-8 rounded-lg bg-white hover:bg-[#0A66C2] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-200 shadow-2xs hover:scale-110"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com/@kilsta-consultants"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="KILSTA YouTube Channel"
                    title="Watch on YouTube"
                    className="w-8 h-8 rounded-lg bg-white hover:bg-[#FF0000] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-200 shadow-2xs hover:scale-110"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Col 2: Navigation Mirror */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
                Corporate Tracks
              </span>
              <ul className="space-y-1.5 font-medium">
                <li><a href="#about" className="hover:text-orange-600 transition-colors">Operational History</a></li>
                <li><a href="#services" className="hover:text-orange-600 transition-colors">Section A: Business Services</a></li>
                <li><a href="#services" className="hover:text-orange-600 transition-colors">Section B: ICT &amp; Training</a></li>
                <li><a href="#starlink" className="hover:text-orange-600 transition-colors">Starlink Satellite Kits</a></li>
                <li><a href="#team" className="hover:text-orange-600 transition-colors">Executive Management</a></li>
              </ul>
            </div>

            {/* Col 3: Direct Contacts */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
                Direct Communications
              </span>
              <ul className="space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-orange-600" />
                  <a href="tel:+67582545274" className="hover:text-orange-600 transition-colors font-mono">
                    +675 82545274
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-orange-600" />
                  <a href="mailto:kilsta2023@gmail.com" className="hover:text-orange-600 transition-colors">
                    kilsta2023@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2 pt-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                  <span>Gumini Village, Huhu LLG, Alotau District, Milne Bay Province, PNG</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Technical Gateway Specs */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Database Architecture
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integrated with high-performance managed PostgreSQL utilizing Drizzle ORM and lazy connection pooling for ultra-low latency rural Papua New Guinea intake.
              </p>
              <button
                onClick={() => setShowArchitectureModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-orange-50 border border-slate-300 hover:border-orange-300 rounded-lg text-[11px] font-semibold text-slate-800 transition-colors shadow-2xs"
              >
                <FileCode2 className="w-3.5 h-3.5 text-orange-600" />
                <span>View schema.ts &amp; Architecture</span>
              </button>
            </div>

          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} KILSTA Business &amp; ICT Consultants. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-slate-600">
              <span>Milne Bay Province, Papua New Guinea</span>
              <span aria-hidden="true">·</span>
              <span>IPA Reg: 6-129295384</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 10. PostgreSQL Database Architecture Modal */}
      {showArchitectureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    PostgreSQL Database Architecture &amp; ORM
                  </h3>
                  <span className="text-xs text-orange-600 font-semibold">
                    Managed Cloud PostgreSQL + Drizzle ORM + Connection Pooling
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowArchitectureModal(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 leading-relaxed font-sans">
              <div className="bg-orange-50/70 p-4 rounded-xl border border-orange-200 text-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  PostgreSQL Pipeline Mechanics
                </span>
                <p>
                  <strong>Managed PostgreSQL</strong> delivers transactional ACID safety and robust relational data modeling. Server-side connection pooling maintains warm connections, eliminating heavy handshake overhead on mobile 3G/4G or Starlink satellite links.
                </p>
                <p>
                  <strong>Drizzle ORM</strong> provides end-to-end TypeScript type-safety between API routes, client inquiries, and SQL tables (`leads` and `users`), ensuring strict data integrity without runtime ORM bloat.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 uppercase tracking-wider">
                    schema.ts (Drizzle PostgreSQL Schema)
                  </span>
                  <button
                    onClick={copySchemaSql}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white transition-colors text-[11px] font-semibold"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Schema'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-200 overflow-x-auto leading-normal">
{`// src/db/schema.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table with Firebase UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Leads intake table for KILSTA project inquiries
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  organization: text('organization'),
  serviceCategory: text('service_category').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('New'),
  createdAt: timestamp('created_at').defaultNow(),
});`}
                </pre>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <a
                href="https://console.firebase.google.com/project/velvety-joy-5sjh2/firestore/databases/ai-studio-kilstabusinessic-7a1e1b24-5472-4dd7-9644-64c1a73de32a/data"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors border border-orange-200"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Requests in Firebase Console</span>
              </a>

              <button
                onClick={() => setShowArchitectureModal(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
              >
                Close Architecture View
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 11. Interactive Admin Portal for Viewing and Editing Inquiries */}
      <AdminPortal 
        isOpen={showAdminPortal} 
        onClose={() => setShowAdminPortal(false)} 
      />

    </div>
  );
}
