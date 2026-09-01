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
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }

  async function signUp({ email, password, firstName, lastName, phone, country }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName }
      }
    })

    if (error) {
      if (
        error.message.includes('already registered') ||
        error.message.includes('already been registered') ||
        error.message.includes('User already registered')
      ) {
        throw new Error('Cet email est déjà utilisé. Connectez-vous plutôt.')
      }
      throw new Error(error.message)
    }

    // Supabase returns identities:[] when email already exists
    if (data.user?.identities?.length === 0) {
      throw new Error('Cet email est déjà utilisé. Connectez-vous plutôt.')
    }

    // Save profile regardless of email confirmation state
    if (data.user?.id) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        first_name: firstName || '',
        last_name: lastName || '',
        phone: phone || '',
        country: country || '',
      })
    }

    // ✅ Success — whether email confirmation is needed or not
    // We don't throw on missing session. The Signup page handles both cases.
    return {
      user: data.user,
      session: data.session,
      needsEmailConfirmation: data.user && !data.session
    }
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Veuillez confirmer votre adresse email. Vérifiez votre boîte mail (et les spams).')
      }
      if (
        error.message.includes('Invalid login credentials') ||
        error.message.includes('invalid_credentials')
      ) {
        throw new Error('Email ou mot de passe incorrect.')
      }
      throw new Error(error.message)
    }
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
