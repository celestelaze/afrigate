import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { supabase, INITIAL_URL } from '../lib/supabase'
import { useAuth } from '../components/AuthContext'
import Logo from '../components/Logo'

export default function ResetPassword() {
  const { recovery } = useAuth()
  const navigate = useNavigate()
  const recoveryRef = useRef(recovery)
  recoveryRef.current = recovery

  const [status, setStatus] = useState('checking') // checking | ready | invalid | done
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Le lien est valide si une session de récupération est ouverte (≈ 4 s d'attente maximum)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const fromLink = /type=recovery/.test(INITIAL_URL)
      for (let i = 0; i < 8 && !cancelled; i++) {
        const { data } = await supabase.auth.getSession()
        if (data.session && (recoveryRef.current || fromLink)) { if (!cancelled) { window.history.replaceState(null, '', '/reset-password'); setStatus('ready') } return }
        await new Promise(r => setTimeout(r, 500))
      }
      if (!cancelled) setStatus('invalid')
    })()
    return () => { cancelled = true }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Mot de passe : 8 caractères minimum.'); return }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) {
      setLoading(false)
      setError(/same|different/i.test(err.message || '')
        ? "Choisissez un mot de passe différent de l'ancien."
        : 'Impossible de modifier le mot de passe. Le lien a peut-être expiré : demandez-en un nouveau.')
      return
    }
    // Toutes les sessions ouvertes (autres appareils compris) sont fermées : on se reconnecte avec le nouveau mot de passe
    try { await supabase.auth.signOut({ scope: 'global' }) } catch { /* ignoré */ }
    setLoading(false)
    setStatus('done')
    setTimeout(() => navigate('/login'), 2500)
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><Logo size="md" dark={false} /></div>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {status === 'checking' && <p role="status" className="text-center text-gray-500 py-6">Vérification du lien…</p>}

          {status === 'invalid' && (
            <div role="alert" className="text-center">
              <AlertCircle size={44} className="mx-auto mb-3 text-red-600" />
              <h1 className="font-display text-xl font-extrabold text-navy mb-2">Lien invalide ou expiré</h1>
              <p className="text-gray-500 text-sm mb-6">Ce lien de réinitialisation n'est plus valable. Demandez-en un nouveau.</p>
              <Link to="/forgot-password" className="block w-full py-3.5 rounded-xl font-bold text-navy text-center" style={{ backgroundColor: '#F5A623' }}>
                Demander un nouveau lien
              </Link>
            </div>
          )}

          {status === 'done' && (
            <div role="status" className="text-center">
              <CheckCircle size={52} className="mx-auto mb-3 text-green-500" />
              <h1 className="font-display text-xl font-extrabold text-navy mb-2">Mot de passe modifié</h1>
              <p className="text-gray-500 text-sm">Connectez-vous avec votre nouveau mot de passe. Redirection en cours…</p>
            </div>
          )}

          {status === 'ready' && (
            <>
              <h1 className="font-display text-2xl font-extrabold text-navy mb-1">Nouveau mot de passe</h1>
              <p className="text-gray-500 text-sm mb-6">Choisissez un mot de passe d'au moins 8 caractères.</p>
              {error && (
                <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-red-700 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /><span>{error}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="rp-pwd" className="block text-sm font-semibold text-navy mb-1.5">Nouveau mot de passe</label>
                  <input id="rp-pwd" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-navy text-sm outline-none focus:border-yellow-400" />
                </div>
                <div>
                  <label htmlFor="rp-confirm" className="block text-sm font-semibold text-navy mb-1.5">Confirmer le mot de passe</label>
                  <input id="rp-confirm" type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-navy text-sm outline-none focus:border-yellow-400" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-navy disabled:opacity-50" style={{ backgroundColor: '#F5A623' }}>
                  {loading ? 'Enregistrement…' : 'Enregistrer le mot de passe'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
