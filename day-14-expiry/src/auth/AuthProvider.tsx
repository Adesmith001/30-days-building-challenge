/* eslint-disable react-refresh/only-export-components -- provider and its hook form one public module */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { config, isSupabaseConfigured } from '../lib/config'
import { supabase } from '../lib/supabase'

type AppUser = Pick<User, 'id' | 'email' | 'user_metadata'>
type EmailAction = 'sign_in' | 'sign_up' | 'reset'

type AuthContextValue = {
  configured: boolean
  ready: boolean
  user: AppUser | null
  continueDemo(): void
  email(action: EmailAction, email: string, password?: string): Promise<string | null>
  google(): Promise<void>
  updatePassword(password: string): Promise<void>
  signOut(): Promise<void>
  getAccessToken(): Promise<string | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const DEMO_SESSION = 'expiry.demo.session'
const demoUser: AppUser = { id: 'demo-user', email: 'demo@expiry.local', user_metadata: { full_name: 'Demo Creator' } }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!isSupabaseConfigured)
  const [user, setUser] = useState<AppUser | null>(() => !isSupabaseConfigured && localStorage.getItem(DEMO_SESSION) ? demoUser : null)

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setReady(true) })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => data.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    configured: isSupabaseConfigured,
    ready,
    user,
    continueDemo() {
      localStorage.setItem(DEMO_SESSION, '1')
      setUser(demoUser)
    },
    async email(action, emailAddress, password) {
      const response = await fetch('/api/auth/email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, email: emailAddress, password, redirectTo: `${config.appUrl}/reset-password` }),
      })
      const body = await response.json() as { message?: string; accessToken?: string; refreshToken?: string; error?: string }
      if (!response.ok) throw new Error(body.error ?? 'Authentication failed.')
      if (body.accessToken && body.refreshToken && supabase) await supabase.auth.setSession({ access_token: body.accessToken, refresh_token: body.refreshToken })
      return body.message ?? null
    },
    async google() {
      if (!supabase) return
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
      if (error) throw error
    },
    async updatePassword(password) {
      if (!supabase) throw new Error('Password recovery needs Supabase configuration.')
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
    },
    async signOut() {
      localStorage.removeItem(DEMO_SESSION)
      if (supabase) await supabase.auth.signOut()
      setUser(null)
    },
    async getAccessToken() {
      if (!supabase) return null
      return (await supabase.auth.getSession()).data.session?.access_token ?? null
    },
  }), [ready, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthProvider is missing')
  return value
}
