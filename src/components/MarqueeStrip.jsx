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
    accent: '#EA580C'
  },
  {
    icon: Receipt,
    label: 'IRC Tax Identification No (TIN): 502603269',
    accent: '#F97316'
  },
  {
    icon: Satellite,
    label: 'Starlink LEO Satellite Deployments & Alignment',
    accent: '#EA580C'
  },
  {
    icon: Sparkles,
    label: 'Enhancing Through Business & ICT Innovations',
    accent: '#F97316'
  },
  {
    icon: FileText,
    label: 'Company Profile Writing & Grant Proposals',
    accent: '#EA580C'
  },
  {
    icon: Network,
    label: 'Enterprise LAN, Structured Cabling & Wi-Fi Mesh',
    accent: '#EA580C'
  },
  {
    icon: Cpu,
    label: 'Cloudflare Hyperdrive & Edge Performance',
    accent: '#F97316'
  },
  {
    icon: Database,
    label: 'Supabase PostgreSQL Relational Database Systems',
    accent: '#EA580C'
  },
  {
    icon: GraduationCap,
    label: 'Accredited Academic Pedigree: UPNG · Unitech · USQ · UOG',
    accent: '#F97316'
  },
  {
    icon: MapPin,
    label: 'Headquarters: Gumini Village, Huhu LLG, Alotau, Milne Bay',
    accent: '#EA580C',
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
    <div className="relative w-full overflow-hidden bg-orange-50/60 border-y border-orange-200/80 py-3.5 select-none">
      
      {/* Left and Right Fade Masks for smooth edge blending */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-orange-50/90 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-orange-50/90 to-transparent z-10" />

      {/* Marquee Track */}
      <div className={animationClass}>
        {repeatedItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index} 
              className="inline-flex items-center gap-2.5 mx-4 px-3.5 py-1.5 rounded-lg bg-white border border-orange-200/70 shadow-xs shrink-0 text-xs text-slate-800 transition-colors hover:border-orange-500 hover:text-orange-600"
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
              <span className="text-orange-300 ml-2" aria-hidden="true">·</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
