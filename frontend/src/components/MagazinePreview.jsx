import React, { useRef, useEffect, useState } from 'react'
import '../magazine.css'
import { QUESTIONS } from '../data/questions'

/* ─── Masaüstü yardımcılar ──────────────────────────────────── */
function DeskBlock({ num, question, answer }) {
  return (
    <div className="mp-block">
      <span className="mp-bn">{String(num).padStart(2,'0')}</span>
      <div className="mp-bc">
        <p className="mp-bq">{question}</p>
        {answer?.trim() ? <p className="mp-ba">{answer}</p> : <p className="mp-empty">Cevap girilmedi…</p>}
      </div>
    </div>
  )
}

function DeskImg({ src, label, wc, ic }) {
  return (
    <div className={wc}><div className={ic}>
      {src ? <img src={src} alt={label}/> :
        <div className="mp-ph"><span className="mp-ph-icon">□</span><span className="mp-ph-label">{label}</span></div>}
    </div></div>
  )
}

/* ─── Masaüstü içerik ───────────────────────────────────────── */
function DesktopContent({ category, title, subtitle, answers, images, questions }) {
  const [q1,q2,q3,q4,q5] = questions
  const dc   = q1 ? q1.text.charAt(0).toUpperCase() : ''
  const rest = q1 ? q1.text.slice(1) : ''
  return (
    <>
      <div className="mp-masthead">
        <span className="mp-cat">{category||'Röportaj'}</span>
        <h1 className="mp-title">{title||'Başlığı Sol Panelden Girin'}</h1>
        {subtitle && <p className="mp-sub">{subtitle}</p>}
      </div>
      <div className="mp-divider"/>
      {!category && <p className="mp-hint">Sol panelden bir kategori seçin.</p>}
      {q1 && (
        <div className="mp-q1-wrap">
          <span className="mp-q1-num">01</span>
          <span className="mp-dropcap">{dc}</span>
          <p className="mp-q1-text">{rest}</p>
          {answers[q1.id]?.trim() ? <p className="mp-a1">{answers[q1.id]}</p> : <p className="mp-empty">Cevap girilmedi…</p>}
        </div>
      )}
      {(q2||q3) && (
        <div className="mp-sec-a">
          <div className="mp-sec-a-qs">
            {q2 && <DeskBlock num={2} question={q2.text} answer={answers[q2.id]??''}/>}
            {q3 && <DeskBlock num={3} question={q3.text} answer={answers[q3.id]??''}/>}
          </div>
          <DeskImg src={images.inset1} label="Görsel 1" wc="mp-img-r" ic="mp-img-r-in"/>
        </div>
      )}
      {(q4||q5) && (
        <div className="mp-sec-b">
          <DeskImg src={images.inset2} label="Görsel 2" wc="mp-img-l" ic="mp-img-l-in"/>
          <div className="mp-sec-b-qs">
            {q4 && <DeskBlock num={4} question={q4.text} answer={answers[q4.id]??''}/>}
            {q5 && <DeskBlock num={5} question={q5.text} answer={answers[q5.id]??''}/>}
          </div>
        </div>
      )}
    </>
  )
}

/* ─── Mobil içerik — tamamen ayrı markup + class ───────────── */
function MobImg({ src, label }) {
  return (
    <div className="mob-img">
      {src ? <img src={src} alt={label}/> :
        <div className="mob-img-ph"><span>□</span><span className="mob-img-lbl">{label}</span></div>}
    </div>
  )
}

function MobBlock({ num, q, a }) {
  return (
    <div className="mob-block">
      <span className="mob-num">{String(num).padStart(2,'0')}</span>
      <p className="mob-q">{q}</p>
      {a?.trim() ? <p className="mob-a">{a}</p> : <p className="mob-empty">Cevap girilmedi…</p>}
    </div>
  )
}

function MobileContent({ category, title, subtitle, answers, images, questions }) {
  const [q1,q2,q3,q4,q5] = questions
  const dc   = q1 ? q1.text.charAt(0).toUpperCase() : ''
  const rest = q1 ? q1.text.slice(1) : ''
  return (
    <div className="mob-wrap">
      {/* Başlık */}
      <div className="mob-head">
        <span className="mob-cat">{category||'Röportaj'}</span>
        <h1 className="mob-title">{title||'Başlığı Sol Panelden Girin'}</h1>
        {subtitle && <p className="mob-sub">{subtitle}</p>}
      </div>
      <div className="mob-rule"/>
      {!category && <p className="mob-hint">Sol panelden bir kategori seçin.</p>}

      {/* 1. Soru drop cap */}
      {q1 && (
        <div className="mob-q1">
          <span className="mob-num">01</span>
          <div className="mob-q1-body">
            <span className="mob-dc">{dc}</span>
            <p className="mob-q1-text">{rest}</p>
          </div>
          {answers[q1.id]?.trim()
            ? <p className="mob-a">{answers[q1.id]}</p>
            : <p className="mob-empty">Cevap girilmedi…</p>}
        </div>
      )}

      {/* 2. Soru */}
      {q2 && <MobBlock num={2} q={q2.text} a={answers[q2.id]??''}/>}

      {/* Görsel 1 */}
      <MobImg src={images.inset1} label="Görsel 1"/>

      {/* 3. Soru */}
      {q3 && <MobBlock num={3} q={q3.text} a={answers[q3.id]??''}/>}

      {/* 4. Soru */}
      {q4 && <MobBlock num={4} q={q4.text} a={answers[q4.id]??''}/>}

      {/* Görsel 2 */}
      <MobImg src={images.inset2} label="Görsel 2"/>

      {/* 5. Soru */}
      {q5 && <MobBlock num={5} q={q5.text} a={answers[q5.id]??''}/>}

      {/* Footer */}
      <div className="mob-footer">
        <div className="mob-footer-rule"/>
        <div className="mob-footer-row">
          <span className="mob-footer-l">Röportaj Stüdyosu</span>
          <span className="mob-footer-r">01</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Ana bileşen ────────────────────────────────────────────── */
export default function MagazinePreview({ data }) {
  const {
    category='', title='', subtitle='',
    answers={}, images={ cover:null, inset1:null, inset2:null },
  } = data ?? {}

  const questions = (category && QUESTIONS[category]) ? QUESTIONS[category] : []
  const wrapperRef  = useRef(null)
  const [scale, setScale]     = useState(1)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    function calc() {
      if (!wrapperRef.current) return
      const w = wrapperRef.current.offsetWidth
      setIsMobile(w < 768)
      if (w >= 768) setScale(Math.min(1, w / 794))
    }
    calc()
    const ro = new ResizeObserver(calc)
    if (wrapperRef.current) ro.observe(wrapperRef.current)
    return () => ro.disconnect()
  }, [])

  /* MOBİL — scale yok, sıfırdan responsive */
  if (isMobile) {
    return (
      <div ref={wrapperRef} style={{width:'100%',overflowX:'hidden'}}>
        <MobileContent category={category} title={title} subtitle={subtitle}
          answers={answers} images={images} questions={questions}/>
      </div>
    )
  }

  /* MASAÜSTÜ — A4 scale */
  return (
    <div ref={wrapperRef} style={{
      width:`${794*scale}px`, height:`${1123*scale}px`,
      overflow:'hidden', marginLeft:'auto', marginRight:'auto', display:'block',
    }}>
      <div className="mp-scaler" style={{'--mp-scale':scale}}>
        <div className="mp-root">
          <div className="mp-inner">
            <DesktopContent category={category} title={title} subtitle={subtitle}
              answers={answers} images={images} questions={questions}/>
          </div>
          <div className="mp-footer">
            <div className="mp-footer-rule"/>
            <div className="mp-footer-row">
              <span className="mp-footer-l">Röportaj Stüdyosu</span>
              <span className="mp-footer-m">{category||'Dergi'}</span>
              <span className="mp-footer-r">01</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
