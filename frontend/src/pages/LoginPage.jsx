import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import './AuthPage.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [tab, setTab]   = useState('email') // 'email' | 'kod'
  const [form, setForm] = useState({ email: '', sifre: '', kod: '' })
  const [kodStep, setKodStep] = useState(false) // kod doğrulandı, e-posta iste
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  function handle(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const body = tab === 'email'
        ? { email: form.email, sifre: form.sifre }
        : kodStep
          ? { kod: form.kod, email: form.email }
          : { kod: form.kod }

      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await r.json()
      if (!d.success) throw new Error(d.error?.message || 'Giriş başarısız.')

      if (d.kodOnay) {
        setKodStep(true)
        setLoading(false)
        return
      }

      login(d.token, d.user)
      navigate(d.user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">Hatıra Dergi<span></span></div>
          <h1 className="auth-title">Giriş Yap</h1>
          <p className="auth-sub">Hesabınıza erişin</p>

          <div className="auth-tabs">
            <button className={`auth-tab ${tab==='email'?'active':''}`} onClick={() => { setTab('email'); setKodStep(false); setError(null) }}>
              E-posta ile
            </button>
            <button className={`auth-tab ${tab==='kod'?'active':''}`} onClick={() => { setTab('kod'); setKodStep(false); setError(null) }}>
              Benzersiz Kod ile
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {tab === 'email' && (
              <>
                <div className="auth-field">
                  <label>E-posta</label>
                  <input name="email" type="email" value={form.email} onChange={handle} placeholder="ornek@mail.com" required />
                </div>
                <div className="auth-field">
                  <label>Şifre</label>
                  <input name="sifre" type="password" value={form.sifre} onChange={handle} placeholder="••••••••" required />
                </div>
              </>
            )}

            {tab === 'kod' && !kodStep && (
              <div className="auth-field">
                <label>9 Haneli Kod</label>
                <input name="kod" type="text" value={form.kod} onChange={handle} placeholder="123456789" maxLength={9} required />
              </div>
            )}

            {tab === 'kod' && kodStep && (
              <>
                <p className="auth-info">Kodunuz doğrulandı. E-postanızı girin.</p>
                <div className="auth-field">
                  <label>E-posta</label>
                  <input name="email" type="email" value={form.email} onChange={handle} placeholder="ornek@mail.com" required />
                </div>
              </>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
            </button>
          </form>

          <p className="auth-switch">
            Hesabınız yok mu? <Link to="/kayit">Kayıt olun</Link>
          </p>
        </div>
      </div>
    </>
  )
}
