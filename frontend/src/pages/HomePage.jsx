import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import kapakImg from '../assets/kapak.png'
import ornekkapak1 from '../assets/ornekkapak1.jpeg'
import ornekkapak4 from '../assets/ornekkapak4.png'
import ornekkapak5 from '../assets/ornekkapak5.png'
import ornekkapak6 from '../assets/ornekkapak6.png'
import './HomePage.css'

const steps = [
  { n: '01', title: 'Kayıt Olun', desc: 'Adınızı, e-postanızı ve şifrenizi girerek ücretsiz hesap oluşturun.' },
  { n: '02', title: 'Abone Olun', desc: 'Adres bilgilerinizi tamamlayın ve Hatıra Dergi üyeliğinizi başlatın.' },
  { n: '03', title: 'Kapak Tasarlayın', desc: 'Kapağınızı Tasarlayın.Kategorinizi seçin, fotoğraflarınızı yükleyin ve röportaj sorularını doldurun.' },
  { n: '04', title: 'PDF\'inizi Alın', desc: 'Kişisel dergi sayfanız anında oluşturulur, indirmeye hazır.' },
]

const categories = ['Doğum Günü', 'Evlilik', 'Kariyer', 'Bebek', 'Mezuniyet']

const testimonials = [
  { name: 'Elif K.', title: 'Eş & Anne', text: 'Eşime sürpriz olarak hazırladım. Gözleri doldu. Yıllardır bu kadar özel bir hediye almamıştı. Tasarımı gerçekten bir dergiden ayırt edemiyorsunuz, inanılmaz kaliteli çıktı.' },
  { name: 'Murat B.', title: 'Mezun', text: 'Mezuniyetim için bir sayfa oluşturdum. Gerçek bir dergi gibi görünüyor! Ailem ve arkadaşlarım çok beğendi, hatta birkaç kişi daha sipariş vermek istedi. Kesinlikle tavsiye ederim.' },
  { name: 'Selin T.', title: 'Kız Evladı', text: 'Annemin doğum günü için kullandım. Tüm aile hayran kaldı. Annem o kadar mutlu oldu ki çerçevelettirip duvara astı. Bu kadar kişisel ve anlamlı bir hediye bulmak gerçekten zordu.' },
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
                Her Hikâye <br />
                <em>Bir Kapak Olmayı</em>
                <span className="hp-h1-rule" />
                Hak Eder
              </h1>
              <p className="hp-lede">
              FashionTV Magazine kapağının yıldızı siz olun.
              Hikâyenizi yazın, röportajınızı oluşturun ve lüks bir lifestyle dergide yerinizi alın.              </p>
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

        {/* ── Görseller ── */}
        <section className="hp-section">
          <div className="hp-section-wrap">
            <div className="hp-section-head">
              <div>
                <span className="hp-eyebrow">Galeri</span>
                <h2 className="hp-section-title">Anlarınızdan <em>Kareler</em></h2>
              </div>
            </div>
            <div className="hp-gallery">
              <div className="hp-gallery-box"><img src={ornekkapak1} alt="Örnek Kapak 1" /></div>
              <div className="hp-gallery-box"><img src={ornekkapak4} alt="Örnek Kapak 4" /></div>
              <div className="hp-gallery-box"><img src={ornekkapak5} alt="Örnek Kapak 5" /></div>
              <div className="hp-gallery-box"><img src={ornekkapak6} alt="Örnek Kapak 6" /></div>
            </div>
          </div>
        </section>

        {/* ── Hakkımızda ── */}
        <section className="hp-section hp-section-warm">
          <div className="hp-section-wrap">
            <div className="hp-about">
              <div className="hp-about-left">
                <span className="hp-eyebrow">Hakkımızda</span>
                <h2 className="hp-section-title">Biz <em>Kimiz?</em></h2>
              </div>
              <div className="hp-about-right">
                <p className="hp-about-text">
                  Dünya Güzellik Yarışması Yapılıyor. Dünyanın En Güzel Kızı Seçiliyor.<br /><br />
                  Peki Gerçekten En Güzel Olanın Haberi Var mı… Ya da İmkânı?<br /><br />
                  Bugüne kadar hep aynı hikâyeyi izledik.<br />
                  Seçilenler, sahneye çıkanlar, alkışlananlar…<br /><br />
                  Ama artık başka bir hikâye başlıyor.<br /><br />
                  Çünkü biz biliyoruz:<br />
                  Gerçek potansiyel, çoğu zaman keşfedilmez.<br />
                  Gerçek hikâyeler, çoğu zaman anlatılmaz.<br />
                  Gerçek güzellik, çoğu zaman görünmez kalır.<br /><br />
                  İşte tam bu noktada Hatıra Dergi devreye girer.<br /><br />
                  Biz bir yarışma değiliz.<br />
                  Biz bir fırsat platformuyuz.<br /><br />
                  Burada seçilmek zorunda değilsin.<br />
                  Burada birilerinin seni fark etmesini beklemek zorunda değilsin.<br /><br />
                  Sen kendini anlatırsın, biz seni görünür kılalım.<br /><br />
                  Hatıra Dergi ile:<br />
                  Kendi kapağında yer alırsın.<br />
                  Kendi hikâyeni dünyaya sunarsın.<br />
                  Kendi değerini, kendi sözlerinle anlatırsın.<br /><br />
                  Çünkü artık sahneye çıkmak için seçilmene gerek yok.<br />
                  Artık görünür olmak için birilerinin onayına ihtiyacın yok.<br /><br />
                  Yeni dönem başlıyor.<br />
                  Seçilenlerin değil, kendini ortaya koyanların dönemi.<br /><br />
                  Eğer anlatacak bir hikâyen varsa, zaten bir adım öndesin.<br /><br />
                  Ve biz o hikâyeyi sadece saklamıyoruz… onu bir değere dönüştürüyoruz.<br /><br />
                  <strong>Hatıra Dergi</strong> — görünmeyeni görünür yapan, hayali gerçeğe dönüştüren platform.
                </p>
              </div>
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
                <div key={i} className="hp-testimonial-card">
                  <div className="hp-testimonial-quote">"</div>
                  <p className="hp-testimonial-text">{t.text}</p>
                  <div className="hp-testimonial-footer">
                    <span className="hp-testimonial-name">{t.name}</span>
                    <span className="hp-testimonial-title">{t.title}</span>
                  </div>
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
