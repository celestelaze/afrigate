import { Link, useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function MobileCTA() {
  const { pathname } = useLocation()
  // Hide on transfer page (already has CTA) and auth pages
  if (['/transfer', '/login', '/signup'].includes(pathname)) return null

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 md:hidden px-4">
      <Link to="/transfer"
        className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gold-DEFAULT text-navy font-bold text-base shadow-xl shadow-gold-DEFAULT/40 hover:bg-gold-light transition-all"
        style={{ animation: 'pulseGold 2s infinite' }}>
        💸 Envoyer de l'argent <ArrowRight size={18} />
      </Link>
    </div>
  )
}
