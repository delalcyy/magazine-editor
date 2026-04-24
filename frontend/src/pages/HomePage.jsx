import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import kapakImg from '../assets/kapak.png'
import './HomePage.css'

const steps = [
  { n: '01', title: 'Kayıt Olun', desc: 'Adınızı, e-postanızı ve şifrenizi girerek ücretsiz hesap oluşturun.' },
  { n: '02', title: 'Abone Olun', desc: 'Adres bilgilerinizi tamamlayın ve Hatıra Dergi üyeliğinizi başlatın.' },
  { n: '03', title: 'Kapak Tasarlayın', desc: 'Kapağınızı Tasarlayın.Kategorinizi seçin, fotoğraflarınızı yükleyin ve röportaj sorularını doldurun.' },
  { n: '04', title: 'PDF\'inizi Alın', desc: 'Kişisel dergi sayfanız anında oluşturulur, indirmeye hazır.' },
]

const categories = ['Doğum Günü', 'Evlilik', 'Kariyer', 'Bebek', 'Mezuniyet']

const testimonials = [
  { name: 'Elif K.',    text: 'Eşime sürpriz olarak hazırladım. Gözleri doldu. Çok özel bir hediye oldu.' },
  { name: 'Murat B.',  text: 'Mezuniyetim için bir sayfa oluşturdum. Gerçek bir dergi gibi görünüyor!' },
  { name: 'Selin T.',  text: 'Annemin doğum günü için kullandım. Tüm aile hayran kaldı.' },
]

export default function HomePage() {
  const { user, hasAbonelik } = useAuth()
  const navigate = useNavigate()

  function handleCTA() {
    if (!user) { navigate('/kayit'); return }
    if (!hasAbonelik) { navigate('/abonelik'); return }
    navigate('/kapak')
  }

  return (
    <>
      <Header />
      <main className="hp">

        {/* ── Hero ── */}
        <section className="hp-hero">
          <div className="hp-hero-wrap">
            <div className="hp-hero-left">
              <div className="hp-kicker">
                <span className="hp-kicker-dot" />
                Herkes Kendi Dergisinin Kapağı Olabilir
              </div>
              <h1 className="hp-h1">
                Anılarınızı<br />
                <em>Dergi Sayfasına</em>
                <span className="hp-h1-rule" />
                Dönüştürün
              </h1>
              <p className="hp-lede">
                Özel anlarınızı, başarılarınızı ve kişisel hikâyelerinizi profesyonel bir dergi röportajı formatında ölümsüzleştirin.
              </p>
              <div className="hp-hero-btns">
                <button onClick={handleCTA} className="hp-btn-primary">
                  Hemen Başla <span className="hp-arr">→</span>
                </button>
                <Link to="/abonelik" className="hp-btn-ghost">Planları Gör</Link>
              </div>
              <div className="hp-hero-meta">
                <div className="hp-stat">
                  <span className="hp-stat-num">5<em>+</em></span>
                  <span className="hp-stat-lbl">Kategori</span>
                </div>
                <div className="hp-stat">
                  <span className="hp-stat-num">10<em>×</em></span>
                  <span className="hp-stat-lbl">Soru</span>
                </div>
                <div className="hp-stat">
                  <span className="hp-stat-num">PDF<em>.</em></span>
                  <span className="hp-stat-lbl">Çıktı</span>
                </div>
              </div>
            </div>

            <div className="hp-hero-right">
              <div className="hp-cover-stage">
                <img src={kapakImg} alt="Hatıra Dergi Kapak" className="hp-cover-img" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Marquee ── */}
        <div className="hp-marquee">
          <div className="hp-marquee-track">
            {[...Array(2)].map((_, gi) =>
              categories.map((c, i) => (
                <React.Fragment key={`${gi}-${i}`}>
                  <span>{c}</span>
                  <span className="hp-sep">✦</span>
                </React.Fragment>
              ))
            )}
          </div>
        </div>

        {/* ── Nasıl Çalışır ── */}
        <section className="hp-section">
          <div className="hp-section-wrap">
            <div className="hp-section-head">
              <div>
                <span className="hp-eyebrow">Nasıl Çalışır</span>
                <h2 className="hp-section-title">Dört Adımda <em>Kendi Derginiz</em></h2>
              </div>
              <p className="hp-section-lede">
              Kapak tasarla, röportajını oluştur ve birkaç dakika içinde kapak yıldızı ol.            </p>
            </div>
            <div className="hp-steps">
              {steps.map(s => (
                <div key={s.n} className="hp-step">
                  <span className="hp-step-n">{s.n}</span>
                  <h3 className="hp-step-title">{s.title}</h3>
                  <p className="hp-step-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Kategoriler ── */}
        <section className="hp-section hp-section-warm">
          <div className="hp-section-wrap">
            <div className="hp-section-head">
              <div>
                <span className="hp-eyebrow">Kategoriler</span>
                <h2 className="hp-section-title">Her Özel Ana <em>Özel Bir Sayfa</em></h2>
              </div>
            </div>
            <div className="hp-cats">
              {categories.map((c, i) => (
                <div key={i} className="hp-cat-card" onClick={handleCTA}>
                  <span className="hp-cat-num">{String(i+1).padStart(2,'0')}</span>
                  <span className="hp-cat-name">{c}</span>
                  <span className="hp-cat-arr">→</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Yorumlar ── */}
        <section className="hp-section">
          <div className="hp-section-wrap">
            <div className="hp-section-head">
              <div>
                <span className="hp-eyebrow">Yorumlar</span>
                <h2 className="hp-section-title">Kullanıcılarımız <em>Ne Diyor?</em></h2>
              </div>
            </div>
            <div className="hp-testimonials">
              {testimonials.map((t, i) => (
                <div key={i} className="hp-testimonial">
                  <p className="hp-testimonial-text">"{t.text}"</p>
                  <span className="hp-testimonial-name">— {t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="hp-cta">
          <div className="hp-section-wrap hp-cta-inner">
            <h2 className="hp-cta-title">Hikâyenizi Dünyayla <em>Paylaşın</em></h2>
            <p className="hp-cta-sub">Hemen kayıt olun, ilk sayfanızı oluşturun.</p>
            <button onClick={handleCTA} className="hp-btn-primary hp-btn-lg">
              Ücretsiz Başla <span className="hp-arr">→</span>
            </button>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="hp-footer">
          <div className="hp-section-wrap hp-footer-inner">
            <span className="hp-footer-logo">HATIRA DERGİ</span>
            <span className="hp-footer-copy">© 2026 Hatıra Dergi. Tüm hakları saklıdır.</span>
          </div>
        </footer>

      </main>
    </>
  )
}
