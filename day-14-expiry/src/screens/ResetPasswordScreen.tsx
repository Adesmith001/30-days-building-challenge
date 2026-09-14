import { useState, type FormEvent } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { navigate } from '../domain/routes'
import { validatePassword } from '../domain/validation'

export function ResetPasswordScreen() {
  const auth = useAuth(); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [notice, setNotice] = useState('')
  async function submit(event: FormEvent) { event.preventDefault(); const error = validatePassword(password) ?? (password === confirm ? null : 'Passwords do not match.'); if (error) return setNotice(error); try { await auth.updatePassword(password); setNotice('Password updated. You can return to Expiry.') } catch (reason) { setNotice(reason instanceof Error ? reason.message : 'Could not update password.') } }
  return <main className="recipient-page"><div className="recipient-brand">Expiry<span className="mark">.</span></div><section className="auth-panel reset"><p className="eyebrow">ACCOUNT RECOVERY</p><h1>Choose a new password.</h1><form onSubmit={submit}><label>New password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><label>Confirm password<input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} /></label>{notice && <p role="status">{notice}</p>}<button className="primary">Update password</button></form><button className="text-button" onClick={() => navigate('/')}>Return to Expiry</button></section></main>
}
