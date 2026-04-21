import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import './UserPanelPage.css'

export default function UserPanelPage() {
  const { user, getToken } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab]       = useState('profil')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tab === 'siparisler') loadOrders()
  }, [tab])

  async function loadOrders() {
    setLoading(true)
    try {
      const r = await fetch('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const d = await r.json()
      if (d.success) setOrders(d.orders)
    } catch {}
    setLoading(false)
  }

  function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('tr-TR', {
      day: '2-digit', month: 'long', year: 'numeric',
    })
  }

  const abonelikAktif = !!user?.aktif

  return (
    <>
      <Header />
      <div className="up-page">

        {/* ── Sidebar ── */}
        <aside className="up-sidebar">
          <div className="up-sidebar-top">
            <div className="up-avatar">
              {(user?.ad?.[0] || '?').toUpperCase()}
            </div>
            <div className="up-user-name">{user?.ad} {user?.soyad}</div>
            <div className="up-user-email">{user?.email}</div>
          </div>

          <nav className="up-nav">
            {[
              { key: 'profil',     label: 'Profil Bilgilerim' },
              { key: 'abonelik',   label: 'Abonelik' },
              { key: 'siparisler', label: 'Siparişlerim' },
            ].map(item => (
              <button
                key={item.key}
                className={`up-nav-btn ${tab === item.key ? 'active' : ''}`}
                onClick={() => setTab(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="up-sidebar-bottom">
            <button className="up-quick-btn" onClick={() => navigate('/kapak')}>
              Kapak Tasarla →
            </button>
            <button className="up-quick-btn" onClick={() => navigate('/editor')}>
              Dergi Editörü →
            </button>
          </div>
        </aside>

        {/* ── İçerik ── */}
        <main className="up-content">

          {/* Profil */}
          {tab === 'profil' && (
            <div className="up-section">
              <h2 className="up-section-title">Profil Bilgilerim</h2>
              <div className="up-card">
                <div className="up-info-grid">
                  <InfoRow label="Ad"      value={user?.ad} />
                  <InfoRow label="Soyad"   value={user?.soyad} />
                  <InfoRow label="E-posta" value={user?.email} />
                  <InfoRow label="Telefon" value={user?.telefon || '—'} />
                </div>
              </div>

              {user?.il && (
                <>
                  <h3 className="up-sub-title" style={{ marginTop: 28 }}>Adres Bilgileri</h3>
                  <div className="up-card">
                    <div className="up-info-grid">
                      <InfoRow label="İl"    value={user.il} />
                      <InfoRow label="İlçe"  value={user.ilce} />
                      <InfoRow label="Adres" value={user.adres} />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Abonelik */}
          {tab === 'abonelik' && (
            <div className="up-section">
              <h2 className="up-section-title">Abonelik Durumu</h2>
              <div className={`up-card up-abonelik-card ${abonelikAktif ? 'aktif' : 'pasif'}`}>
                <div className="up-abonelik-badge">
                  {abonelikAktif ? '✓ Aktif' : '✗ Pasif'}
                </div>
                {abonelikAktif ? (
                  <div className="up-abonelik-info">
                    <p>Aboneliğiniz aktif. Tüm özelliklere erişebilirsiniz.</p>
                    {user?.bitis_tarihi && (
                      <p className="up-abonelik-date">
                        Bitiş tarihi: <strong>{formatDate(user.bitis_tarihi)}</strong>
                      </p>
                    )}
                    {user?.baslangic_tarihi && (
                      <p className="up-abonelik-date">
                        Başlangıç: <strong>{formatDate(user.baslangic_tarihi)}</strong>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="up-abonelik-info">
                    <p>Henüz aktif aboneliğiniz yok.</p>
                    <button className="up-cta-btn" onClick={() => navigate('/abonelik')}>
                      Abone Ol
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Siparişler */}
          {tab === 'siparisler' && (
            <div className="up-section">
              <h2 className="up-section-title">Siparişlerim</h2>
              {loading ? (
                <p className="up-loading">Yükleniyor…</p>
              ) : orders.length === 0 ? (
                <div className="up-empty">
                  <span className="up-empty-icon">✦</span>
                  <p>Henüz siparişiniz bulunmuyor.</p>
                  <button className="up-cta-btn" onClick={() => navigate('/editor')}>
                    İlk Siparişi Ver
                  </button>
                </div>
              ) : (
                <div className="up-orders-list">
                  {orders.map(order => (
                    <div key={order.order_id} className="up-order-card">
                      <div className="up-order-top">
                        <span className="up-order-cat">{order.kategori}</span>
                        <span className="up-order-date">{formatDate(order.created_at)}</span>
                      </div>
                      <div className="up-order-title">{order.baslik || order.kategori}</div>
                      <div className="up-order-pdfs">
                        <span className="up-pdf-status">✓ PDF hazırlandı, sizinle paylaşılacak.</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="up-info-row">
      <span className="up-info-label">{label}</span>
      <span className="up-info-value">{value || '—'}</span>
    </div>
  )
}
