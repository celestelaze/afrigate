import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../components/AuthContext'
import Logo from '../components/Logo'
import { COUNTRIES, MOROCCO } from '../lib/constants'

const allCountries = [MOROCCO, ...COUNTRIES]

export default function Signup() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', country: '', password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (form.password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return }
    setLoading(true)
    try {
      await signUp({ email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName, phone: form.phone, country: form.country })
      setSuccess(true)
      setTimeout(() => navigate('/transfer'), 2000)
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 text-center max-w-sm">
        <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-navy mb-2">Compte créé !</h2>
        <p className="text-gray-400">Redirection vers le transfert…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><Logo size="md" dark={false} /></div>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="font-display text-2xl font-extrabold text-navy mb-1">Créer un compte</h1>
          <p className="text-gray-400 text-sm mb-8">Rejoignez AfriGate gratuitement</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-red-600 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Prénom</label>
                <input value={form.firstName} onChange={e => set('firstName', e.target.value)} required
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Nom</label>
                <input value={form.lastName} onChange={e => set('lastName', e.target.value)} required
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Téléphone</label>
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="+212 600 000 000"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Pays de résidence</label>
              <select value={form.country} onChange={e => set('country', e.target.value)} required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm bg-white">
                <option value="">Sélectionnez votre pays</option>
                {allCountries.map(c => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Mot de passe</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-12 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Confirmer le mot de passe</label>
              <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy text-sm" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gold-DEFAULT text-navy font-bold hover:bg-gold-light transition-colors shadow-lg shadow-gold-DEFAULT/20 disabled:opacity-60 mt-2">
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-gold-DEFAULT font-semibold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
