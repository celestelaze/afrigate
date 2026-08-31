import { useState, useEffect } from 'react'
import { Cookie, X, Check } from 'lucide-react'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('afrigate_cookie_consent')
    if (!consent) setShow(true)
  }, [])

  const accept = () => {
    localStorage.setItem('afrigate_cookie_consent', 'accepted')
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem('afrigate_cookie_consent', 'declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-navy rounded-2xl shadow-2xl border border-white/10 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Cookie size={28} className="text-gold-DEFAULT flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-white font-semibold text-sm mb-1">🍪 Nous utilisons des cookies</p>
          <p className="text-blue-200 text-xs leading-relaxed">
            AfriGate utilise des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu.
            En continuant, vous acceptez notre politique de confidentialité.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={decline}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-colors">
            <X size={13} /> Refuser
          </button>
          <button onClick={accept}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-DEFAULT text-navy text-xs font-bold hover:bg-gold-light transition-colors">
            <Check size={13} /> Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
