import React, { useState } from 'react';
import { Award, GraduationCap, Mail, Phone, ShieldCheck, UserCheck, X, ExternalLink, Maximize2 } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

const leaders = [
  {
    name: 'Mr. Wilson Hugh',
    title: 'Principle Director & Admin Manager',
    roleTag: 'Executive Governance & Finance',
    bio: 'Oversees corporate strategy, statutory compliance, and economic feasibility. With deep roots in Papua New Guinea fiscal frameworks, Mr. Hugh coordinates client engagements for IPA formalization, tax governance, and commercial project modeling.',
    image: null,
    qualifications: [
      {
        degree: 'Bachelor in Pure Economics',
        institution: 'University of Papua New Guinea (UPNG)',
        year: 'UPNG School of Business & Public Policy'
      },
      {
        degree: 'Diploma in Accounting',
        institution: 'University of Papua New Guinea (UPNG)',
        year: 'UPNG Division of Accounting'
      }
    ],
    specialties: [
      'Corporate Law & IPA Incorporation',
      'Macro & Microeconomic Scoping',
      'Tax Identification & IRC Compliance',
      'Project Budgeting & Feasibility'
    ]
  },
  {
    name: 'Mr. Clifford Jones',
    title: 'Training Manager',
    roleTag: 'Computing & Capacity Building',
    image: '/assets/aistudio/image_afc81531.png',
    bio: 'Drives technical training initiatives and curriculum architecture. Holding triple qualifications across Australian and PNG institutions, Mr. Jones spearheads enterprise capacity building, hands-on software workshops, and professional workforce upskilling.',
    qualifications: [
      {
        degree: 'Post Graduate Diploma in Professional Computing',
        institution: 'University of Southern Queensland (USQ), Australia',
        year: 'USQ Faculty of Health, Engineering & Sciences'
      },
      {
        degree: 'Bachelor in Computer Science',
        institution: 'PNG University of Technology (PNG Unitech)',
        year: 'Unitech Department of Computer Science'
      },
      {
        degree: 'Diploma in Computer Science',
        institution: 'PNG University of Technology (PNG Unitech)',
        year: 'Unitech School of Information Technology'
      },
      {
        degree: 'Diploma in Business Management',
        institution: 'International Training Institute (ITI)',
        year: 'ITI Corporate Governance Wing'
      }
    ],
    specialties: [
      'Institutional Software Workshops',
      'Professional Computing Curriculum',
      'Business Administration Training',
      'IT Workforce Capability Standards'
    ]
  },
  {
    name: 'Mr. Stallone Yabom',
    title: 'ICT Manager',
    roleTag: 'Infrastructure & Field Operations',
    image: '/assets/aistudio/image_1b750f55.png',
    bio: 'Leads engineering operations, field technical teams, and rural communications rollout. Mr. Yabom oversees turnkey Starlink satellite installations, structured office networks, database development, and high-reliability connectivity across maritime LLGs.',
    qualifications: [
      {
        degree: 'Bachelor in Natural Science',
        institution: 'University of Goroka (UOG)',
        year: 'UOG School of Science & Technology'
      }
    ],
    specialties: [
      'Starlink Satellite Deployment & Alignment',
      'Enterprise LAN/WLAN Mesh Infrastructure',
      'Database Architecture & Cloudflare Caching',
      'Rural & Island Technical Telecommunications'
    ]
  }
];

export default function Team() {
  const [selectedPortrait, setSelectedPortrait] = useState(null);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="team" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 tracking-wider uppercase mb-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            Leadership &amp; Academic Pedigree
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Executive Leadership &amp; Credentials Grid
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Meet the Papua New Guinean directors and technical leaders spearheading corporate governance, professional computing workshops, and turnkey Starlink telecommunications across Milne Bay Province.
          </p>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {leaders.map((leader, idx) => (
            <div 
              key={idx}
              className="flex flex-col justify-between bg-white border border-slate-200 hover:border-blue-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10 rounded-3xl p-6 sm:p-7 transition-all duration-300 group shadow-xs"
            >
              <div>
                {/* Executive Portrait Showcase Header */}
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden mb-6 bg-slate-100 border border-slate-200 group-hover:border-blue-300 transition-all shadow-xs">
                  {leader.image ? (
                    <>
                      <img 
                        src={leader.image} 
                        alt={leader.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => setSelectedPortrait(leader)}
                        title={`Click to enlarge ${leader.name}'s official portrait`}
                      />
                      <button
                        onClick={() => setSelectedPortrait(leader)}
                        aria-label={`View enlarged portrait of ${leader.name}`}
                        className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                        title="Enlarge Photo"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 p-6 text-center">
                      <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-md mb-3">
                        {leader.name.split(' ').slice(1).map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-black text-slate-900">
                        {leader.name}
                      </span>
                      <span className="text-xs text-blue-700 font-semibold mt-1">
                        Principal Director &amp; Admin Manager
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        University of Papua New Guinea (UPNG)
                      </span>
                    </div>
                  )}

                  {/* Role Tag Overlay */}
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-bold text-emerald-950 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full border border-emerald-300 shadow-xs">
                      {leader.roleTag}
                    </span>
                  </div>

                  {/* Verified Badge Overlay */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Verified Leader</span>
                  </div>
                </div>

                {/* Name & Title */}
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {leader.name}
                </h3>
                <p className="text-sm font-semibold text-blue-700 mt-0.5 mb-4">
                  {leader.title}
                </p>

                {/* Bio */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {leader.bio}
                </p>

                {/* Academic Credentials */}
                <div className="border-t border-slate-100 pt-5 mb-5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Accredited Qualifications</span>
                  </div>
                  <div className="space-y-3">
                    {leader.qualifications.map((qual, qIdx) => (
                      <div key={qIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{qual.degree}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1 pl-5">
                          {qual.institution}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Core Competencies */}
                <div className="border-t border-slate-100 pt-4 mb-6">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                    Core Specializations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {leader.specialties.map((item, sIdx) => (
                      <span 
                        key={sIdx}
                        className="text-[11px] text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={scrollToContact}
                  className="py-2.5 px-3 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-blue-600 hover:text-white hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all duration-200 border border-slate-200 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600 group-hover:text-white" />
                  <span>Inquire</span>
                </button>
                <a
                  href={`https://wa.me/67582545274?text=${encodeURIComponent(`Hello KILSTA, I would like to consult with ${leader.name} regarding corporate or ICT services.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-[#25D366] hover:text-white hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all duration-200 border border-emerald-200 flex items-center justify-center gap-1.5 shadow-xs"
                  title={`Direct WhatsApp chat with ${leader.name}`}
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] group-hover:text-white" />
                  <span>WhatsApp</span>
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* Credential Authenticity Banner */}
        <div className="mt-12 p-5 bg-gradient-to-r from-blue-50/60 via-slate-50 to-emerald-50/60 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Verified Academic Institutions</h4>
              <p className="text-xs text-slate-600">
                Credentials verified across University of Papua New Guinea, PNG University of Technology, University of Southern Queensland, and University of Goroka.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700 font-mono shrink-0 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
            <img 
              src="/assets/aistudio/image_56d8a76b.png" 
              alt="Milne Bay Province Flag" 
              className="w-4 h-2.5 object-cover rounded-xs border border-slate-300 shrink-0" 
            />
            <span>Milne Bay Governance Desk</span>
          </div>
        </div>

      </div>

      {/* Interactive High-Resolution Portrait Lightbox Modal */}
      {selectedPortrait && selectedPortrait.image && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPortrait(null)}
        >
          <div 
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h4 className="font-extrabold text-base text-slate-900">
                  {selectedPortrait.name}
                </h4>
                <p className="text-xs text-blue-700 font-semibold">
                  {selectedPortrait.title} ({selectedPortrait.roleTag})
                </p>
              </div>
              <button
                onClick={() => setSelectedPortrait(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                aria-label="Close portrait view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Resolution Photo */}
            <div className="relative bg-slate-100 max-h-[500px] flex items-center justify-center overflow-hidden">
              <img 
                src={selectedPortrait.image} 
                alt={selectedPortrait.name}
                className="w-full h-auto max-h-[460px] object-contain"
              />
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-mono">
                Gumini, Alotau, Milne Bay
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/67582545274?text=${encodeURIComponent(`Hello KILSTA, I would like to consult with ${selectedPortrait.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setSelectedPortrait(null);
                    scrollToContact();
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
