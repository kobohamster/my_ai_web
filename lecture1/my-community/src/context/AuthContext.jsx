import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
    return data
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  // 아이디(username)를 내부 이메일로 변환
  const toInternalEmail = (username) => `${username}@untildawn.community`

  const signIn = async (username, password) => {
    const email = toInternalEmail(username)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const prof = await fetchProfile(data.user.id)
    if (prof?.status === 'pending') {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      throw new Error('PENDING')
    }
    if (prof?.status === 'rejected') {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      throw new Error('REJECTED')
    }
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const checkUsernameAvailable = async (username) => {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle()
    return !data
  }

  const register = async ({ username, password, fullName, birthDate }) => {
    const email = toInternalEmail(username)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username,
      full_name: fullName,
      birth_date: birthDate,
      status: 'approved',
      is_admin: false,
    })
    if (profileError) throw profileError

    await fetchProfile(data.user.id)
    return true
  }

  const refreshProfile = () => {
    if (user) fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signOut,
      register,
      checkUsernameAvailable,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
