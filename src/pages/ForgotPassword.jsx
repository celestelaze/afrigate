import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const clean = email.trim().toLowerCase()
    if (!EMAIL_RE.test(clean)) { setError('Adresse email invalide.'); return }
    setLoading(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(clean, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (err && /rate|too many|seconds|limit/i.test(err.message || '')) {
      setError('Trop de demandes. Réessayez dans une minute.')
      return
    }
    // Même message que le compte existe ou non : on ne révèle pas quelles adresses sont inscrites
    setSent(true)
    setCooldown(60)
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><Logo size="md" dark={false} /></div>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="font-display text-2xl font-extrabold text-navy mb-1">Mot de passe oublié</h1>
          <p className="text-gray-500 text-sm mb-6">
            Saisissez l'adresse email de votre compte. Nous vous enverrons un lien pour choisir un nouveau mot de passe.
          </p>

          {sent ? (
            <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <div className="flex items-center gap-2 font-semibold mb-1"><CheckCircle size={16} /> Demande envoyée</div>
              Si un compte existe avec cette adresse, un email contenant un lien de réinitialisation vient d'être envoyé.
              Vérifiez aussi vos courriers indésirables. Le lien est valable pour une durée limitée.
            </div>
          ) : null}

          {error && (
            <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-red-700 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={sent ? 'mt-5' : ''}>
            <label htmlFor="fp-email" className="block text-sm font-semibold text-navy mb-1.5">Adresse email</label>
            <input id="fp-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="votre@email.com"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-navy text-sm outline-none focus:border-yellow-400 mb-4" />
            <button type="submit" disabled={loading || cooldown > 0}
              className="w-full py-3.5 rounded-xl font-bold text-navy disabled:opacity-50" style={{ backgroundColor: '#F5A623' }}>
              {loading ? 'Envoi en cours…' : cooldown > 0 ? `Renvoyer dans ${cooldown} s` : sent ? 'Renvoyer le lien' : 'Envoyer le lien'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            <Link to="/login" className="font-semibold hover:underline text-navy">Retour à la connexion</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
