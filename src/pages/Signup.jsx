import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../components/AuthContext'
import Logo from '../components/Logo'
import { COUNTRIES, MOROCCO } from '../lib/constants'

const ALL_COUNTRIES = [MOROCCO, ...COUNTRIES]

export default function Signup() {
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')
  const [country,   setCountry]   = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [show,      setShow]      = useState(false)
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState(false)

  const { signUp }  = useAuth()
  const navigate    = useNavigate()
  const [params]    = useSearchParams()
  const redirectTo  = params.get('redirect') || '/transfer'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (password.length < 6)  { setError('Le mot de passe doit faire au moins 6 caractères.'); return }
    setLoading(true)
    try {
      await signUp({ email, password, firstName, lastName, phone, country })
      setSuccess(true)
      setTimeout(() => navigate(redirectTo), 1500)
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 text-center max-w-sm shadow-2xl">
        <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-navy mb-2">Compte créé !</h2>
        <p className="text-gray-400">Redirection en cours…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><Logo size="md" dark={false} /></div>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="font-display text-2xl font-extrabold text-navy mb-1">Créer un compte</h1>
          <p className="text-gray-400 text-sm mb-6">Rejoignez AfriGate gratuitement</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-red-600 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Prénom</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} required
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Nom</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} required
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Pays de résidence</label>
              <select value={country} onChange={e => setCountry(e.target.value)} required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm bg-white">
                <option value="">Sélectionnez votre pays</option>
                {ALL_COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+221 77 000 00 00"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-12 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Confirmer le mot de passe</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-navy transition-all shadow-lg disabled:opacity-60"
              style={{ backgroundColor: '#F5A623' }}>
              {loading ? 'Création en cours…' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: '#F5A623' }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
