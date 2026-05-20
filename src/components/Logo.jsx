export default function Logo({ size = 'md', dark = false }) {
  const heights = { sm: 40, md: 52, lg: 70 }
  const h = heights[size] || 52

  return (
    <img
      src="/logos/afrigate-logo.png"
      alt="AfriGate — Transfert d'argent"
      style={{ height: h + 'px', width: 'auto', objectFit: 'contain' }}
    />
  )
}
