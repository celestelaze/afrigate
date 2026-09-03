import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { useAuth } from '../components/AuthContext'
import Logo from '../components/Logo'
import { COUNTRIES, MOROCCO } from '../lib/constants'

const ALL_COUNTRIES = [MOROCCO, ...COUNTRIES]

const NUMLOOKUP_KEY = 'num_live_8KItMVicYhtNF4PSG3ySADadCl46YEExbzdxturC'

const DIAL = {
  MA: { code: '212', placeholder: '6 12 34 56 78' },
  CI: { code: '225', placeholder: '07 00 00 00 00' },
  SN: { code: '221', placeholder: '77 000 00 00' },
  GW: { code: '245', placeholder: '95 000 00 00' },
  ML: { code: '223', placeholder: '70 00 00 00' },
  NE: { code: '227', placeholder: '90 00 00 00' },
  BF: { code: '226', placeholder: '70 00 00 00' },
}

async function verifyPhoneNumLookup(dialCode, localNumber) {
  const local = localNumber.replace(/\D/g, '') // digits only
  const full  = `${dialCode}${local}`
  try {
    const res = await fetch(
      `https://api.numlookupapi.com/v1/validate/${full}`,
      { headers: { apikey: NUMLOOKUP_KEY }, signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) return { valid: true, formatted: `+${full}` }
    const data = await res.json()
    return { valid: data.valid !== false, formatted: data.international_format || `+${full}` }
  } catch {
    // Network issue or timeout → don't block user
    return { valid: true, formatted: `+${full}` }
  }
}

export default function Signup() {
  const [firstName,  setFirstName]  = useState('')
  const [lastName,   setLastName]   = useState('')
  const [email,      setEmail]      = useState('')
  const [localPhone, setLocalPhone] = useState('')
  const [country,    setCountry]    = useState('')
  const [password,   setPassword]   = useState('')
  const [confirm,    setConfirm]    = useState('')
  const [showPwd,    setShowPwd]    = useState(false)
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [phoneState, setPhoneState] = useState('idle') // idle|verifying|valid|invalid
  const [fullPhone,  setFullPhone]  = useState('')
  const [done,       setDone]       = useState(false)
  const [needsLogin, setNeedsLogin] = useState(false)

  const { signUp } = useAuth()
  const navigate   = useNavigate()
  const [params]   = useSearchParams()
  const redirectTo = params.get('redirect') || '/transfer'

  const selectedCountry = ALL_COUNTRIES.find(c => c.name === country)
  const dial = selectedCountry ? DIAL[selectedCountry.code] : null

  function handleCountryChange(val) {
    setCountry(val)
    setLocalPhone('')
    setPhoneState('idle')
    setFullPhone('')
    setError('')
  }

  async function handleVerify() {
    if (!dial)              { setError("Sélectionnez votre pays d'abord."); return }
    if (!localPhone.trim()) { setError('Saisissez votre numéro.'); return }
    setPhoneState('verifying')
    setError('')
    const result = await verifyPhoneNumLookup(dial.code, localPhone)
    if (result.valid) {
      setFullPhone(result.formatted)
      setPhoneState('valid')
    } else {
      setPhoneState('invalid')
      setError(`Numéro invalide. Format attendu sans indicatif — ex : ${dial.placeholder}`)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (phoneState !== 'valid') { setError('Vérifiez votre numéro de téléphone.'); return }
    if (password !== confirm)   { setError('Les mots de passe ne correspondent pas.'); return }
    if (password.length < 6)   { setError('Mot de passe trop court (6 caractères minimum).'); return }

    setLoading(true)
    try {
      const result = await signUp({ email, password, firstName, lastName, phone: fullPhone, country })
      if (result.needsLogin) {
        setNeedsLogin(true)
      } else {
        setDone(true)
        setTimeout(() => navigate(redirectTo), 1200)
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 text-center max-w-sm shadow-2xl">
        <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-navy mb-2">Compte créé !</h2>
        <p className="text-gray-400 text-sm">Vous êtes connecté. Redirection en cours…</p>
      </div>
    </div>
  )

  if (needsLogin) return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 text-center max-w-sm shadow-2xl">
        <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-navy mb-3">Compte créé avec succès !</h2>
        <p className="text-gray-500 text-sm mb-6">
          Connectez-vous avec votre email et mot de passe.
        </p>
        <Link to="/login"
          className="block w-full py-3.5 rounded-xl font-bold text-center text-navy"
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
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" /><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prénom / Nom */}
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

            {/* Pays */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Pays de résidence</label>
              <select value={country} onChange={e => handleCountryChange(e.target.value)} required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-navy text-sm outline-none bg-white focus:border-yellow-400">
                <option value="">Sélectionnez votre pays</option>
                {ALL_COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            {/* Téléphone + NumLookup */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Téléphone</label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center px-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-navy font-bold text-sm flex-shrink-0 min-w-[64px]">
                  {dial ? `+${dial.code}` : '—'}
                </div>
                <input type="tel" value={localPhone}
                  onChange={e => { setLocalPhone(e.target.value); setPhoneState('idle'); setError('') }}
                  placeholder={dial ? dial.placeholder : "Choisissez un pays"}
                  disabled={!dial}
                  className={`flex-1 border-2 rounded-xl px-3 py-2.5 text-navy text-sm outline-none transition-colors disabled:bg-gray-100 ${
                    phoneState === 'valid'   ? 'border-green-400 bg-green-50' :
                    phoneState === 'invalid' ? 'border-red-400' :
                    'border-gray-200 focus:border-yellow-400'
                  }`} />
                <button type="button" onClick={handleVerify}
                  disabled={phoneState === 'verifying' || !localPhone.trim() || !dial}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold flex-shrink-0 disabled:opacity-50 flex items-center gap-1.5"
                  style={{ backgroundColor: phoneState === 'valid' ? '#22c55e' : '#F5A623', color: '#1B2A6B' }}>
                  {phoneState === 'verifying' ? <Loader size={14} className="animate-spin" />
                    : phoneState === 'valid' ? '✓ OK'
                    : 'Vérifier'}
                </button>
              </div>
              <p className={`text-xs mt-1 ${phoneState === 'valid' ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                {phoneState === 'valid'
                  ? `✅ Numéro vérifié : ${fullPhone}`
                  : dial ? `Sans indicatif — ex : ${dial.placeholder}` : ''}
              </p>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} required
                  placeholder="6 caractères minimum"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-11 text-navy text-sm outline-none focus:border-yellow-400" />
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {/* Confirmer */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Confirmer le mot de passe</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                placeholder="Répétez votre mot de passe"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-navy text-sm outline-none focus:border-yellow-400" />
            </div>

            <button type="submit" disabled={loading || phoneState !== 'valid'}
              className="w-full py-3.5 rounded-xl font-bold text-navy shadow-lg disabled:opacity-50 transition-all"
              style={{ backgroundColor: '#F5A623' }}>
              {loading ? 'Création en cours…' : 'Créer mon compte'}
            </button>

            {phoneState !== 'valid' && (
              <p className="text-xs text-center text-gray-400">
                ⚠️ Vérifiez votre numéro pour activer l'inscription
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
