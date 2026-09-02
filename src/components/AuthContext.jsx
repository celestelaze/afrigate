import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

  async function signUp({ email, password, firstName, lastName, phone, country }) {
    // 1. Create the account
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      const msg = error.message || ''
      if (msg.includes('already registered') || msg.includes('User already registered')) {
        throw new Error('Cet email est déjà utilisé. Connectez-vous plutôt.')
      }
      if (msg.includes('rate limit') || msg.includes('too many')) {
        throw new Error('Trop de tentatives. Attendez quelques minutes.')
      }
      throw new Error(msg || 'Inscription impossible.')
    }

    if (!data?.user) throw new Error('Erreur lors de la création du compte.')

    // 2. Our DB trigger auto-confirms the email. Try immediate sign-in.
    let session = data.session
    if (!session) {
      const { data: signInData } = await supabase.auth.signInWithPassword({ email, password })
      if (signInData?.session) session = signInData.session
    }

    // 3. Save profile
    const userId = data.user.id
    try {
      await supabase.from('profiles').upsert({
        id: userId,
        first_name: firstName || '',
        last_name:  lastName  || '',
        phone:      phone     || '',
        country:    country   || '',
      })
    } catch {}

    return {
      user: data.user,
      session,                          // non-null if trigger worked
      needsEmailConfirmation: !session, // only true if trigger somehow failed
    }
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      const msg = error.message || ''
      if (msg.includes('Email not confirmed')) {
        throw new Error('Email non confirmé. Vérifiez vos spams ou contactez le support.')
      }
      if (msg.includes('Invalid login') || msg.includes('invalid_credentials')) {
        throw new Error('Email ou mot de passe incorrect.')
      }
      throw new Error(msg || 'Connexion impossible.')
    }

    return data
  }

  async function signOut() {
    try { await supabase.auth.signOut() } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
