import { Link } from 'react-router-dom'
import { Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 text-center">
      <div className="max-w-md">
        <div className="text-8xl font-display font-extrabold text-white/20 mb-4">404</div>
        <div className="text-6xl mb-6">🌍</div>
        <h1 className="font-display text-3xl font-extrabold text-white mb-3">
          Page introuvable
        </h1>
        <p className="text-blue-200 mb-8 leading-relaxed">
          Cette page n'existe pas ou a été déplacée. Retournez à l'accueil pour continuer votre transfert.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gold-DEFAULT text-navy font-bold hover:bg-gold-light transition-colors">
            <Home size={18} /> Retour à l'accueil
          </Link>
          <Link to="/transfer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors">
            Envoyer de l'argent <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
