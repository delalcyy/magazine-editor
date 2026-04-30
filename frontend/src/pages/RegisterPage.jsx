import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import './AuthPage.css'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm] = useState({ ad: '', soyad: '', telefon: '', email: '', sifre: '' })
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
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const d = await r.json()
      if (!d.success) throw new Error(d.error?.message || 'Kayıt başarısız.')
      login(d.token, d.user)
      navigate('/')
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
        <div className="auth-card auth-card-wide">
          <div className="auth-brand">Hatıra Dergi<span></span></div>
          <h1 className="auth-title">Hesap Oluştur</h1>
          <p className="auth-sub">Ücretsiz kaydolun</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-row">
              <div className="auth-field">
                <label>Ad</label>
                <input name="ad" value={form.ad} onChange={handle} placeholder="Adınız" required />
              </div>
              <div className="auth-field">
                <label>Soyad</label>
                <input name="soyad" value={form.soyad} onChange={handle} placeholder="Soyadınız" required />
              </div>
            </div>
            <div className="auth-field">
              <label>Telefon <span className="auth-opt">(İsteğe bağlı)</span></label>
              <input name="telefon" type="tel" value={form.telefon} onChange={handle} placeholder="05xx xxx xx xx" />
            </div>
            <div className="auth-field">
              <label>E-posta</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="ornek@mail.com" required />
            </div>
            <div className="auth-field">
              <label>Şifre</label>
              <input name="sifre" type="password" value={form.sifre} onChange={handle} placeholder="En az 6 karakter" minLength={6} required />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Kaydediliyor…' : 'Kayıt Ol'}
            </button>
          </form>

          <p className="auth-switch">
            Zaten hesabınız var mı? <Link to="/giris">Giriş yapın</Link>
          </p>
        </div>
      </div>
    </>
  )
}
