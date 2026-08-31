import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from './AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const navLinks = [
    { href: '/#how-it-works', label: 'Comment ça marche' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
    { href: '/social', label: 'Réseaux sociaux' },
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navBg = scrolled || !isHome
    ? 'bg-white shadow-lg border-b border-gray-100'
    : 'bg-transparent'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex-shrink-0">
            <Logo size="sm" dark={scrolled || !isHome} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                className={`text-sm font-medium transition-colors hover:text-gold-DEFAULT ${
                  scrolled || !isHome ? 'text-navy' : 'text-white'
                }`}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <a href="/dashboard" className={`text-sm font-medium hover:text-gold-DEFAULT transition-colors ${scrolled || !isHome ? 'text-navy' : 'text-white'}`}>
                  {profile?.first_name || user.email}
                </a>
                <button onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
                  <LogOut size={15} /> Déconnexion
                </button>
              </div>
            ) : (
              <>
                <Link to="/login"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                    scrolled || !isHome
                      ? 'border-navy text-navy hover:bg-navy hover:text-white'
                      : 'border-white text-white hover:bg-white hover:text-navy'
                  }`}>
                  Connexion
                </Link>
                <Link to="/signup"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-gold-DEFAULT text-navy hover:bg-gold-dark transition-colors shadow-md">
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2">
            {open
              ? <X size={24} color={scrolled || !isHome ? '#1B2A6B' : 'white'} />
              : <Menu size={24} color={scrolled || !isHome ? '#1B2A6B' : 'white'} />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block text-navy font-medium py-2 border-b border-gray-50 hover:text-gold-DEFAULT transition-colors">
                {l.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <button onClick={handleSignOut}
                  className="w-full px-4 py-3 rounded-xl border border-red-300 text-red-500 font-semibold">
                  Déconnexion
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-navy text-navy font-semibold text-center">
                    Connexion
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)}
                    className="w-full px-4 py-3 rounded-xl bg-gold-DEFAULT text-navy font-bold text-center">
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
