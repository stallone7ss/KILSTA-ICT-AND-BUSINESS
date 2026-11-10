import React from 'react';
import { 
  ShieldCheck, 
  Satellite, 
  FileText, 
  Network, 
  Database, 
  GraduationCap, 
  MapPin, 
  Sparkles,
  Receipt,
  Cpu
} from 'lucide-react';

const MARQUEE_ITEMS = [
  {
    icon: ShieldCheck,
    label: 'IPA Registration No: 6-129295384',
    accent: '#0047BA' // Royal Star Blue
  },
  {
    icon: Receipt,
    label: 'IRC Tax Identification No (TIN): 502603269',
    accent: '#DC2626' // Crimson Red
  },
  {
    icon: Satellite,
    label: 'Starlink LEO Satellite Deployments & Alignment',
    accent: '#0047BA' // Royal Star Blue
  },
  {
    icon: Sparkles,
    label: 'Enhancing Through Business & ICT Innovations',
    accent: '#00A651' // Emerald Green
  },
  {
    icon: FileText,
    label: 'Company Profile Writing & Grant Proposals',
    accent: '#D97706' // Golden Amber
  },
  {
    icon: Network,
    label: 'Enterprise LAN, Structured Cabling & Wi-Fi Mesh',
    accent: '#00A651' // Emerald Green
  },
  {
    icon: Cpu,
    label: 'Cloudflare Hyperdrive & Edge Performance',
    accent: '#0047BA' // Royal Star Blue
  },
  {
    icon: Database,
    label: 'Supabase PostgreSQL Relational Database Systems',
    accent: '#0047BA' // Royal Star Blue
  },
  {
    icon: GraduationCap,
    label: 'Accredited Academic Pedigree: UPNG · Unitech · USQ · UOG',
    accent: '#00A651' // Emerald Green
  },
  {
    icon: MapPin,
    label: 'Headquarters: Gumini Village, Huhu LLG, Alotau, Milne Bay',
    accent: '#DC2626', // Crimson Red
    flag: '/assets/aistudio/image_56d8a76b.png'
  }
];

export default function MarqueeStrip({ reverse = false, speed = 'normal' }) {
  // Duplicate array 3 times for a seamless infinite loop
  const repeatedItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  const animationClass = reverse 
    ? 'animate-marquee-reverse' 
    : speed === 'fast' 
      ? 'animate-marquee-fast' 
      : 'animate-marquee';

  return (
    <div className="relative w-full overflow-hidden bg-slate-50 border-y border-slate-200 py-3.5 select-none">
      
      {/* Left and Right Fade Masks for smooth edge blending */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-slate-50 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-slate-50 to-transparent z-10" />

      {/* Marquee Track */}
      <div className={animationClass}>
        {repeatedItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index} 
              className="inline-flex items-center gap-2.5 mx-4 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs shrink-0 text-xs text-slate-800 transition-colors hover:border-blue-600 hover:text-blue-700"
            >
              {item.flag ? (
                <img 
                  src={item.flag} 
                  alt="Milne Bay Flag" 
                  className="w-4 h-2.5 object-cover rounded-xs border border-slate-300 shrink-0" 
                />
              ) : (
                <Icon 
                  className="w-3.5 h-3.5 shrink-0" 
                  style={{ color: item.accent }} 
                />
              )}
              <span className="font-semibold tracking-wide whitespace-nowrap">
                {item.label}
              </span>
              <span className="text-blue-300 ml-2" aria-hidden="true">·</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
