import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../components/AuthContext'
import Logo from '../components/Logo'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn({ email, password })
      navigate('/transfer')
    } catch (err) {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="md" dark={false} />
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="font-display text-2xl font-extrabold text-navy mb-1">Connexion</h1>
          <p className="text-gray-400 text-sm mb-8">Accédez à votre espace AfriGate</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-red-600 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Adresse email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-gold-DEFAULT outline-none transition-colors text-navy"
                placeholder="votre@email.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Mot de passe</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:border-gold-DEFAULT outline-none transition-colors text-navy"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-navy text-white font-bold hover:bg-navy-light transition-colors shadow-lg shadow-navy/20 disabled:opacity-60 mt-2">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Pas encore de compte ?{' '}
            <Link to="/signup" className="text-gold-DEFAULT font-semibold hover:underline">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
