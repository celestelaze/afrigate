import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle, Mail } from 'lucide-react'
import { useAuth } from '../components/AuthContext'
import Logo from '../components/Logo'
import { COUNTRIES, MOROCCO } from '../lib/constants'

const ALL_COUNTRIES = [MOROCCO, ...COUNTRIES]

// Phone placeholder per country code
const PHONE_PLACEHOLDER = {
  MA: 'ex : 6 12 34 56 78',
  CI: 'ex : 07 00 00 00 00',
  SN: 'ex : 77 000 00 00',
  GW: 'ex : 95 000 00 00',
  ML: 'ex : 70 00 00 00',
  NE: 'ex : 90 00 00 00',
  BF: 'ex : 70 00 00 00',
}

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
  const [done,      setDone]      = useState(false)   // account created
  const [needsConfirmation, setNeedsConfirmation] = useState(false) // email confirmation needed

  const { signUp }  = useAuth()
  const navigate    = useNavigate()
  const [params]    = useSearchParams()
  const redirectTo  = params.get('redirect') || '/transfer'

  // Get country ISO code from selected country name
  const selectedCountry = ALL_COUNTRIES.find(c => c.name === country)
  const phonePlaceholder = selectedCountry
    ? PHONE_PLACEHOLDER[selectedCountry.code] || 'ex : 00 00 00 00'
    : 'ex : 77 000 00 00'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)
    try {
      const result = await signUp({ email, password, firstName, lastName, phone, country })

      if (result.needsEmailConfirmation) {
        // Supabase requires email confirmation
        setNeedsConfirmation(true)
      } else {
        // Logged in immediately — redirect
        setDone(true)
        setTimeout(() => navigate(redirectTo), 1200)
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  // ── Email confirmation screen ──────────────────────────────────────────────
  if (needsConfirmation) return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 text-center max-w-sm shadow-2xl">
        <Mail size={56} className="mx-auto mb-4" style={{ color: '#F5A623' }} />
        <h2 className="font-display text-2xl font-bold text-navy mb-3">Vérifiez votre email</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          Un lien de confirmation a été envoyé à <strong>{email}</strong>.
        </p>
        <p className="text-gray-400 text-xs mb-6">
          Cliquez sur le lien dans l'email pour activer votre compte, puis connectez-vous.
        </p>
        <Link to="/login"
          className="block w-full py-3 rounded-xl font-bold text-navy text-center"
          style={{ backgroundColor: '#F5A623' }}>
          Aller à la connexion
        </Link>
      </div>
    </div>
  )

  // ── Success (auto-logged in) ───────────────────────────────────────────────
  if (done) return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 text-center max-w-sm shadow-2xl">
        <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-navy mb-2">Compte créé !</h2>
        <p className="text-gray-400">Redirection en cours…</p>
      </div>
    </div>
  )

  // ── Signup form ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="md" dark={false} />
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="font-display text-2xl font-extrabold text-navy mb-1">Créer un compte</h1>
          <p className="text-gray-400 text-sm mb-6">Rejoignez AfriGate gratuitement</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-red-600 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Prénom</label>
                <input
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  placeholder="Moussa"
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-navy text-sm outline-none focus:border-yellow-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Nom</label>
                <input
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  placeholder="Diallo"
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-navy text-sm outline-none focus:border-yellow-400 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-navy text-sm outline-none focus:border-yellow-400 transition-colors"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Pays de résidence</label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-navy text-sm outline-none bg-white focus:border-yellow-400 transition-colors"
              >
                <option value="">Sélectionnez votre pays</option>
                {ALL_COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={phonePlaceholder}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-navy text-sm outline-none focus:border-yellow-400 transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">
                Avec l'indicatif — {phonePlaceholder.replace('ex : ', '')} (si {selectedCountry?.name || 'votre pays'})
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="6 caractères minimum"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-12 text-navy text-sm outline-none focus:border-yellow-400 transition-colors"
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Répétez votre mot de passe"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-navy text-sm outline-none focus:border-yellow-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-navy transition-all shadow-lg disabled:opacity-50"
              style={{ backgroundColor: '#F5A623' }}
            >
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
