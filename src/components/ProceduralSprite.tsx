import React from 'react';
import { SpriteFeatures } from '../types';

interface ProceduralSpriteProps {
  features: SpriteFeatures;
  obtained?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const ProceduralSprite: React.FC<ProceduralSpriteProps> = ({
  features,
  obtained = false,
  size = 'md',
}) => {
  const {
    shape,
    eyes,
    accessory,
    glowColor,
    bodyColor,
    accentColor,
    scale = 1,
    particles = 'none',
    customId,
    imageUrl,
  } = features;

  // Determine size in pixels
  const dimensions = {
    xs: { container: 'w-10 h-10', svg: 40 },
    sm: { container: 'w-16 h-16', svg: 64 },
    md: { container: 'w-24 h-24', svg: 96 },
    lg: { container: 'w-36 h-36', svg: 144 },
    xl: { container: 'w-48 h-48', svg: 192 },
  }[size] || { container: 'w-24 h-24', svg: 96 };

  // CSS Filters for Glow & Unobtained state
  const filterStyle: React.CSSProperties = {
    '--glow-color': glowColor,
    '--unobtained-filter': obtained
      ? `drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 4px ${glowColor})`
      : 'grayscale(0.9) brightness(0.7) opacity(0.55)',
    filter: 'var(--unobtained-filter)',
    opacity: obtained ? 1 : undefined,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  } as React.CSSProperties;

  if (imageUrl) {
    return (
      <div
        className={`relative flex items-center justify-center select-none ${dimensions.container}`}
        style={{ transform: `scale(${scale})` }}
      >
        {/* Glow Backdrop */}
        {obtained && (
          <div
            className="absolute inset-0 rounded-full blur-2xl animate-pulse opacity-25"
            style={{ backgroundColor: glowColor }}
          />
        )}

        {/* Main Image Render */}
        <img
          src={imageUrl}
          alt="Sprite"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain relative z-10 transition-transform duration-500 hover:scale-105 procedural-sprite-visual"
          style={filterStyle}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center select-none ${dimensions.container}`}
      style={{ transform: `scale(${scale})` }}
    >
      {/* Glow Backdrop */}
      {obtained && (
        <div
          className="absolute inset-0 rounded-full blur-2xl animate-pulse opacity-25"
          style={{ backgroundColor: glowColor }}
        />
      )}

      {/* Main SVG Render */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 overflow-visible transition-transform duration-500 hover:scale-105 procedural-sprite-visual"
        style={filterStyle}
      >
        <defs>
          {/* Gradients */}
          <radialGradient id={`bodyGrad-${bodyColor}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="70%" stopColor={bodyColor} />
            <stop offset="100%" stopColor={bodyColor} style={{ filter: 'brightness(0.8)' }} />
          </radialGradient>
          
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="35%" stopColor="#d946ef" />
            <stop offset="70%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>

          {/* Sparkle Particle */}
          <path
            id="sparkle-path"
            d="M0,-6 Q0,0 6,0 Q0,0 0,6 Q0,0 -6,0 Q0,0 0,-6 Z"
            fill="#ffffff"
          />
        </defs>

        {/* --- DYNAMIC PARTICLES LAYER --- */}
        {obtained && (
          <g>
            {particles === 'sparkle' && (
              <>
                <use href="#sparkle-path" x="15" y="20" className="animate-ping" style={{ animationDuration: '2.5s', fill: accentColor }} />
                <use href="#sparkle-path" x="85" y="30" className="animate-ping" style={{ animationDuration: '1.8s', fill: accentColor }} />
                <use href="#sparkle-path" x="25" y="80" className="animate-ping" style={{ animationDuration: '3s', fill: accentColor }} />
              </>
            )}
            {particles === 'bubble' && (
              <>
                <circle cx="15" cy="40" r="3" fill="#ffffff" opacity="0.6" className="animate-bounce" style={{ animationDuration: '2s' }} />
                <circle cx="85" cy="50" r="2.5" fill="#ffffff" opacity="0.4" className="animate-bounce" style={{ animationDuration: '2.8s' }} />
                <circle cx="75" cy="15" r="2" fill="#ffffff" opacity="0.5" className="animate-bounce" style={{ animationDuration: '1.5s' }} />
              </>
            )}
            {particles === 'orbit' && (
              <ellipse
                cx="50"
                cy="52"
                rx="42"
                ry="12"
                fill="none"
                stroke={accentColor}
                strokeWidth="1.5"
                strokeDasharray="4, 4"
                opacity="0.6"
                transform="rotate(-15 50 52)"
                className="animate-spin"
                style={{ animationDuration: '12s', transformOrigin: '50px 52px' }}
              />
            )}
            {particles === 'float' && (
              <>
                <circle cx="30" cy="15" r="2" fill={accentColor} opacity="0.6" className="animate-pulse" />
                <circle cx="70" cy="85" r="3" fill={accentColor} opacity="0.5" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
              </>
            )}
          </g>
        )}

        {/* --- BASE BODY SHAPES WITH HOVER/BREATHE ANIMATION --- */}
        <g className="animate-[bounce_3.5s_infinite_ease-in-out]">
          {customId ? (
            <>
              {customId === 'b1' && (
                <>
                  {/* b1 (Finny) - orange fish-like blob with hat */}
                  <rect x="25" y="25" width="50" height="55" rx="20" fill="#f97316" />
                  <path d="M30,32 C30,16 70,16 70,32 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
                  <path d="M48,15 L48,22 M52,15 L52,22" stroke="#451a03" strokeWidth="1.5" />
                  <ellipse cx="50" cy="32" rx="24" ry="4" fill="#ca8a04" />
                  <circle cx="50" cy="14" r="3" fill="#854d0e" />
                  <rect x="18" y="52" width="8" height="6" rx="3" fill="#f97316" transform="rotate(-15 18 52)" />
                  <rect x="74" y="52" width="8" height="6" rx="3" fill="#f97316" transform="rotate(15 74 52)" />
                  <rect x="32" y="78" width="10" height="8" rx="4" fill="#ea580c" />
                  <rect x="58" y="78" width="10" height="8" rx="4" fill="#ea580c" />
                  <circle cx="40" cy="46" r="6" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
                  <circle cx="39" cy="45" r="2.5" fill="#0f172a" />
                  <circle cx="41" cy="44" r="1" fill="#ffffff" />
                  <circle cx="60" cy="46" r="6" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
                  <circle cx="61" cy="45" r="2.5" fill="#0f172a" />
                  <circle cx="59" cy="44" r="1" fill="#ffffff" />
                  <ellipse cx="50" cy="56" rx="9" ry="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                  <line x1="42" y1="56" x2="58" y2="56" stroke="#ca8a04" strokeWidth="1" />
                </>
              )}

              {customId === 'b2' && (
                <>
                  {/* b2 (Quackster) - yellow duck with cool sunglasses */}
                  <rect x="25" y="25" width="50" height="55" rx="22" fill="#facc15" />
                  <ellipse cx="50" cy="54" rx="14" ry="7" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
                  <line x1="37" y1="54" x2="63" y2="54" stroke="#c2410c" strokeWidth="1.5" />
                  <polygon points="23,38 48,40 45,49 26,47" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                  <polygon points="52,40 77,38 74,47 55,49" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                  <rect x="45" y="40" width="10" height="3" fill="#0f172a" />
                  <line x1="28" y1="41" x2="40" y2="42" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                  <line x1="58" y1="43" x2="70" y2="41" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                  <path d="M25,50 C18,50 16,56 25,58 Z" fill="#eab308" />
                  <path d="M75,50 C82,50 84,56 75,58 Z" fill="#eab308" />
                  <ellipse cx="34" cy="80" rx="8" ry="4" fill="#ea580c" />
                  <ellipse cx="66" cy="80" rx="8" ry="4" fill="#ea580c" />
                </>
              )}

              {customId === 'b3' && (
                <>
                  {/* b3 (Somnus) - sleepy pillow */}
                  <rect x="25" y="22" width="50" height="60" rx="14" fill="#94a3b8" />
                  <path d="M25,22 L75,22" stroke="#475569" strokeWidth="2" strokeDasharray="3,3" />
                  <path d="M25,22 Q30,42 32,22 Q38,48 41,22 Q50,38 53,22 Q60,45 64,22" stroke="#475569" strokeWidth="1.5" fill="none" />
                  <text x="50" y="36" textAnchor="middle" fill="#334155" fontSize="4.2" fontWeight="bold" fontFamily="monospace" letterSpacing="0.5">SWEET DREAMS</text>
                  <polygon points="34,60 36,63 39,63 37,65 38,68 35,66 32,68 33,65 31,63 34,63" fill="#64748b" />
                  <polygon points="64,68 66,71 69,71 67,73 68,76 65,74 62,76 63,73 61,71 64,71" fill="#64748b" />
                  <polygon points="62,45 64,48 67,48 65,50 66,53 63,51 60,53 61,50 59,48 62,48" fill="#64748b" />
                  <path d="M33,48 L43,48" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M57,48 L67,48" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="47" y1="56" x2="53" y2="56" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                  <rect x="18" y="52" width="8" height="5" rx="2" fill="#64748b" />
                  <rect x="74" y="52" width="8" height="5" rx="2" fill="#64748b" />
                  <rect x="30" y="81" width="10" height="7" rx="3" fill="#475569" />
                  <rect x="60" y="81" width="10" height="7" rx="3" fill="#475569" />
                </>
              )}

              {customId === 'b4' && (
                <>
                  {/* b4 (King Skully) - skeleton with crown */}
                  <rect x="25" y="24" width="50" height="56" rx="18" fill="#18181b" />
                  <path d="M30,24 L34,12 L42,18 L50,11 L58,18 L66,12 L70,24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                  <rect x="31" y="32" width="38" height="30" rx="12" fill="#f4f4f5" />
                  <polygon points="48,54 52,54 50,50" fill="#18181b" />
                  <circle cx="40" cy="44" r="7" fill="#18181b" />
                  <circle cx="60" cy="44" r="7" fill="#18181b" />
                  <path d="M43,65 L57,75 M57,65 L43,75" stroke="#a855f7" strokeWidth="4.5" strokeLinecap="round" />
                  <rect x="19" y="54" width="7" height="6" rx="3" fill="#18181b" />
                  <rect x="74" y="54" width="7" height="6" rx="3" fill="#18181b" />
                  <rect x="32" y="79" width="10" height="8" rx="4" fill="#27272a" />
                  <rect x="58" y="79" width="10" height="8" rx="4" fill="#27272a" />
                </>
              )}

              {customId === 'b5' && (
                <>
                  {/* b5 (Ignis) - orange flame with fire coin */}
                  <path d="M50,15 C66,28 73,42 71,58 C69,74 58,82 50,82 C42,82 31,74 29,58 C27,42 34,28 50,15 Z" fill={`url(#bodyGrad-${bodyColor})`} />
                  <path d="M45,15 Q50,0 55,15 Q60,3 52,15" fill="#f43f5e" opacity="0.5" />
                  <polygon points="32,45 44,48 42,51 34,48" fill="#facc15" />
                  <polygon points="68,45 56,48 58,51 66,48" fill="#facc15" />
                  <line x1="32" y1="43" x2="44" y2="47" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
                  <line x1="68" y1="43" x2="56" y2="47" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
                  <path d="M46,59 Q50,56 54,59" fill="none" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="50" cy="70" r="8.5" fill="#facc15" stroke="#d97706" strokeWidth="1.5" />
                  <path d="M50,65 C53,68 54,71 52,73 C50,75 48,74 48,72 C48,70 50,68 50,65 Z" fill="#ea580c" />
                  <path d="M26,58 Q18,54 22,50" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  <path d="M74,58 Q82,54 78,50" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                </>
              )}

              {customId === 'b6' && (
                <>
                  {/* b6 (Umbra) - tattered dark shadow with grey hood */}
                  <rect x="25" y="24" width="50" height="56" rx="16" fill="#09090b" />
                  <path d="M22,24 C28,24 35,35 34,55 C34,65 30,78 24,70" fill="#4b5563" stroke="#374151" strokeWidth="1" />
                  <path d="M78,24 C72,24 65,35 66,55 C66,65 70,78 76,70" fill="#4b5563" stroke="#374151" strokeWidth="1" />
                  <path d="M24,26 Q50,8 76,26 L78,35 Q50,22 22,35 Z" fill="#374151" />
                  <path d="M35,62 Q50,68 65,62" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3, 2" />
                  <polygon points="34,44 46,47 43,51 33,47" fill="#22d3ee" filter="drop-shadow(0 0 3px #06b6d4)" />
                  <polygon points="66,44 54,47 57,51 67,47" fill="#22d3ee" filter="drop-shadow(0 0 3px #06b6d4)" />
                  <rect x="30" y="79" width="10" height="8" rx="4" fill="#18181b" />
                  <rect x="60" y="79" width="10" height="8" rx="4" fill="#18181b" />
                </>
              )}

              {customId === 'b7' && (
                <>
                  {/* b7 (Barky) - wooden mask forest stump */}
                  <rect x="25" y="24" width="50" height="56" rx="16" fill="#78716c" />
                  <path d="M25,55 L75,55 L75,66 Q75,80 50,80 Q25,80 25,66 Z" fill="#15803d" />
                  <rect x="30" y="32" width="40" height="26" rx="8" fill="#7c2d12" stroke="#451a03" strokeWidth="2" />
                  <line x1="33" y1="36" x2="33" y2="54" stroke="#451a03" strokeWidth="1.5" />
                  <line x1="67" y1="36" x2="67" y2="54" stroke="#451a03" strokeWidth="1.5" />
                  <line x1="50" y1="34" x2="50" y2="40" stroke="#451a03" strokeWidth="1.5" />
                  <circle cx="41" cy="45" r="4.5" fill="#c084fc" filter="drop-shadow(0 0 3px #a855f7)" />
                  <circle cx="41" cy="45" r="1.5" fill="#f3e8ff" />
                  <circle cx="59" cy="45" r="4.5" fill="#c084fc" filter="drop-shadow(0 0 3px #a855f7)" />
                  <circle cx="59" cy="45" r="1.5" fill="#f3e8ff" />
                  <circle cx="50" cy="68" r="7.5" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
                  <path d="M50,63 C53,66 53,70 50,72 C47,70 47,66 50,63 Z" fill="#166534" />
                  <path d="M50,24 Q50,14 54,15 M50,24 Q46,14 42,16" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </>
              )}

              {customId === 'b8' && (
                <>
                  {/* b8 (Striker) - soccer ball with blue mohawk */}
                  <circle cx="50" cy="42" r="24" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
                  <polygon points="50,38 55,41 53,46 47,46 45,41" fill="#1e293b" />
                  <polygon points="50,18 52,23 48,23" fill="#1e293b" />
                  <polygon points="32,50 36,47 38,51 34,53" fill="#1e293b" />
                  <polygon points="68,50 64,47 62,51 66,53" fill="#1e293b" />
                  <path d="M50,18 L53,6 L47,10 L44,4 L41,12 L37,8 L36,18 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
                  <path d="M30,62 L70,62 L72,78 C72,81 68,81 50,81 C32,81 28,78 28,78 Z" fill="#1e3a8a" />
                  <path d="M30,62 L70,76 L68,80 L28,66 Z" fill="#ef4444" opacity="0.8" />
                  <rect x="34" y="34" width="10" height="4" rx="2" fill="#1e293b" />
                  <rect x="56" y="34" width="10" height="4" rx="2" fill="#1e293b" />
                  <line x1="47" y1="46" x2="53" y2="46" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                </>
              )}

              {customId === 'b9' && (
                <>
                  {/* b9 (Gorehorn) - red skull-masked devil */}
                  <rect x="25" y="24" width="50" height="56" rx="16" fill="#dc2626" />
                  <polygon points="28,24 22,10 34,18" fill="#1e293b" />
                  <polygon points="50,20 50,8 46,14 54,14" fill="#1e293b" />
                  <polygon points="72,24 78,10 66,18" fill="#1e293b" />
                  <rect x="30" y="32" width="40" height="26" rx="8" fill="#18181b" stroke="#09090b" strokeWidth="2" />
                  <polygon points="34,42 44,45 42,48 33,45" fill="#ef4444" filter="drop-shadow(0 0 3px #dc2626)" />
                  <polygon points="66,42 56,45 58,48 67,45" fill="#ef4444" filter="drop-shadow(0 0 3px #dc2626)" />
                  <circle cx="50" cy="68" r="6" fill="#991b1b" />
                  <rect x="18" y="52" width="8" height="6" rx="3" fill="#dc2626" />
                  <rect x="74" y="52" width="8" height="6" rx="3" fill="#dc2626" />
                </>
              )}

              {customId === 'b10' && (
                <>
                  {/* b10 (Splashy) - blue bubbly water jelly */}
                  <rect x="25" y="24" width="50" height="56" rx="18" fill="#0ea5e9" opacity="0.9" />
                  <ellipse cx="34" cy="34" rx="4" ry="6" fill="#f0f9ff" opacity="0.4" />
                  <circle cx="34" cy="18" r="3" fill="#e0f2fe" opacity="0.7" />
                  <circle cx="66" cy="14" r="2.5" fill="#e0f2fe" opacity="0.5" />
                  <circle cx="50" cy="10" r="2" fill="#e0f2fe" opacity="0.6" />
                  <circle cx="38" cy="46" r="4.5" fill="#0f172a" />
                  <circle cx="36" cy="44" r="1.5" fill="#ffffff" />
                  <circle cx="62" cy="46" r="4.5" fill="#0f172a" />
                  <circle cx="60" cy="44" r="1.5" fill="#ffffff" />
                  <path d="M47,54 Q50,58 53,54" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="50" cy="68" r="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
                  <path d="M45,68 Q48,64 51,68 Q54,72 55,68" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
                </>
              )}

              {customId === 'b11' && (
                <>
                  {/* b11 (Spike) - punk rock spiky hair rebel */}
                  <rect x="25" y="24" width="50" height="56" rx="18" fill="#18181b" />
                  <path d="M34,24 L34,10 L40,18" fill="#ec4899" />
                  <path d="M50,24 L50,8 L54,16" fill="#ec4899" />
                  <path d="M66,24 L66,10 L60,18" fill="#ec4899" />
                  <path d="M22,50 L34,50 L38,76 L25,76 Z" fill="#374151" stroke="#1f2937" strokeWidth="1" />
                  <path d="M78,50 L66,50 L62,76 L75,76 Z" fill="#374151" stroke="#1f2937" strokeWidth="1" />
                  <circle cx="28" cy="55" r="1" fill="#94a3b8" />
                  <circle cx="72" cy="55" r="1" fill="#94a3b8" />
                  <polygon points="48,60 54,60 46,68 52,68 46,76 49,76" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
                  <path d="M34,44 Q38,48 42,44" fill="none" stroke="#f472b6" strokeWidth="2" />
                  <path d="M58,44 Q62,48 66,44" fill="none" stroke="#f472b6" strokeWidth="2" />
                </>
              )}

              {customId === 'b12' && (
                <>
                  {/* b12 (Magmar) - molten rock with red collar */}
                  <rect x="25" y="24" width="50" height="56" rx="16" fill="#2d1500" />
                  <path d="M28,32 L36,38 L30,48 L38,52" fill="none" stroke="#ea580c" strokeWidth="2" filter="drop-shadow(0 0 2px #f97316)" />
                  <path d="M72,32 L64,38 L70,48 L62,52" fill="none" stroke="#ea580c" strokeWidth="2" filter="drop-shadow(0 0 2px #f97316)" />
                  <path d="M48,68 L52,74 L46,80" fill="none" stroke="#ea580c" strokeWidth="2.5" filter="drop-shadow(0 0 2px #f97316)" />
                  <rect x="23" y="56" width="54" height="6" rx="2" fill="#dc2626" />
                  <rect x="46" y="54" width="8" height="10" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                  <polygon points="34,40 44,43 42,46 33,43" fill="#fbbf24" />
                  <polygon points="66,40 56,43 58,46 67,43" fill="#fbbf24" />
                </>
              )}

              {customId === 'b13' && (
                <>
                  {/* b13 (Grimmy) - grim reaper with padlock */}
                  <circle cx="50" cy="46" r="16" fill="#e4e4e7" />
                  <circle cx="44" cy="46" r="4.5" fill="#18181b" />
                  <circle cx="56" cy="46" r="4.5" fill="#18181b" />
                  <path d="M24,26 C30,12 70,12 76,26 L78,55 L74,78 L60,70 L50,78 L40,70 L26,78 L22,55 Z" fill="#1e293b" opacity="0.95" />
                  <ellipse cx="44" cy="62" rx="3" ry="1.5" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                  <ellipse cx="56" cy="62" rx="3" ry="1.5" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                  <rect x="44" y="63" width="12" height="10" rx="2" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                  <circle cx="50" cy="67" r="1.5" fill="#18181b" />
                  <line x1="50" y1="68" x2="50" y2="71" stroke="#18181b" strokeWidth="1" />
                </>
              )}

              {customId === 'b14' && (
                <>
                  {/* b14 (Obsidius) - purple crystal obsidian rock */}
                  <polygon points="26,35 50,20 74,35 74,68 50,82 26,68" fill="#334155" />
                  <polygon points="50,20 74,35 74,68 50,82" fill="#1e293b" opacity="0.4" />
                  <polygon points="40,24 50,6 46,24" fill="#d946ef" />
                  <polygon points="50,22 62,8 56,22" fill="#a855f7" />
                  <polygon points="45,20 50,11 55,20" fill="#f43f5e" />
                  <path d="M30,42 L42,52 L36,68" fill="none" stroke="#c084fc" strokeWidth="2.5" filter="drop-shadow(0 0 2px #d946ef)" />
                  <path d="M70,42 L58,52 L64,68" fill="none" stroke="#c084fc" strokeWidth="2.5" filter="drop-shadow(0 0 2px #d946ef)" />
                  <circle cx="40" cy="46" r="4" fill="#f43f5e" filter="drop-shadow(0 0 2px #d946ef)" />
                  <circle cx="60" cy="46" r="4" fill="#f43f5e" filter="drop-shadow(0 0 2px #d946ef)" />
                </>
              )}

              {customId === 'b15' && (
                <>
                  {/* b15 (Peanut) - peanut shell with propeller cap */}
                  <path d="M34,26 C30,36 36,48 34,58 C32,68 38,80 50,80 C62,80 68,68 66,58 C64,48 70,36 66,26 C62,16 38,16 34,26 Z" fill="#d97706" />
                  <path d="M38,32 Q50,38 62,32 M36,54 Q50,60 64,54 M38,68 Q50,74 62,68" fill="none" stroke="#b45309" strokeWidth="1" strokeDasharray="3,3" />
                  <path d="M34,26 Q50,12 66,26 Z" fill="#c084fc" />
                  <path d="M34,26 Q44,18 50,26 L34,26" fill="#34d399" />
                  <line x1="50" y1="12" x2="50" y2="7" stroke="#1e293b" strokeWidth="2" />
                  <rect x="38" y="5" width="24" height="2" fill="#ef4444" rx="1" />
                  <ellipse cx="40" cy="45" rx="6" ry="4.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
                  <circle cx="40" cy="45" r="2.8" fill="#3b82f6" />
                  <circle cx="40" cy="45" r="1.3" fill="#0f172a" />
                  <circle cx="41.2" cy="43.8" r="0.7" fill="#ffffff" />
                  <ellipse cx="60" cy="45" rx="6" ry="4.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
                  <circle cx="60" cy="45" r="2.8" fill="#3b82f6" />
                  <circle cx="60" cy="45" r="1.3" fill="#0f172a" />
                  <circle cx="61.2" cy="43.8" r="0.7" fill="#ffffff" />
                  <ellipse cx="50" cy="58" rx="7" ry="3" fill="#a855f7" stroke="#701a75" strokeWidth="1" />
                  <line x1="44" y1="58" x2="56" y2="58" stroke="#701a75" strokeWidth="1" />
                </>
              )}

              {customId === 'b16' && (
                <>
                  {/* b16 (Nimbus) - cloud with wind swirl */}
                  <path d="M32,42 C23,42 20,52 25,59 C18,66 25,78 35,76 C42,82 58,82 65,76 C75,78 82,66 75,59 C80,52 77,42 68,42 C68,30 32,30 32,42 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                  <path d="M50,68 A4,4 0 1,0 52,64 A6,6 0 1,0 48,72" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="40" cy="52" r="3.5" fill="#1e293b" />
                  <circle cx="39" cy="50.5" r="1" fill="#ffffff" />
                  <circle cx="60" cy="52" r="3.5" fill="#1e293b" />
                  <circle cx="59" cy="50.5" r="1" fill="#ffffff" />
                  <path d="M48,58 Q50,61 52,58" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                </>
              )}

              {customId === 'b17' && (
                <>
                  {/* b17 (Hypno) - pink sheet ghost with hypnotic spiral eyes */}
                  <path d="M25,48 C25,28 36,18 50,18 C64,18 75,28 75,48 C75,66 70,76 70,76 L62,68 L50,76 L38,68 L30,76 C30,76 25,66 25,48 Z" fill="#ec4899" />
                  <circle cx="40" cy="38" r="7" fill="none" stroke="#fbcfe8" strokeWidth="1.5" />
                  <circle cx="40" cy="38" r="4" fill="none" stroke="#fbcfe8" strokeWidth="1.5" />
                  <circle cx="40" cy="38" r="1" fill="#fbcfe8" />
                  <circle cx="60" cy="38" r="7" fill="none" stroke="#fbcfe8" strokeWidth="1.5" />
                  <circle cx="60" cy="38" r="4" fill="none" stroke="#fbcfe8" strokeWidth="1.5" />
                  <circle cx="60" cy="38" r="1" fill="#fbcfe8" />
                  <circle cx="40" cy="38" r="7" fill="none" stroke="#ff007f" strokeWidth="1" filter="drop-shadow(0 0 2px #ff007f)" />
                  <circle cx="60" cy="38" r="7" fill="none" stroke="#ff007f" strokeWidth="1" filter="drop-shadow(0 0 2px #ff007f)" />
                  <path d="M47,48 Q50,51 53,48" fill="none" stroke="#fbcfe8" strokeWidth="2" strokeLinecap="round" />
                </>
              )}

              {customId === 'b18' && (
                <>
                  {/* b18 (Cyber) - futuristic blue helmet with glowing red visor combat runes */}
                  <polygon points="26,35 50,20 74,35 74,68 50,82 26,68" fill="#1e3a8a" />
                  <polygon points="50,20 74,35 74,68 50,82" fill="#172554" opacity="0.4" />
                  <polygon points="34,36 50,28 66,36 66,54 50,62 34,54" fill="#09090b" />
                  <path d="M38,42 L46,42 M38,48 L46,46 M54,42 L62,42 M54,46 L62,48" fill="none" stroke="#ef4444" strokeWidth="2.5" filter="drop-shadow(0 0 2.5px #ef4444)" />
                  <polygon points="48,54 52,54 50,58" fill="#ef4444" filter="drop-shadow(0 0 2.5px #ef4444)" />
                  <path d="M26,35 L50,44 L74,35" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                  <path d="M50,44 L50,82" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                </>
              )}
            </>
          ) : (
            <>
              {/* 1. Base Shape rendering */}
              {shape === 'round' && (
                <circle
                  cx="50"
                  cy="52"
                  r="30"
                  fill={`url(#bodyGrad-${bodyColor})`}
                />
              )}

              {shape === 'star' && (
                <path
                  d="M50,18 L58,38 L80,38 L62,50 L69,72 L50,59 L31,72 L38,50 L20,38 L42,38 Z"
                  fill={`url(#bodyGrad-${bodyColor})`}
                />
              )}

              {shape === 'cube' && (
                <path
                  d="M23,30 L50,15 L77,30 L77,65 L50,82 L23,65 Z"
                  fill={`url(#bodyGrad-${bodyColor})`}
                />
              )}

              {shape === 'diamond' && (
                <path
                  d="M50,16 L78,52 L50,88 L22,52 Z"
                  fill={`url(#bodyGrad-${bodyColor})`}
                />
              )}

              {shape === 'cloud' && (
                <path
                  d="M32,38 C23,38 20,48 25,55 C18,62 25,74 35,72 C42,78 58,78 65,72 C75,74 82,62 75,55 C80,48 77,38 68,38 C68,26 32,26 32,38 Z"
                  fill={`url(#bodyGrad-${bodyColor})`}
                />
              )}

              {shape === 'ghost' && (
                <path
                  d="M25,50 C25,32 36,22 50,22 C64,22 75,32 75,50 C75,68 70,78 70,78 L60,70 L50,78 L40,70 L30,78 C30,78 25,68 25,50 Z"
                  fill={`url(#bodyGrad-${bodyColor})`}
                />
              )}

              {/* --- FACE FEATURES --- */}
              {/* Cheek blushes */}
              {obtained && (
                <g opacity="0.6">
                  <ellipse cx="38" cy="56" rx="4" ry="2.5" fill="#f43f5e" />
                  <ellipse cx="62" cy="56" rx="4" ry="2.5" fill="#f43f5e" />
                </g>
              )}

              {/* EYES */}
              <g>
                {eyes === 'cute' && (
                  <>
                    {/* Left Eye */}
                    <circle cx="38" cy="48" r="5.5" fill="#1e293b" />
                    <circle cx="36" cy="46" r="1.8" fill="#ffffff" />
                    <circle cx="39.5" cy="50" r="0.7" fill="#ffffff" />
                    
                    {/* Right Eye */}
                    <circle cx="62" cy="48" r="5.5" fill="#1e293b" />
                    <circle cx="60" cy="46" r="1.8" fill="#ffffff" />
                    <circle cx="63.5" cy="50" r="0.7" fill="#ffffff" />
                  </>
                )}

                {eyes === 'cool' && (
                  <>
                    {/* Cool Shades */}
                    <polygon points="26,44 46,44 43,51 29,51" fill="#0f172a" />
                    <polygon points="54,44 74,44 71,51 57,51" fill="#0f172a" />
                    <line x1="45" y1="46" x2="55" y2="46" stroke="#0f172a" strokeWidth="2.5" />
                    {/* Highlight line */}
                    <line x1="28" y1="46" x2="40" y2="46" stroke="#38bdf8" strokeWidth="1" opacity="0.8" />
                    <line x1="56" y1="46" x2="68" y2="46" stroke="#38bdf8" strokeWidth="1" opacity="0.8" />
                  </>
                )}

                {eyes === 'wink' && (
                  <>
                    {/* Left eye - blinking/happy curve */}
                    <path d="M32,49 Q38,42 44,49" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                    {/* Right eye - giant cute */}
                    <circle cx="62" cy="48" r="5.5" fill="#1e293b" />
                    <circle cx="60" cy="46" r="1.8" fill="#ffffff" />
                    <circle cx="63.5" cy="50" r="0.7" fill="#ffffff" />
                  </>
                )}

                {eyes === 'sleepy' && (
                  <>
                    {/* Sleepy eye curves */}
                    <path d="M33,51 Q38,55 43,51" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M57,51 Q62,55 67,51" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                )}

                {eyes === 'star' && (
                  <>
                    {/* Star shaped glowing pupils */}
                    <path d="M38,41 L40,46 L45,46 L41,49 L43,54 L38,51 L33,54 L35,49 L31,46 L36,46 Z" fill="#ffffff" />
                    <path d="M62,41 L64,46 L69,46 L65,49 L67,54 L62,51 L57,54 L59,49 L55,46 L60,46 Z" fill="#ffffff" />
                    {/* Inner cute centers */}
                    <circle cx="38" cy="48" r="2" fill="#1e1b4b" />
                    <circle cx="62" cy="48" r="2" fill="#1e1b4b" />
                  </>
                )}

                {eyes === 'glasses' && (
                  <>
                    {/* Glasses rims */}
                    <circle cx="37" cy="48" r="8" fill="none" stroke="#475569" strokeWidth="2.5" />
                    <circle cx="63" cy="48" r="8" fill="none" stroke="#475569" strokeWidth="2.5" />
                    <line x1="45" y1="48" x2="55" y2="48" stroke="#475569" strokeWidth="2.5" />
                    {/* Eyes inside */}
                    <circle cx="37" cy="48" r="3" fill="#1e293b" />
                    <circle cx="63" cy="48" r="3" fill="#1e293b" />
                    <circle cx="36" cy="47" r="1" fill="#ffffff" />
                    <circle cx="62" cy="47" r="1" fill="#ffffff" />
                  </>
                )}
              </g>

              {/* MOUTH / SMILE */}
              <g>
                {eyes === 'sleepy' ? (
                  // Simple bubble mouth
                  <circle cx="50" cy="58" r="1.5" fill="#1e293b" opacity="0.6" />
                ) : eyes === 'cool' ? (
                  // Smug straight mouth line
                  <line x1="47" y1="58" x2="53" y2="58" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                ) : (
                  // Cute happy mouth curve
                  <path d="M47,56 Q50,60 53,56" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                )}
              </g>

              {/* --- ACCESSORIES --- */}
              <g>
                {accessory === 'crown' && (
                  <path
                    d="M38,24 L42,14 L50,19 L58,14 L62,24 Z"
                    fill="url(#goldGrad)"
                    stroke="#d97706"
                    strokeWidth="1"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
                  />
                )}

                {accessory === 'hat' && (
                  <g>
                    {/* Wizard/Bowler Hat */}
                    <ellipse cx="50" cy="24" rx="16" ry="3" fill="#1e293b" />
                    <path d="M40,23 L44,10 L56,10 L60,23 Z" fill="#1e293b" />
                    {/* Hat ribbon */}
                    <path d="M42.3,21 L43.5,17 L56.5,17 L57.7,21 Z" fill={accentColor} />
                  </g>
                )}

                {accessory === 'bow' && (
                  <g transform="translate(30, 20)">
                    {/* Cute Bow */}
                    <path d="M-6,-4 L6,4 L6,-4 L-6,4 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
                    <circle cx="0" cy="0" r="3" fill="#fca5a5" />
                  </g>
                )}

                {accessory === 'headphones' && (
                  <g>
                    {/* Headphone band */}
                    <path d="M22,50 A28,28 0 0,1 78,50" fill="none" stroke="#334155" strokeWidth="3" />
                    {/* Ear muffs */}
                    <rect x="18" y="42" width="6" height="15" rx="3" fill={accentColor} stroke="#334155" strokeWidth="1" />
                    <rect x="76" y="42" width="6" height="15" rx="3" fill={accentColor} stroke="#334155" strokeWidth="1" />
                  </g>
                )}

                {accessory === 'halo' && (
                  <ellipse
                    cx="50"
                    cy="14"
                    rx="16"
                    ry="4"
                    fill="none"
                    stroke="url(#goldGrad)"
                    strokeWidth="2.5"
                    filter="drop-shadow(0 0 4px #fbbf24)"
                    className="animate-pulse"
                  />
                )}
              </g>
            </>
          )}
        </g>
      </svg>
    </div>
  );
};
