import React, { useMemo, useState } from 'react';

/**
 * StarSparkles
 * Renders an ambient field of twinkling star sparkles with randomized
 * coordinates, staggered animation delays, and interactive click-to-sparkle.
 */
export default function StarSparkles({ count = 28, className = "" }) {
  // Precompute fixed pseudo-random star properties for stable rendering
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // Deterministic spread across the container
      const top = ((i * 37 + 13) % 94) + 3;
      const left = ((i * 53 + 29) % 94) + 3;
      const size = (i % 3 === 0) ? 20 : (i % 3 === 1) ? 14 : 9;
      const delay = (i * 0.28) % 3.6;
      const duration = 2.4 + ((i * 0.35) % 1.8);
      const isSparkle = i % 2 === 0;
      const color = i % 4 === 0 
        ? '#0047BA' // KILSTA Logo Star Royal Blue
        : i % 4 === 1 
        ? '#00A651' // KILSTA Logo Outer Ring Emerald Green
        : i % 4 === 2
        ? '#FACC15' // KILSTA Logo Flame & Wordmark Golden Yellow
        : '#DC2626'; // KILSTA Logo Inner Disc Crimson Red

      return {
        id: i,
        top: `${top}%`,
        left: `${left}%`,
        size,
        delay: `${delay}s`,
        duration: `${duration}s`,
        isSparkle,
        color
      };
    });
  }, [count]);

  const [bursts, setBursts] = useState([]);

  // Optional: Click anywhere in the container to spawn a burst of star sparkles
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBursts = Array.from({ length: 6 }, (_, idx) => ({
      id: `${Date.now()}-${idx}`,
      x: x + (Math.random() - 0.5) * 60,
      y: y + (Math.random() - 0.5) * 60,
      size: 16 + Math.random() * 12,
      color: idx % 4 === 0 ? '#0047BA' : idx % 4 === 1 ? '#00A651' : idx % 4 === 2 ? '#FACC15' : '#DC2626'
    }));

    setBursts(prev => [...prev.slice(-18), ...newBursts]);
  };

  return (
    <div 
      onClick={handleClick}
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {stars.map((star) => (
        <span
          key={star.id}
          className={`absolute inline-block transition-transform ${
            star.isSparkle ? 'animate-star-sparkle' : 'animate-star-twinkle'
          }`}
          style={{
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
            animationDuration: star.duration,
            color: star.color,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
        >
          {/* 4-pointed sparkle star SVG */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full filter drop-shadow-[0_0_8px_currentColor]"
          >
            <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
          </svg>
        </span>
      ))}

      {/* Interactive burst sparkles */}
      {bursts.map((burst) => (
        <span
          key={burst.id}
          className="absolute animate-star-sparkle pointer-events-none"
          style={{
            top: `${burst.y}px`,
            left: `${burst.x}px`,
            width: `${burst.size}px`,
            height: `${burst.size}px`,
            color: burst.color,
            animationDuration: '1.2s'
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
          </svg>
        </span>
      ))}
    </div>
  );
}
