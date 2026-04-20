import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import './AbonelikPage.css'

export default function AbonelikPage() {
  const { user, getToken, setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    ad: user?.ad || '', soyad: user?.soyad || '',
    il: '', ilce: '', adres: '',
  })
  const [seriNo, setSeriNo] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [seriLoading, setSeriLoading] = useState(false)
  const [error, setError] = useState(null)
  const [seriError, setSeriError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [seriSuccess, setSeriSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/abonelik/status', {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()).then(d => {
      if (d.success && d.abonelik) {
        setStatus(d.abonelik)
        if (d.abonelik.il)    setForm(p => ({ ...p, il: d.abonelik.il }))
        if (d.abonelik.ilce)  setForm(p => ({ ...p, ilce: d.abonelik.ilce }))
        if (d.abonelik.adres) setForm(p => ({ ...p, adres: d.abonelik.adres }))
      }
    }).catch(() => {})
  }, [])

  function handle(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const r = await fetch('/api/abonelik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      })
      const d = await r.json()
      if (!d.success) throw new Error(d.error?.message || 'Hata oluştu.')
      setSuccess(true)
      const me = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${getToken()}` } })
      const md = await me.json()
      if (md.success) setUser(md.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSeriDogrula(e) {
    e.preventDefault()
    if (!seriNo.trim()) return
    setSeriLoading(true); setSeriError(null)
    try {
      const r = await fetch('/api/abonelik/kod-dogrula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ seri_no: seriNo.trim() }),
      })
      const d = await r.json()
      if (!d.success) throw new Error(d.error?.message || 'Hata oluştu.')
      setSeriSuccess(true)
      const me = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${getToken()}` } })
      const md = await me.json()
      if (md.success) setUser(md.user)
      setTimeout(() => navigate('/kapak'), 1800)
    } catch (err) {
      setSeriError(err.message)
    } finally {
      setSeriLoading(false)
    }
  }

  const isActive = status?.aktif === 1
  const bitisTarihi = status?.bitis_tarihi ? new Date(status.bitis_tarihi).toLocaleDateString('tr-TR') : null

  return (
    <>
      <Header />
      <div className="ab-page">
        <div className="ab-head">
          <span className="ab-eyebrow">Abonelik</span>
          <h1 className="ab-title">Kapak Yıldız<em> Üyeliği</em></h1>
          <p className="ab-sub">Kişisel dergi deneyiminizi başlatmak için abone olun.</p>
        </div>

        {isActive && (
          <div className="ab-active-banner">
            <span className="ab-active-icon">✦</span>
            <div>
              <strong>Aktif Aboneliğiniz Var</strong>
              {bitisTarihi && <span> · Bitiş: {bitisTarihi}</span>}
            </div>
          </div>
        )}

        <div className="ab-card">
          <div className="ab-plan-badge">1 Yıllık Erişim</div>
          <h2 className="ab-plan-name">Kişisel Plan</h2>
          <p className="ab-plan-desc">Adres bilgilerinizi tamamlayarak kaydedin.</p>

          {error   && <div className="ab-error">{error}</div>}
          {success && <div className="ab-success">Adres bilgileriniz kaydedildi.</div>}

          <form onSubmit={handleSubmit} className="ab-form">
            <div className="ab-row">
              <div className="ab-field">
                <label>Ad</label>
                <input name="ad" value={form.ad} onChange={handle} placeholder="Adınız" required />
              </div>
              <div className="ab-field">
                <label>Soyad</label>
                <input name="soyad" value={form.soyad} onChange={handle} placeholder="Soyadınız" required />
              </div>
            </div>
            <div className="ab-row">
              <div className="ab-field">
                <label>İl</label>
                <input name="il" value={form.il} onChange={handle} placeholder="İstanbul" required />
              </div>
              <div className="ab-field">
                <label>İlçe</label>
                <input name="ilce" value={form.ilce} onChange={handle} placeholder="Kadıköy" required />
              </div>
            </div>
            <div className="ab-field">
              <label>Açık Adres</label>
              <textarea name="adres" value={form.adres} onChange={handle} placeholder="Mahalle, cadde, sokak, bina no…" rows={3} required />
            </div>
            <button type="submit" className="ab-submit" disabled={loading}>
              {loading ? 'Kaydediliyor…' : 'Adresi Kaydet'}
            </button>
          </form>

          <div className="ab-divider" />

          <div className="ab-seri-section">
            <h3 className="ab-seri-title">Seri Numarası ile Aktivasyon</h3>
            <p className="ab-seri-desc">Derginizdeki seri numarasını girerek aboneliğinizi ve kapak tasarım editörünü açın.</p>

            {seriError   && <div className="ab-error">{seriError}</div>}
            {seriSuccess && <div className="ab-success">Aboneliğiniz aktifleştirildi! Kapak tasarımına yönlendiriliyorsunuz…</div>}

            <form onSubmit={handleSeriDogrula} className="ab-seri-form">
              <div className="ab-seri-input-row">
                <input
                  type="text"
                  value={seriNo}
                  onChange={e => { setSeriNo(e.target.value); setSeriError(null) }}
                  placeholder="Seri numaranızı girin…"
                  className="ab-seri-input"
                  disabled={seriLoading || seriSuccess}
                />
                <button type="submit" className="ab-seri-btn" disabled={seriLoading || seriSuccess || !seriNo.trim()}>
                  {seriLoading ? 'Doğrulanıyor…' : 'Doğrula'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
