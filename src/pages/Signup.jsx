import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../components/AuthContext'
import Logo from '../components/Logo'
import { COUNTRIES, MOROCCO } from '../lib/constants'
import { DIAL_CODES, validatePhone, getPlaceholder } from '../lib/phoneValidation'

const allCountries = [MOROCCO, ...COUNTRIES]

export default function Signup() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', country: '', password: '', confirm: '' })
  const [phoneLocal, setPhoneLocal] = useState('')
  const [phoneCountry, setPhoneCountry] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirectTo = params.get('redirect') || '/transfer'

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // When country changes, auto-set phone country code
  useEffect(() => {
    if (form.country) {
      const found = allCountries.find(c => c.name === form.country)
      if (found) setPhoneCountry(found.code)
    }
  }, [form.country])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (form.password.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères.'); return }
    if (!phoneLocal || !phoneCountry) { setError('Veuillez saisir votre numéro de téléphone.'); return }

    setLoading(true)

    // Validate phone
    const { valid, formatted, error: pErr } = await validatePhone(phoneLocal, phoneCountry)
    if (!valid && pErr) {
      setPhoneError(pErr)
      setLoading(false)
      return
    }
    const fullPhone = formatted || `+${DIAL_CODES[phoneCountry]?.code}${phoneLocal}`

    try {
      await signUp({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: fullPhone,
        country: form.country,
      })
      setSuccess(true)
      // Restore pending transfer if any
      const pendingDir = sessionStorage.getItem('pending_transfer_direction')
      setTimeout(() => {
        sessionStorage.removeItem('pending_transfer_direction')
        navigate(redirectTo)
      }, 1500)
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
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Prénom</label>
                <input value={form.firstName} onChange={e => set('firstName', e.target.value)} required
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Nom</label>
                <input value={form.lastName} onChange={e => set('lastName', e.target.value)} required
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Pays de résidence</label>
              <select value={form.country} onChange={e => set('country', e.target.value)} required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm bg-white">
                <option value="">Sélectionnez votre pays</option>
                {allCountries.map(c => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            {/* Phone with auto country code */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Téléphone</label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-gold-DEFAULT transition-colors">
                {/* Prefix badge */}
                <div className="bg-gray-50 border-r border-gray-200 px-3 py-2.5 text-navy font-semibold text-sm flex-shrink-0 min-w-[60px] text-center">
                  {phoneCountry && DIAL_CODES[phoneCountry] ? `+${DIAL_CODES[phoneCountry].code}` : '—'}
                </div>
                <input
                  type="tel"
                  value={phoneLocal}
                  onChange={e => { setPhoneLocal(e.target.value.replace(/^0+/, '')); setPhoneError('') }}
                  placeholder={phoneCountry ? getPlaceholder(phoneCountry) : 'Choisissez votre pays d\'abord'}
                  disabled={!phoneCountry}
                  className="flex-1 px-3 py-2.5 text-navy outline-none bg-white text-sm disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
              {phoneCountry && DIAL_CODES[phoneCountry] && (
                <p className="text-xs text-gray-400 mt-1">
                  Saisissez sans l'indicatif (+{DIAL_CODES[phoneCountry].code}) — ex: {getPlaceholder(phoneCountry)}
                </p>
              )}
              {phoneError && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {phoneError}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-12 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Confirmer le mot de passe</label>
              <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-navy transition-colors shadow-lg disabled:opacity-60 mt-2"
              style={{backgroundColor:'#F5A623'}}>
              {loading ? 'Vérification...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{color:'#F5A623'}}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
