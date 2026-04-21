import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import './AdminPage.css'

export default function AdminPage() {
  const { getToken } = useAuth()
  const [tab, setTab]     = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [kodlar, setKodlar] = useState([])
  const [siparisler, setSiparisler] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg]     = useState(null)

  const auth = { headers: { Authorization: `Bearer ${getToken()}` } }

  useEffect(() => { loadDashboard() }, [])
  useEffect(() => {
    if (tab === 'users')     loadUsers()
    if (tab === 'kodlar')    loadKodlar()
    if (tab === 'siparisler') loadSiparisler()
  }, [tab])

  async function loadDashboard() {
    const r = await fetch('/api/admin/dashboard', auth)
    const d = await r.json()
    if (d.success) setStats(d.stats)
  }

  async function loadUsers() {
    const r = await fetch('/api/admin/users', auth)
    const d = await r.json()
    if (d.success) setUsers(d.users)
  }

  async function loadKodlar() {
    const r = await fetch('/api/admin/kodlar', auth)
    const d = await r.json()
    if (d.success) setKodlar(d.kodlar)
  }

  async function loadSiparisler() {
    const r = await fetch('/api/admin/orders', auth)
    const d = await r.json()
    if (d.success) setSiparisler(d.orders)
  }

  async function handleGenerateKodlar() {
    setLoading(true); setMsg(null)
    const r = await fetch('/api/admin/kodlar/uret', { method: 'POST', ...auth })
    const d = await r.json()
    setMsg(d.success ? `✓ ${d.count} kod üretildi.` : `✗ ${d.error?.message}`)
    setLoading(false)
    if (d.success && tab === 'kodlar') loadKodlar()
  }

  return (
    <>
      <Header />
      <div className="adm-page">
        <div className="adm-sidebar">
          <div className="adm-logo">Admin Panel</div>
          {[
            { key: 'dashboard',   label: 'Dashboard' },
            { key: 'kodlar',      label: 'Kodlar' },
            { key: 'users',       label: 'Kullanıcılar' },
            { key: 'siparisler',  label: 'Siparişler' },
          ].map(item => (
            <button key={item.key}
              className={`adm-nav-btn ${tab===item.key?'active':''}`}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="adm-content">

          {/* ── Dashboard ── */}
          {tab === 'dashboard' && (
            <div>
              <h2 className="adm-section-title">Dashboard</h2>
              {stats ? (
                <div className="adm-stats">
                  <StatCard label="Toplam Kullanıcı"  value={stats.toplamKullanici} />
                  <StatCard label="Aktif Abonelik"    value={stats.aktifAbonelik}   color="green" />
                  <StatCard label="Toplam Sipariş"    value={stats.toplamSiparis}   />
                  <StatCard label="Kullanılan Kod"    value={stats.kullanilanKod}   />
                  <StatCard label="Bekleyen Kod"      value={stats.bekleyenKod}     color="gold" />
                </div>
              ) : <p className="adm-loading">Yükleniyor…</p>}
            </div>
          )}

          {/* ── Kodlar ── */}
          {tab === 'kodlar' && (
            <div>
              <div className="adm-section-head">
                <h2 className="adm-section-title">Benzersiz Kodlar</h2>
                <button className="adm-primary-btn" onClick={handleGenerateKodlar} disabled={loading}>
                  {loading ? 'Üretiliyor…' : '100 Kod Üret'}
                </button>
              </div>
              {msg && <div className={`adm-msg ${msg.startsWith('✓')?'adm-msg-ok':'adm-msg-err'}`}>{msg}</div>}
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr><th>Kod</th><th>Durum</th><th>Kullanıcı</th><th>Tarih</th></tr>
                  </thead>
                  <tbody>
                    {kodlar.map(k => (
                      <tr key={k.id}>
                        <td><code className="adm-code">{k.kod}</code></td>
                        <td><span className={`adm-badge ${k.kullanildi?'adm-badge-used':'adm-badge-free'}`}>{k.kullanildi?'Kullanıldı':'Bekliyor'}</span></td>
                        <td>{k.email || '—'}</td>
                        <td>{new Date(k.olusturulma).toLocaleDateString('tr-TR')}</td>
                      </tr>
                    ))}
                    {!kodlar.length && <tr><td colSpan={4} className="adm-empty">Henüz kod yok.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Kullanıcılar ── */}
          {tab === 'users' && (
            <div>
              <h2 className="adm-section-title">Kullanıcılar ({users.length})</h2>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr><th>Ad Soyad</th><th>E-posta</th><th>Telefon</th><th>Rol</th><th>Abonelik</th><th>Bitiş</th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.ad} {u.soyad}</td>
                        <td>{u.email}</td>
                        <td>{u.telefon || '—'}</td>
                        <td><span className={`adm-badge ${u.role==='admin'?'adm-badge-admin':'adm-badge-free'}`}>{u.role}</span></td>
                        <td><span className={`adm-badge ${u.aktif?'adm-badge-ok':'adm-badge-used'}`}>{u.aktif?'Aktif':'Yok'}</span></td>
                        <td>{u.bitis_tarihi ? new Date(u.bitis_tarihi).toLocaleDateString('tr-TR') : '—'}</td>
                      </tr>
                    ))}
                    {!users.length && <tr><td colSpan={6} className="adm-empty">Kullanıcı yok.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Siparişler ── */}
          {tab === 'siparisler' && (
            <div>
              <h2 className="adm-section-title">Siparişler ({siparisler.length})</h2>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Kullanıcı</th>
                      <th>E-posta</th>
                      <th>Kategori</th>
                      <th>Kapak PDF</th>
                      <th>Editör PDF</th>
                      <th>Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siparisler.map(s => (
                      <tr key={s.order_id}>
                        <td>{s.ad || '—'} {s.soyad || ''}</td>
                        <td>{s.email || '—'}</td>
                        <td>{s.kategori}</td>
                        <td>
                          {s.kapak_pdf
                            ? <a href={`/pdfs/${s.kapak_pdf}`} target="_blank" rel="noopener noreferrer" className="adm-link">İndir</a>
                            : '—'}
                        </td>
                        <td>
                          {s.pdf_dosya
                            ? <a href={`/pdfs/${s.pdf_dosya}`} target="_blank" rel="noopener noreferrer" className="adm-link">İndir</a>
                            : '—'}
                        </td>
                        <td>{new Date(s.created_at).toLocaleDateString('tr-TR')}</td>
                      </tr>
                    ))}
                    {!siparisler.length && <tr><td colSpan={6} className="adm-empty">Sipariş yok.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

function StatCard({ label, value, color }) {
  const colors = { green: '#155724', gold: '#8a6d2c' }
  return (
    <div className="adm-stat-card">
      <span className="adm-stat-val" style={{ color: colors[color] || '#0a0a0a' }}>{value}</span>
      <span className="adm-stat-lbl">{label}</span>
    </div>
  )
}
