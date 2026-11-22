import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recovery, setRecovery] = useState(false) // true : l'utilisateur arrive depuis un lien de réinitialisation

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
      setProfile(data)
    } catch {}
  }

  /**
   * SIGNUP — tout passe par la fonction serveur "register" (Supabase Edge Function) qui :
   *   1. contrôle le jeton "numéro vérifié" (émis uniquement après validation NumLookup côté serveur)
   *   2. applique les limites anti-abus
   *   3. crée le compte + le profil (nom, téléphone, pays)
   * Puis on ouvre la session avec email + mot de passe.
   */
  async function signUp({ email, password, firstName, lastName, countryCode, localNumber, phoneToken }) {
    const { data, error } = await supabase.functions.invoke('register', {
      body: { action: 'register', email, password, firstName, lastName, countryCode, localNumber, phoneToken },
    })
    if (error) throw new Error('Connexion au serveur impossible. Réessayez dans un instant.')
    if (!data?.ok) throw new Error(data?.message || 'Inscription impossible.')

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    if (signInError || !signInData?.session) return { success: true, session: null, needsLogin: true }
    return { success: true, session: signInData.session, needsLogin: false }
  }

  /** Vérifie le numéro via la fonction serveur. Renvoie { ok, formatted, token } ou { ok:false, message }. */
  async function verifyPhone({ countryCode, localNumber }) {
    const { data, error } = await supabase.functions.invoke('register', {
      body: { action: 'verify', countryCode, localNumber },
    })
    if (error) return { ok: false, message: 'Connexion au serveur impossible. Réessayez dans un instant.' }
    return data || { ok: false, message: 'Réponse invalide.' }
  }

  /**
   * SIGNIN — Standard Supabase signIn with clear French error messages
   */
  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (error) {
      const msg = error.message || ''
      if (msg.includes('Email not confirmed')) {
        throw new Error('Email non confirmé. Contactez le support AfriGate.')
      }
      if (msg.includes('Invalid login') || msg.includes('invalid_credentials')) {
        throw new Error('Email ou mot de passe incorrect.')
      }
      if (msg.includes('rate limit') || msg.includes('too many')) {
        throw new Error('Trop de tentatives. Attendez quelques minutes.')
      }
      throw new Error('Connexion impossible : ' + msg)
    }

    if (!data?.session) {
      throw new Error('Connexion échouée. Réessayez.')
    }

    return data
  }

  async function signOut() {
    try { await supabase.auth.signOut() } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, recovery, signUp, verifyPhone, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
