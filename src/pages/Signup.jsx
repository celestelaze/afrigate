import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader, Phone } from 'lucide-react'
import { useAuth } from '../components/AuthContext'
import Logo from '../components/Logo'
import { COUNTRIES, MOROCCO } from '../lib/constants'

const ALL_COUNTRIES = [MOROCCO, ...COUNTRIES]

const NUMLOOKUP_KEY = 'num_live_8KItMVicYhtNF4PSG3ySADadCl46YEExbzdxturC'

// Phone example per country code
const PHONE_EXAMPLE = {
  MA: '+212 6 12 34 56 78',
  CI: '+225 07 00 00 00 00',
  SN: '+221 77 000 00 00',
  GW: '+245 95 000 00 00',
  ML: '+223 70 00 00 00',
  NE: '+227 90 00 00 00',
  BF: '+226 70 00 00 00',
}

async function verifyPhone(phone) {
  // Normalize phone: ensure it starts with +
  const cleaned = phone.replace(/\s+/g, '')
  const normalized = cleaned.startsWith('+') ? cleaned : `+${cleaned}`
  try {
    const res = await fetch(
      `https://api.numlookupapi.com/v1/validate/${encodeURIComponent(normalized)}`,
      { headers: { apikey: NUMLOOKUP_KEY } }
    )
    if (!res.ok) return { valid: true } // API error → allow
    const data = await res.json()
    return { valid: data.valid !== false, formatted: data.international_format || normalized }
  } catch {
    return { valid: true } // Network error → allow
  }
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
  const [phoneStep, setPhoneStep] = useState('idle') // idle | verifying | valid | invalid
  const [success,   setSuccess]   = useState(false)
  const [needsEmail, setNeedsEmail] = useState(false)

  const { signUp }  = useAuth()
  const navigate    = useNavigate()
  const [params]    = useSearchParams()
  const redirectTo  = params.get('redirect') || '/transfer'

  const selectedCountry = ALL_COUNTRIES.find(c => c.name === country)
  const phoneExample = selectedCountry ? PHONE_EXAMPLE[selectedCountry.code] : '+221 77 000 00 00'

  // Step 1: Verify phone with NumLookup
  async function handleVerifyPhone() {
    if (!phone.trim()) { setError('Saisissez votre numéro de téléphone'); return }
    setPhoneStep('verifying')
    setError('')
    const result = await verifyPhone(phone)
    if (result.valid) {
      if (result.formatted) setPhone(result.formatted)
      setPhoneStep('valid')
    } else {
      setPhoneStep('invalid')
      setError('Numéro de téléphone invalide. Vérifiez le format (avec indicatif, ex: +221 77 000 00 00)')
    }
  }

  // Step 2: Submit form after phone verified
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (phoneStep !== 'valid') {
      setError('Veuillez d\'abord vérifier votre numéro de téléphone.')
      return
    }
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
      if (result.hasSession) {
        setSuccess(true)
        setTimeout(() => navigate(redirectTo), 1200)
      } else {
        // Supabase requires email confirmation
        setNeedsEmail(true)
      }
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
        <p className="text-gray-400">Redirection…</p>
      </div>
    </div>
  )

  if (needsEmail) return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 text-center max-w-sm shadow-2xl">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="font-display text-xl font-bold text-navy mb-3">Confirmez votre email</h2>
        <p className="text-gray-500 text-sm mb-2">
          Un lien de confirmation a été envoyé à <strong>{email}</strong>
        </p>
        <p className="text-gray-400 text-xs mb-6">Cliquez sur le lien puis revenez vous connecter.</p>
        <Link to="/login"
          className="block w-full py-3 rounded-xl font-bold text-center text-navy"
          style={{ backgroundColor: '#F5A623' }}>
          Se connecter
        </Link>
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
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-red-600 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Prénom</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} required
                  placeholder="Moussa"
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-navy text-sm outline-none focus:border-yellow-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Nom</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} required
                  placeholder="Diallo"
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-navy text-sm outline-none focus:border-yellow-400" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="votre@email.com"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-navy text-sm outline-none focus:border-yellow-400" />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Pays de résidence</label>
              <select value={country} onChange={e => setCountry(e.target.value)} required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-navy text-sm outline-none bg-white focus:border-yellow-400">
                <option value="">Sélectionnez votre pays</option>
                {ALL_COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            {/* Phone — with NumLookup verification */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Téléphone</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setPhoneStep('idle') }}
                  placeholder={phoneExample}
                  className={`flex-1 border-2 rounded-xl px-4 py-2.5 text-navy text-sm outline-none transition-colors ${
                    phoneStep === 'valid'   ? 'border-green-400 bg-green-50' :
                    phoneStep === 'invalid' ? 'border-red-400'               :
                    'border-gray-200 focus:border-yellow-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleVerifyPhone}
                  disabled={phoneStep === 'verifying' || !phone.trim()}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-navy flex-shrink-0 disabled:opacity-50 transition-all"
                  style={{ backgroundColor: phoneStep === 'valid' ? '#22c55e' : '#F5A623', color: phoneStep === 'valid' ? 'white' : '#1B2A6B' }}>
                  {phoneStep === 'verifying' ? <Loader size={16} className="animate-spin" /> :
                   phoneStep === 'valid'     ? '✓ OK' :
                   'Vérifier'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {phoneStep === 'valid'
                  ? '✅ Numéro vérifié et valide'
                  : `Format international requis — ex: ${phoneExample}`}
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="6 caractères minimum"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-12 text-navy text-sm outline-none focus:border-yellow-400" />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Confirmer le mot de passe</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                placeholder="Répétez votre mot de passe"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-navy text-sm outline-none focus:border-yellow-400" />
            </div>

            <button type="submit" disabled={loading || phoneStep !== 'valid'}
              className="w-full py-3.5 rounded-xl font-bold text-navy transition-all shadow-lg disabled:opacity-50"
              style={{ backgroundColor: '#F5A623' }}>
              {loading ? 'Création en cours…' : 'Créer mon compte'}
            </button>

            {phoneStep !== 'valid' && (
              <p className="text-xs text-center text-gray-400">
                Vérifiez d'abord votre numéro de téléphone pour activer le bouton
              </p>
            )}
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
