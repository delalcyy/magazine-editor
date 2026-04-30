import React, { useState, useRef, useEffect } from 'react'
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
  { 
    name: 'Elif K.', 
    title: 'İstanbul', 
    text: 'Eşime doğum günü için yaptım. Açtığında önce anlamadı, sonra gerçekten dergi sandı. İçindeki röportaj kısmını okuyunca baya duygulandı. Şu an salonda duruyor, gelen herkes soruyor nereden yaptırdınız diye.' 
  },
  { 
    name: 'Murat B.', 
    title: 'İstanbul',
    text: 'Mezuniyet için denemek istedim. Açıkçası bu kadar iyi beklemiyordum. Baskı kalitesi falan baya iyi, kapağı direkt dergi gibi. Arkadaşlarım görünce link istediler, 2-3 kişi daha yaptı.' 
  },
  { 
    name: 'Selin T.', 
    title: 'Ankara', 
    text: 'Annem için yaptırdım. Fotoğrafı kapağa koyunca çok şaşırdı. Röportaj kısmını yüksek sesle okuduk birlikte. Sonra çerçeveletip duvara astı. Gerçekten manevi değeri yüksek bir şey.' 
  },
  { 
    name: 'Ahmet Y.', 
    title: 'İzmir', 
    text: 'Sevgilim için yaptım. Normal hediye almak istemedim. Bu daha farklı geldi. Kapak tasarlamak da zor değildi. Sonuç baya profesyonel duruyor. Beklediğimden iyi çıktı açıkçası.' 
  },
  {
    name: 'Zeynep D.',
    title: 'Yeni Anne',
    text: 'Bebeğimiz doğduktan sonra yaptık. İleride hatıra olarak kalsın diye. Hem eğlenceliydi hem de ortaya çıkan şey çok güzel oldu. Albüm gibi ama daha özel hissettiriyor.'
  },
  {
    name: 'Ceren A.',
    title: 'Bursa',
    text: 'Babama sürpriz yaptım kariyer yıldönümü için. Kapağa iş hayatından bir fotoğrafını koydum, içine röportaj doldurdum. Gördüğünde "bu ne ya" dedi ama okumaya başlayınca sustı. Benim için en anlamlı hediyelerin biriydi.'
  }
]


const GALLERY = [kapakImg, ornekkapak1, ornekkapak4, ornekkapak5, ornekkapak6]

export default function HomePage() {
  const { user, hasAbonelik } = useAuth()
  const navigate = useNavigate()
  const [slideIdx, setSlideIdx] = useState(0)
  const sliderRef = useRef(null)

  function getSlideW() {
    const vp = sliderRef.current
    const slide = vp?.querySelector('.hp-slider-slide')
    return slide ? slide.offsetWidth + 16 : 0
  }

  function goTo(idx) {
    const vp = sliderRef.current
    if (!vp) return
    vp.scrollTo({ left: idx * getSlideW(), behavior: 'smooth' })
    setSlideIdx(idx)
  }

  useEffect(() => {
    const vp = sliderRef.current
    if (!vp) return
    function onScroll() {
      const w = getSlideW()
      if (w) setSlideIdx(Math.round(vp.scrollLeft / w))
    }
    vp.addEventListener('scroll', onScroll, { passive: true })
    return () => vp.removeEventListener('scroll', onScroll)
  }, [])

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
              fashiontv magazine kapağının yıldızı siz olun.
              Hikâyenizi yazın, röportajınızı oluşturun ve lüks bir lifestyle dergide yerinizi alın.              </p>
              <div className="hp-hero-btns">
                <button onClick={handleCTA} className="hp-btn-primary">
                  Hemen Başla <span className="hp-arr">→</span>
                </button>
                <Link to="/abonelik" className="hp-btn-ghost">Planları Gör</Link>
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
            <div className="hp-slider-wrap">
              <button className="hp-slider-arr hp-slider-arr--prev" onClick={() => goTo(Math.max(0, slideIdx - 1))} disabled={slideIdx === 0}>‹</button>
              <div className="hp-slider-viewport" ref={sliderRef}>
                <div className="hp-slider-track">
                  {GALLERY.map((img, i) => (
                    <div key={i} className="hp-slider-slide">
                      <img src={img} alt={`Kapak ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
              <button className="hp-slider-arr hp-slider-arr--next" onClick={() => goTo(Math.min(GALLERY.length - 1, slideIdx + 1))} disabled={slideIdx >= GALLERY.length - 1}>›</button>
              <div className="hp-slider-dots">
                {GALLERY.map((_, i) => (
                  <button key={i} className={`hp-slider-dot ${i === slideIdx ? 'hp-slider-dot--active' : ''}`} onClick={() => goTo(i)} />
                ))}
              </div>
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
                  Dünya Güzellik Yarışması Yapılıyor. Dünyanın En Güzel Kızı Seçiliyor. Peki Gerçekten En Güzel Olanın Haberi Var mı… Ya da İmkânı?
                </p>
                <p className="hp-about-text">
                  Bugüne kadar hep aynı hikâyeyi izledik; seçilenler, sahneye çıkanlar, alkışlananlar… Ama artık başka bir hikâye başlıyor. Çünkü biz biliyoruz ki gerçek potansiyel çoğu zaman keşfedilmez, gerçek hikâyeler çoğu zaman anlatılmaz ve gerçek güzellik çoğu zaman görünmez kalır. İşte tam bu noktada Hatıra Dergi devreye girer.
                </p>
                <p className="hp-about-text">
                  Biz bir yarışma değiliz, bir fırsat platformuyuz. Burada seçilmek zorunda değilsin, birilerinin seni fark etmesini beklemek zorunda değilsin. Sen kendini anlatırsın, biz seni görünür kılarız. Hatıra Dergi ile kendi kapağında yer alır, kendi hikâyeni dünyaya sunar ve kendi değerini kendi sözlerinle anlatırsın. Çünkü artık sahneye çıkmak için seçilmene gerek yok; artık görünür olmak için birilerinin onayına ihtiyacın yok.
                </p>
                <p className="hp-about-text">
                  Yeni dönem başlıyor. Seçilenlerin değil, kendini ortaya koyanların dönemi. Eğer anlatacak bir hikâyen varsa, zaten bir adım öndesin. Ve biz o hikâyeyi sadece saklamıyoruz, onu bir değere dönüştürüyoruz.
                </p>
                <p className="hp-about-text">
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
