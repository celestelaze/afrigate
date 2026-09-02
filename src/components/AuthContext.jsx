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
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data)
    } catch {}
  }

  async function signUp({ email, password, firstName, lastName, phone, country }) {
    let data, error

    try {
      const result = await supabase.auth.signUp({ email, password })
      data = result.data
      error = result.error
    } catch (networkErr) {
      throw new Error('Connexion impossible. Vérifiez votre connexion internet.')
    }

    if (error) {
      const msg = error.message || ''
      if (msg.includes('already registered') || msg.includes('User already registered')) {
        throw new Error('Cet email est déjà utilisé. Connectez-vous plutôt.')
      }
      if (msg.includes('rate limit') || msg.includes('too many')) {
        throw new Error('Trop de tentatives. Attendez quelques minutes.')
      }
      throw new Error('Inscription impossible : ' + msg)
    }

    if (!data?.user) {
      throw new Error('Erreur inattendue lors de l\'inscription.')
    }

    // Save profile (best-effort, don't fail signup if this errors)
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        first_name: firstName || '',
        last_name: lastName || '',
        phone: phone || '',
        country: country || '',
      })
    } catch {}

    return {
      user: data.user,
      session: data.session,
      needsEmailConfirmation: !!data.user && !data.session,
    }
  }

  async function signIn({ email, password }) {
    let data, error

    try {
      const result = await supabase.auth.signInWithPassword({ email, password })
      data = result.data
      error = result.error
    } catch (networkErr) {
      throw new Error('Connexion impossible. Vérifiez votre connexion internet.')
    }

    if (error) {
      const msg = error.message || ''
      if (msg.includes('Email not confirmed')) {
        throw new Error('Confirmez votre email avant de vous connecter. Vérifiez vos spams.')
      }
      if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
        throw new Error('Email ou mot de passe incorrect.')
      }
      throw new Error('Connexion impossible : ' + msg)
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
