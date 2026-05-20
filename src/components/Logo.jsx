export default function Logo({ size = 'md', dark = false }) {
  const sizes = { sm: 32, md: 44, lg: 60 }
  const px = sizes[size] || 44
  const textColor = dark ? '#1B2A6B' : '#ffffff'
  const subColor = '#F5A623'

  return (
    <div className="flex items-center gap-3">
      {/* Circle icon with Africa + arrows */}
      <svg width={px} height={px} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#1B2A6B"/>
        {/* Africa silhouette simplified */}
        <path d="M38 18 C34 20 30 26 30 32 C30 38 32 40 31 44 C30 48 26 50 26 56 C26 66 32 74 40 78 C46 82 52 80 56 76 C62 72 64 64 62 56 C60 50 56 48 57 42 C58 36 64 32 62 26 C60 20 54 16 48 16 C44 16 40 16 38 18 Z"
          fill="#F5A623"/>
        {/* Arrow up-right */}
        <line x1="36" y1="60" x2="68" y2="28" stroke="#1B2A6B" strokeWidth="4.5" strokeLinecap="round"/>
        <polygon points="68,28 58,28 68,38" fill="#1B2A6B"/>
        {/* Arrow down-left */}
        <line x1="64" y1="40" x2="32" y2="72" stroke="#F5A623" strokeWidth="3.5" strokeLinecap="round"/>
        <polygon points="32,72 42,72 32,62" fill="#F5A623"/>
      </svg>
      {/* Text */}
      <div className="leading-tight">
        <div style={{ fontSize: px * 0.52 + 'px', color: textColor, fontFamily: 'Sora, sans-serif', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Afrigate
        </div>
        <div style={{ color: subColor, fontSize: px * 0.28 + 'px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, letterSpacing: '0.5px' }}>
          Transfert d'argent
        </div>
      </div>
    </div>
  )
}
