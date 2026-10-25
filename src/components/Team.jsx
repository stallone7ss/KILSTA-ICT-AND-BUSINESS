import React from 'react';
import { Award, GraduationCap, Mail, Phone, ShieldCheck, UserCheck } from 'lucide-react';

const leaders = [
  {
    name: 'Mr. Wilson Hugh',
    title: 'Principle Director & Admin Manager',
    roleTag: 'Executive Governance & Finance',
    bio: 'Oversees corporate strategy, statutory compliance, and economic feasibility. With deep roots in Papua New Guinea fiscal frameworks, Mr. Hugh coordinates client engagements for IPA formalization, tax governance, and commercial project modeling.',
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
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="team" className="py-20 bg-[#2B4257] border-t border-[#37526D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#FFE715] tracking-wider uppercase mb-2">
            <UserCheck className="w-4 h-4 text-[#FFE715]" />
            Leadership &amp; Academic Pedigree
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
            Management &amp; Credentials Grid
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300">
            KILSTA is spearheaded by seasoned PNG professionals with accredited academic degrees from premier regional universities, combining economic governance with advanced computer science.
          </p>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {leaders.map((leader, idx) => (
            <div 
              key={idx}
              className="flex flex-col justify-between bg-[#243748] border border-[#3A556F] hover:border-[#53A58B] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#53A58B]/10 rounded-2xl p-7 transition-all duration-300 group"
            >
              <div>
                {/* Card Header & Avatar Badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#53A58B]/20 text-[#FFE715] border border-[#53A58B]/40 group-hover:border-[#FFE715] group-hover:scale-105 flex items-center justify-center font-extrabold text-xl transition-all duration-300">
                    {leader.name.split(' ').slice(1).map(n => n[0]).join('')}
                  </div>
                  <span className="text-xs font-semibold text-[#53A58B] bg-[#53A58B]/10 px-2.5 py-1 rounded-md border border-[#53A58B]/30">
                    {leader.roleTag}
                  </span>
                </div>

                {/* Name & Title */}
                <h3 className="text-2xl font-bold text-white group-hover:text-[#FFE715] transition-colors">
                  {leader.name}
                </h3>
                <p className="text-sm font-semibold text-[#53A58B] mt-0.5 mb-4">
                  {leader.title}
                </p>

                {/* Bio */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {leader.bio}
                </p>

                {/* Academic Credentials */}
                <div className="border-t border-[#344F69] pt-5 mb-5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
                    <GraduationCap className="w-4 h-4 text-[#FFE715]" />
                    <span>Accredited Qualifications</span>
                  </div>
                  <div className="space-y-3">
                    {leader.qualifications.map((qual, qIdx) => (
                      <div key={qIdx} className="bg-[#1D2C3A] p-3 rounded-xl border border-[#344F69]/70">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#53A58B] shrink-0" />
                          <span>{qual.degree}</span>
                        </div>
                        <div className="text-[11px] text-slate-300 mt-1 pl-5">
                          {qual.institution}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Core Competencies */}
                <div className="border-t border-[#344F69] pt-4 mb-6">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                    Core Specializations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {leader.specialties.map((item, sIdx) => (
                      <span 
                        key={sIdx}
                        className="text-[11px] text-slate-300 bg-[#2D455A] px-2 py-0.5 rounded border border-[#3A5670]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="border-t border-[#344F69] pt-4">
                <button
                  onClick={scrollToContact}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-100 bg-[#2E4559] hover:bg-[#53A58B] hover:text-white hover:scale-[1.02] active:scale-[0.98] rounded-lg transition-all duration-200 border border-[#446380] flex items-center justify-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FFE715]" />
                  <span>Consult with {leader.name.split(' ')[1]}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Credential Authenticity Banner */}
        <div className="mt-12 p-5 bg-[#1F303F] border border-[#3A556F] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#53A58B]/20 flex items-center justify-center text-[#53A58B] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Verified Academic Institutions</h4>
              <p className="text-xs text-slate-300">
                Credentials verified across University of Papua New Guinea, PNG University of Technology, University of Southern Queensland, and University of Goroka.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono shrink-0 bg-[#25394B] px-3 py-1.5 rounded-lg border border-[#3A556F]">
            <img 
              src="/assets/aistudio/image_56d8a76b.png" 
              alt="Milne Bay Province Flag" 
              className="w-4 h-2.5 object-cover rounded-xs border border-slate-600 shrink-0" 
            />
            <span>Milne Bay Governance Desk</span>
          </div>
        </div>

      </div>
    </section>
  );
}
