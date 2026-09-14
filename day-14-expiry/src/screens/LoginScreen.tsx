import { useState, type FormEvent } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { validateEmail, validatePassword } from '../domain/validation'

export function LoginScreen() {
  const auth = useAuth()
  const [mode, setMode] = useState<'sign_in' | 'sign_up' | 'reset'>('sign_in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setNotice('')
    const error = validateEmail(email) ?? (mode === 'reset' ? null : validatePassword(password))
    if (error) return setNotice(error)
    setBusy(true)
    try { setNotice((await auth.email(mode, email, password)) ?? '') } catch (reason) { setNotice(reason instanceof Error ? reason.message : 'Authentication failed.') } finally { setBusy(false) }
  }
  return <main className="login-page">
    <div className="login-brand">Expiry<span className="mark">.</span></div>
    <section className="login-copy">
      <p className="eyebrow">PRIVATE BY DESIGN</p>
      <h1>Share things that<br />shouldn&apos;t live forever.</h1>
      <p>Create temporary private links that disappear automatically.</p>
    </section>
    <section className="auth-panel" aria-label="Sign in">
      {auth.configured ? <>
        <button className="google-button" onClick={() => void auth.google()}><span>G</span> Continue with Google</button>
        <div className="or"><span>or continue with email</span></div>
        <form onSubmit={submit}>
          <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
          {mode !== 'reset' && <label>Password<input type="password" autoComplete={mode === 'sign_up' ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" /></label>}
          {notice && <p className="form-notice" role="status">{notice}</p>}
          <button className="primary" disabled={busy}>{busy ? 'Please wait…' : mode === 'sign_in' ? 'Sign in' : mode === 'sign_up' ? 'Create account' : 'Send reset link'}</button>
        </form>
        <div className="auth-links">
          <button onClick={() => setMode(mode === 'sign_up' ? 'sign_in' : 'sign_up')}>{mode === 'sign_up' ? 'Already have an account?' : 'Create an account'}</button>
          {mode !== 'reset' && <button onClick={() => setMode('reset')}>Forgot password?</button>}
          {mode === 'reset' && <button onClick={() => setMode('sign_in')}>Back to sign in</button>}
        </div>
      </> : <>
        <button className="primary demo-button" onClick={auth.continueDemo}>Continue in demo mode <span>→</span></button>
        <p className="demo-note"><i /> Supabase isn&apos;t connected yet. Everything stays in this browser.</p>
      </>}
      <small>By continuing, you agree to use Expiry responsibly.</small>
    </section>
  </main>
}
