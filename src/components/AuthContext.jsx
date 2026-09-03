import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
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

  /**
   * SIGNUP — Uses our custom SQL function `register_user` which:
   *   1. Creates the user directly in auth.users WITH email_confirmed_at = NOW()
   *   2. Creates the profile row
   *   3. Returns {success, user_id} or {success:false, error, message}
   * Then immediately calls signInWithPassword to get a session.
   * This completely bypasses Supabase email confirmation.
   */
  async function signUp({ email, password, firstName, lastName, phone, country }) {
    // Step 1: Create user via our SQL function (email pre-confirmed)
    const { data: rpcData, error: rpcError } = await supabase.rpc('register_user', {
      p_email:      email.trim().toLowerCase(),
      p_password:   password,
      p_first_name: firstName || '',
      p_last_name:  lastName  || '',
      p_phone:      phone     || '',
      p_country:    country   || '',
    })

    if (rpcError) {
      throw new Error('Erreur de connexion au serveur. Réessayez.')
    }

    if (!rpcData?.success) {
      const msg = rpcData?.message || 'Inscription impossible.'
      if (rpcData?.error === 'email_exists') {
        throw new Error('Cet email est déjà utilisé. Connectez-vous plutôt.')
      }
      throw new Error(msg)
    }

    // Step 2: Sign in immediately (email is already confirmed in DB)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email:    email.trim().toLowerCase(),
      password,
    })

    if (signInError || !signInData?.session) {
      // Account created but session failed — tell user to login
      return { success: true, session: null, needsLogin: true }
    }

    return { success: true, session: signInData.session, needsLogin: false }
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
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
