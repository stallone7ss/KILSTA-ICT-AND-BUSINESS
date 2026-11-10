import React, { useState } from 'react';
import { 
  Briefcase, 
  Wifi, 
  FileText, 
  ShieldCheck, 
  Receipt, 
  FileSpreadsheet, 
  GraduationCap, 
  Network, 
  Satellite, 
  Database, 
  Globe, 
  Laptop,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const businessServices = [
  {
    id: 'profile-writing',
    category: 'Business Services',
    title: 'Company Profile Writing',
    icon: FileText,
    summary: 'Comprehensive, institutional-grade company profiles tailored for statutory tenders, commercial banking, and joint-venture partnerships in Papua New Guinea.',
    deliverables: [
      'Executive summary & governance structure',
      'Capabilities statement aligned with PNG procurement standards',
      'Full visual branding layout (PDF & print-ready formats)',
      'Statutory compliance cross-referencing'
    ],
    target: 'Emerging contractors, established SMEs, joint ventures'
  },
  {
    id: 'ipa-registration',
    category: 'Business Services',
    title: 'IPA Registration Assistance',
    icon: ShieldCheck,
    summary: 'End-to-end facilitation with the Investment Promotion Authority (IPA) for new business names, local company incorporation, and annual returns.',
    deliverables: [
      'Name reservation & clearance vetting',
      'Form 1 / Form 2 corporate incorporation filing',
      'Constitution & share allocation advisory',
      'Official IPA Certificate of Incorporation handover'
    ],
    target: 'Startups, sole proprietors, corporate entities'
  },
  {
    id: 'irc-tin',
    category: 'Business Services',
    title: 'IRC TIN Applications & Compliance',
    icon: Receipt,
    summary: 'Registration and compliance processing for Internal Revenue Commission (IRC) Tax Identification Numbers, GST filings, and Certificate of Compliance (COC).',
    deliverables: [
      'TIN Application preparation & submission',
      'Salary / Wages Tax (SWT) setup guidance',
      'Goods & Services Tax (GST) documentation',
      'Liaison with provincial and national IRC desks'
    ],
    target: 'Commercial operators, service vendors, tender bidders'
  },
  {
    id: 'project-proposals',
    category: 'Business Services',
    title: 'Project Proposals & Feasibility Studies',
    icon: FileSpreadsheet,
    summary: 'Bankable business plans, grant proposals, and community development project feasibility documents aligned with donor and commercial lender guidelines.',
    deliverables: [
      'Financial modeling & cash flow projections',
      'Milestone roadmaps & risk matrices',
      'Donor / Bank requirement compliance check',
      'Executive pitch slide decks'
    ],
    target: 'Community initiatives, agriculture cooperatives, MSMEs'
  },
  {
    id: 'admin-bookkeeping',
    category: 'Business Services',
    title: 'Administration & Basic Bookkeeping Training',
    icon: GraduationCap,
    summary: 'Hands-on administrative skills transfer and basic bookkeeping methodology designed to institute fiscal hygiene and record-keeping discipline.',
    deliverables: [
      'Double-entry ledgers & daybook management',
      'Invoicing, receipting, and petty cash control',
      'Monthly bank reconciliation fundamentals',
      'Record-keeping templates for audit readiness'
    ],
    target: 'Office managers, accounts clerks, small business owners'
  }
];

const ictServices = [
  {
    id: 'networking',
    category: 'ICT Services & Trainings',
    title: 'Networking Setups & Maintenance',
    icon: Network,
    summary: 'Structured Ethernet cabling, secure enterprise Wi-Fi mesh, VLAN segmentation, and hardware routing repairs for offices, campuses, and health centres.',
    deliverables: [
      'Site survey, topology planning & structured cabling',
      'Managed switch & enterprise router configuration',
      'Firewall hardening & Wi-Fi coverage optimization',
      'Preventative maintenance and fault diagnostic visits'
    ],
    target: 'Provincial administrations, schools, commercial offices'
  },
  {
    id: 'starlink',
    category: 'ICT Services & Trainings',
    title: 'Starlink Satellite Kit Installations',
    icon: Satellite,
    summary: 'Turnkey satellite terminal installation, roof mounting, bypass router integration, and lightning surge protection across rural Milne Bay and maritime PNG.',
    deliverables: [
      'Obstruction-free alignment & rigid pole/roof mountings',
      'Ethernet bypass adapter & LAN distribution integration',
      'Surge suppression & backup UPS power advisory',
      'Speed testing & multi-user bandwidth management'
    ],
    target: 'Remote island communities, eco-resorts, schools, aid posts'
  },
  {
    id: 'database-dev',
    category: 'ICT Services & Trainings',
    title: 'Database Architecture & Development',
    icon: Database,
    summary: 'Design and deployment of secure, relational databases (PostgreSQL/Supabase) to digitize inventories, student rosters, or client records with Cloudflare caching.',
    deliverables: [
      'Normalized schema design & data migration',
      'Role-Based Access Control (RBAC) & security rules',
      'Automated daily backup & archival workflows',
      'Custom management dashboards for operators'
    ],
    target: 'Institutions, logistics firms, retail distributors'
  },
  {
    id: 'web-design',
    category: 'ICT Services & Trainings',
    title: 'Web Design & Corporate Portals',
    icon: Globe,
    summary: 'Modern, mobile-responsive corporate websites and web apps optimized for low-bandwidth conditions, custom domains, and fast edge delivery.',
    deliverables: [
      'Custom UI design with brand guidelines',
      'Mobile-first responsive layout & SEO setup',
      'Secure lead intake forms & document downloads',
      'Fast Cloudflare global CDN edge hosting'
    ],
    target: 'Tourism operators, consulting firms, government agencies'
  },
  {
    id: 'software-workshops',
    category: 'ICT Services & Trainings',
    title: 'Technical Software Workshops',
    icon: Laptop,
    summary: 'Practical computing seminars covering business productivity tools, accounting software, cloud storage hygiene, and digital security awareness.',
    deliverables: [
      'Curriculum customized to staff skill levels',
      'Practical computer-lab exercise modules',
      'Data security & threat avoidance guidelines',
      'Verified Certificate of Completion for attendees'
    ],
    target: 'Corporate workforces, teachers, administrative staff'
  }
];

export default function Services({ onSelectService }) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredServices = 
    activeTab === 'all' 
      ? [...businessServices, ...ictServices]
      : activeTab === 'business' 
        ? businessServices 
        : ictServices;

  const handleBook = (serviceTitle) => {
    if (onSelectService) {
      onSelectService(serviceTitle);
    }
    const target = document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 bg-slate-50/60 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 tracking-wider uppercase mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Dual Fields of Expertise
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Corporate Solutions Infrastructure
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            KILSTA unifies statutory business compliance with frontline ICT connectivity, equipping organisations in Papua New Guinea to operate formally and connect reliably.
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-xl w-fit mb-10 shadow-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            All Solutions (10)
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'business'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Section A: Business Services (5)
          </button>
          <button
            onClick={() => setActiveTab('ict')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'ict'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <Wifi className="w-4 h-4" />
            Section B: ICT &amp; Connectivity (5)
          </button>
        </div>

        {/* Dual Disciplines Overview Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 bg-white border border-blue-200 rounded-2xl relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Section A: Business Services</h3>
                <span className="text-xs text-blue-700 font-semibold">Compliance, Formalization &amp; Fiscal Hygiene</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Transition informal operations into legally recognized entities. We manage complete IPA incorporations, IRC Tax Identification Numbers, company profiles, and grant-ready project proposals.
            </p>
          </div>

          <div className="p-6 bg-white border border-emerald-200 rounded-2xl relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                B
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Section B: ICT Services &amp; Trainings</h3>
                <span className="text-xs text-emerald-600 font-semibold">Satellites, Networks &amp; Digital Systems</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bridge the digital divide across maritime and mainland provinces. We deploy Starlink satellite terminals, structured LAN/WLAN networks, relational databases, and corporate technical training.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            const isIct = service.category.includes('ICT');
            
            return (
              <div
                key={service.id}
                className="group flex flex-col justify-between p-6 bg-white hover:bg-slate-50/70 border border-slate-200 hover:border-blue-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10 rounded-2xl transition-all duration-300"
              >
                <div>
                  {/* Category label & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-500">
                      {service.category}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      isIct 
                        ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' 
                        : 'bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {service.summary}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="border-t border-slate-100 pt-4 mb-5">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                      Key Deliverables
                    </span>
                    <ul className="space-y-1.5">
                      {service.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer action & target */}
                <div className="border-t border-slate-100 pt-4 mt-2">
                  <div className="text-xs text-slate-500 mb-3 truncate">
                    <strong className="text-slate-700">Best for:</strong> {service.target}
                  </div>
                  <button
                    onClick={() => handleBook(service.title)}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white rounded-xl shadow-xs transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 hover:scale-[1.02] active:scale-[0.98] ${
                      isIct 
                        ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-400' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400'
                    }`}
                  >
                    <span>Request Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
