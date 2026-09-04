import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const LABELS = {
  transfer: "Effectuer un transfert",
  login: "Connexion",
  signup: "Inscription",
  contact: "Contact",
  faq: "FAQ",
  social: "Réseaux sociaux",
  dashboard: "Mon historique",
}

export default function Breadcrumb() {
  const { pathname } = useLocation()
  if (pathname === '/') return null

  const parts = pathname.split('/').filter(Boolean)

  return (
    <nav aria-label="Fil d'Ariane" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-0">
      <ol className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap pt-4">
        <li>
          <Link to="/" className="flex items-center gap-1 hover:text-navy transition-colors">
            <Home size={12} /> Accueil
          </Link>
        </li>
        {parts.map((part, i) => (
          <li key={part} className="flex items-center gap-1.5">
            <ChevronRight size={12} />
            {i < parts.length - 1 ? (
              <Link to={`/${parts.slice(0, i + 1).join('/')}`} className="hover:text-navy transition-colors">
                {LABELS[part] || part}
              </Link>
            ) : (
              <span className="text-navy font-semibold">{LABELS[part] || part}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
