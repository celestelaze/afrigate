import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, MessageCircle, Home } from 'lucide-react'
import { WHATSAPP_NUMBER } from '../lib/constants'

export default function Merci() {
  const [params] = useSearchParams()
  const ref = params.get('ref') || ''

  useEffect(() => {
    // Track conversion with Clicky
    if (window.clicky) window.clicky.goal('transfer_submitted')
  }, [])

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-5" />
          <h1 className="font-display text-3xl font-extrabold text-navy mb-3">
            Merci pour votre demande !
          </h1>
          <p className="text-gray-500 mb-2 leading-relaxed">
            Votre demande de transfert a bien été reçue. Notre équipe la traite en priorité et vous contactera très prochainement.
          </p>
          {ref && (
            <div className="mt-4 mb-6 bg-navy/5 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Référence</p>
              <p className="font-display font-bold text-navy text-lg">{ref}</p>
            </div>
          )}
          <p className="text-sm text-gray-400 mb-8">
            Temps de traitement habituel : <strong className="text-navy">15 à 30 minutes</strong>
          </p>
          <div className="flex flex-col gap-3">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors">
              <MessageCircle size={18} /> Suivre sur WhatsApp
            </a>
            <Link to="/"
              className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-navy text-navy font-semibold hover:bg-navy hover:text-white transition-colors">
              <Home size={18} /> Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
