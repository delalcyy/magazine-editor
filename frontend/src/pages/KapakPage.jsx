import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import OrderForm from '../components/OrderForm'
import logoImg from '../assets/logo1.png'
import { buildEmptyAnswers } from '../data/questions'
import './KapakPage.css'
import './EditorPage.css'

const BG_FILTERS = [
  { label: 'Normal', value: 'none',                                      preview: 'linear-gradient(135deg,#888,#444)' },
  { label: 'Siyah',  value: 'grayscale(100%) brightness(30%)',            preview: '#111' },
  { label: 'Beyaz',  value: 'grayscale(100%) brightness(190%)',           preview: '#eee' },
  { label: 'Gri',    value: 'grayscale(100%)',                            preview: '#888' },
  { label: 'Altın',  value: 'sepia(90%) saturate(130%) brightness(95%)', preview: '#a98947' },
]

const BG_COLORS = [
  { label: 'Siyah',    value: '#111111', dark: false },
  { label: 'Antrasit', value: '#2c2c2c', dark: false },
  { label: 'Gri',      value: '#6b6b6b', dark: false },
  { label: 'Krem',     value: '#e8e0d0', dark: true  },
  { label: 'Beyaz',    value: '#f5f5f0', dark: true  },
  { label: 'Altın',    value: '#a98947', dark: false },
]

const LOGO_COLORS = [
  { label: 'Orijinal', filter: 'none',                                                             preview: '#e8e8e8', dark: true  },
  { label: 'Siyah',    filter: 'saturate(0) brightness(0.8) contrast(1.21)',                      preview: '#111111', dark: false },
  { label: 'Altın',    filter: 'sepia(1) saturate(4) hue-rotate(8deg)',                           preview: '#c9a050', dark: false },
  { label: 'Gümüş',    filter: 'brightness(0.65) saturate(0)',                                    preview: '#888888', dark: false },
  { label: 'Açık Mavi', filter: 'sepia(1) saturate(5) hue-rotate(195deg) brightness(1.1)',         preview: '#5aaee8', dark: false },
  { label: 'Pembe',    filter: 'sepia(1) saturate(5) hue-rotate(295deg) brightness(0.9)',         preview: '#e060a8', dark: false },
]


const FONTS = [
  { label: 'Inter',             value: 'Inter, system-ui, sans-serif' },
  { label: 'Playfair Display',  value: "'Playfair Display', Georgia, serif" },
  { label: 'Oswald',            value: "'Oswald', sans-serif" },
  { label: 'Montserrat',        value: "'Montserrat', sans-serif" },
  { label: 'Raleway',           value: "'Raleway', sans-serif" },
  { label: 'Roboto Condensed',  value: "'Roboto Condensed', sans-serif" },
  { label: 'EB Garamond',       value: "'EB Garamond', Georgia, serif" },
]

const BARCODE = (
  <svg viewBox="0 0 60 22" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#111">
      {[
        [1,1.2],[3.5,0.6],[5,1.8],[8,0.6],[9.5,1.2],[12,0.6],[13.5,2],
        [17,0.6],[18.5,1.2],[21,0.8],[23,1.6],[26,0.6],[27.5,1.2],[30,0.8],
        [32,1.4],[34.5,0.6],[36,1.2],[38.5,0.6],[40,1.8],[43,0.6],[44.5,1.2],
        [47,0.8],[49,1.6],[52,0.6],[53.5,1.2],[56,0.6],[57.5,1.4],
      ].map(([x, w], i) => (
        <rect key={i} x={x} y="1" width={w} height="20" />
      ))}
    </g>
  </svg>
)

function buildInitialEditor(user) {
  return {
    ad:       user?.ad    || '',
    soyad:    user?.soyad || '',
    category: '',
    title:    '',
    answers:  {},
    images:   { inset1: null, inset2: null },
  }
}

export default function KapakPage() {
  const { user, hasAbonelik, getToken } = useAuth()
  const navigate = useNavigate()

  /* ── Adım ── */
  const [step, setStep] = useState(1)   // 1 = kapak, 2 = editör

  /* ── Kapak state ── */
  const [bgColor, setBgColor]         = useState('#111111')
  const [photo, setPhoto]             = useState(null)
  const [photoBase64, setPhotoBase64] = useState(null)
  const [fgPhoto, setFgPhoto]         = useState(null)
  const [bgZoom, setBgZoom]           = useState(1)
  const [bgRotate, setBgRotate]       = useState(0)
  const [bgMirror, setBgMirror]       = useState(false)
  const [bgOffsetX, setBgOffsetX]     = useState(0)
  const [bgOffsetY, setBgOffsetY]     = useState(0)
  const [fgZoom, setFgZoom]           = useState(1)
  const [fgRotate, setFgRotate]       = useState(0)
  const [fgMirror, setFgMirror]       = useState(false)
  const [fgOffsetX, setFgOffsetX]     = useState(0)
  const [fgOffsetY, setFgOffsetY]     = useState(0)
  const [dragTarget, setDragTarget]   = useState('bg')
  const [logoFilter, setLogoFilter]   = useState('none')

  /* ── Yan yazı state ── */
  const [headColor, setHeadColor] = useState('#ffffff')
  const [leftText,  setLeftText]  = useState("MODANIN KALBİ\nTÜRKİYE'DE ATACAK")
  const [rightText, setRightText] = useState("ÖZEL RÖPORTAJLAR\nGÜÇLÜ İSİMLER\nYENİ SEZON")
  const [leftColor,  setLeftColor]  = useState('#ffffff')
  const [rightColor, setRightColor] = useState('#ffffff')
  const [leftSize,  setLeftSize]  = useState(1.9)
  const [rightSize, setRightSize] = useState(1.9)
  const [leftFont,  setLeftFont]  = useState('Inter')
  const [rightFont, setRightFont] = useState('Inter')
  const [leftPos,  setLeftPos]  = useState({ x: 1, y: 55 })
  const [rightPos, setRightPos] = useState({ x: 59, y: 32 })

  const [left2Text,  setLeft2Text]  = useState("YENİ KOLEKSİYON")
  const [right2Text, setRight2Text] = useState("TREND RAPORU")
  const [left2Color,  setLeft2Color]  = useState('#ffffff')
  const [right2Color, setRight2Color] = useState('#ffffff')
  const [left2Size,  setLeft2Size]  = useState(1.9)
  const [right2Size, setRight2Size] = useState(1.9)
  const [left2Font,  setLeft2Font]  = useState('Inter')
  const [right2Font, setRight2Font] = useState('Inter')
  const [left2Pos,  setLeft2Pos]  = useState({ x: 1, y: 70 })
  const [right2Pos, setRight2Pos] = useState({ x: 59, y: 48 })

  const fgRef = useRef(null)
  const leftDragRef   = useRef(null)
  const rightDragRef  = useRef(null)
  const left2DragRef  = useRef(null)
  const right2DragRef = useRef(null)
  const [head,  setHead]              = useState('')
  const [sub,   setSub]               = useState('')
  const [exporting, setExporting]     = useState(false)
  const [saving,    setSaving]        = useState(false)
  const [savedPdf,  setSavedPdf]      = useState(null)
  const [toast, setToast]             = useState(null)
  const [dragOver, setDragOver]       = useState(false)

  const coverRef   = useRef(null)
  const fileRef    = useRef(null)
  const toastTimer = useRef(null)

  /* ── Editör state ── */
  const [formData, setFormData]     = useState(() => buildInitialEditor(user))
  const [isLoading, setIsLoading]   = useState(false)
  const [isSuccess, setIsSuccess]   = useState(false)
  const [pdfFileName, setPdfFileName]           = useState(null)
  const [kapakPdfFileName, setKapakPdfFileName] = useState(null)
  const [editorError, setEditorError]           = useState(null)

  const kapakData = (() => {
    try { return JSON.parse(localStorage.getItem('kapakData') || 'null') } catch { return null }
  })()

  /* ── Toast ── */
  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }

  /* ── Kapak: fotoğraf ── */
  function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) { showToast('Sadece görsel dosyaları'); return }
    if (file.size > 20 * 1024 * 1024)   { showToast("Dosya 20 MB'den büyük");   return }
    if (photo) URL.revokeObjectURL(photo)
    setBgZoom(1); setBgRotate(0); setBgMirror(false); setBgOffsetX(0); setBgOffsetY(0)
    setPhoto(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onload = () => setPhotoBase64(reader.result)
    reader.readAsDataURL(file)
    showToast('Fotoğraf yüklendi')
  }
  function onFileChange(e) { handleFile(e.target.files?.[0]) }
  function onDrop(e) {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  /* ── Ön plan fotoğrafı ── */
  function onFgChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (fgPhoto) URL.revokeObjectURL(fgPhoto)
    setFgZoom(1); setFgRotate(0); setFgMirror(false); setFgOffsetX(0); setFgOffsetY(0)
    setFgPhoto(URL.createObjectURL(file))
    setDragTarget('fg')
  }

  /* ── Kapak: sıfırla ── */
  function handleReset() {
    if (photo) URL.revokeObjectURL(photo)
    if (fgPhoto) URL.revokeObjectURL(fgPhoto)
    setBgColor('#111111')
    setPhoto(null); setPhotoBase64(null); setFgPhoto(null); setHead(''); setSub(''); setSavedPdf(null)
    setBgZoom(1); setBgRotate(0); setBgMirror(false); setBgOffsetX(0); setBgOffsetY(0)
    setFgZoom(1); setFgRotate(0); setFgMirror(false); setFgOffsetX(0); setFgOffsetY(0); setDragTarget('bg')
    setLogoFilter('none')
    setLeftPos({ x: 1, y: 55 }); setRightPos({ x: 59, y: 32 })
    setLeftSize(1.9); setRightSize(1.9)
    setLeftFont('Inter'); setRightFont('Inter')
    setHeadColor('#ffffff'); setLeftColor('#ffffff'); setRightColor('#ffffff')
    setLeftText("MODANIN KALBİ\nTÜRKİYE'DE ATACAK")
    setRightText("ÖZEL RÖPORTAJLAR\nGÜÇLÜ İSİMLER\nYENİ SEZON")
    showToast('Editör sıfırlandı')
  }

  /* ── Satır başına max 3 kelime, toplam max 4 satır ── */
  function enforceWordLimit(text) {
    const processed = text.split('\n').map(line => {
      const trailingSpace = line.endsWith(' ')
      const words = line.trim().split(/\s+/).filter(w => w)
      if (!words.length) return ''
      const chunks = []
      for (let i = 0; i < words.length; i += 3) chunks.push(words.slice(i, i + 3).join(' '))
      let result = chunks.join('\n')
      if (trailingSpace) {
        const lastWords = chunks[chunks.length - 1].split(' ').length
        result += lastWords < 3 ? ' ' : '\n'
      }
      return result
    }).join('\n')
    return processed.split('\n').slice(0, 4).join('\n')
  }

  /* ── Yazı sürükleme (textarea için) ── */
  function startTextDrag(e, side) {
    e.stopPropagation() // bg drag'i engelle; preventDefault YOK ki focus çalışsın
    const posMap    = { left: leftPos, right: rightPos, left2: left2Pos, right2: right2Pos }
    const setMap    = { left: setLeftPos, right: setRightPos, left2: setLeft2Pos, right2: setRight2Pos }
    const refMap    = { left: leftDragRef, right: rightDragRef, left2: left2DragRef, right2: right2DragRef }
    const pos = posMap[side]
    const startX = e.touches ? e.touches[0].clientX : e.clientX
    const startY = e.touches ? e.touches[0].clientY : e.clientY
    const startPosX = pos.x; const startPosY = pos.y
    let dragging = false

    function move(ev) {
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX
      const cy = ev.touches ? ev.touches[0].clientY : ev.clientY
      if (!dragging && (Math.abs(cx - startX) > 8 || Math.abs(cy - startY) > 8)) {
        dragging = true
        refMap[side].current?.blur()
        window.getSelection()?.removeAllRanges()
      }
      if (!dragging) return
      if (ev.cancelable) ev.preventDefault()
      if (!coverRef.current) return
      const rect = coverRef.current.getBoundingClientRect()
      const textEl = refMap[side].current
      const textH = textEl ? (textEl.getBoundingClientRect().height / rect.height) * 100 : 0
      const textW = textEl ? (textEl.getBoundingClientRect().width  / rect.width)  * 100 : 0
      const nx = Math.max(0, Math.min(100 - textW, startPosX + ((cx - startX) / rect.width) * 100))
      const ny = Math.max(22, Math.min(82 - textH, startPosY + ((cy - startY) / rect.height) * 100))
      setMap[side]({ x: nx, y: ny })
    }
    function up() {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
      document.removeEventListener('touchmove', move)
      document.removeEventListener('touchend', up)
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
    document.addEventListener('touchmove', move, { passive: false })
    document.addEventListener('touchend', up)
  }

  /* ── Arka plan sürükleme ── */
  function startBgDrag(e) {
    if (!photo) return
    e.preventDefault(); e.stopPropagation()
    const startX = e.touches ? e.touches[0].clientX : e.clientX
    const startY = e.touches ? e.touches[0].clientY : e.clientY
    const startOX = bgOffsetX
    const startOY = bgOffsetY
    function move(ev) {
      if (ev.cancelable) ev.preventDefault()
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX
      const cy = ev.touches ? ev.touches[0].clientY : ev.clientY
      setBgOffsetX(startOX + (cx - startX))
      setBgOffsetY(startOY + (cy - startY))
    }
    function up() {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
      document.removeEventListener('touchmove', move)
      document.removeEventListener('touchend', up)
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
    document.addEventListener('touchmove', move, { passive: false })
    document.addEventListener('touchend', up)
  }

  /* ── Ön plan sürükleme ── */
  function startFgDrag(e) {
    if (!fgPhoto) return
    e.preventDefault(); e.stopPropagation()
    const startX = e.touches ? e.touches[0].clientX : e.clientX
    const startY = e.touches ? e.touches[0].clientY : e.clientY
    const startOX = fgOffsetX
    const startOY = fgOffsetY
    function move(ev) {
      if (ev.cancelable) ev.preventDefault()
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX
      const cy = ev.touches ? ev.touches[0].clientY : ev.clientY
      setFgOffsetX(startOX + (cx - startX))
      setFgOffsetY(startOY + (cy - startY))
    }
    function up() {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
      document.removeEventListener('touchmove', move)
      document.removeEventListener('touchend', up)
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
    document.addEventListener('touchmove', move, { passive: false })
    document.addEventListener('touchend', up)
  }

  /* ── Kapak: PNG indir ── */
  async function handleExport() {
    if (exporting) return
    setExporting(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(coverRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        onclone: (_doc, el) => {
          el.querySelectorAll('textarea.kp-cov-text-ta').forEach(ta => {
            const div = _doc.createElement('div')
            div.style.cssText = ta.getAttribute('style') || ''
            div.style.overflow = 'hidden'
            div.style.whiteSpace = 'pre-wrap'
            div.style.wordBreak = 'break-word'
            div.style.background = 'transparent'
            div.style.border = 'none'
            div.style.outline = 'none'
            div.style.padding = '0'
            div.className = ta.className
            div.textContent = ta.value
            ta.parentNode.replaceChild(div, ta)
          })
        },
      })
      const link = document.createElement('a')
      link.download = `hatira-dergi-kapak-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      showToast('Kapak indirildi')
    } catch {
      showToast('Dışa aktarma başarısız')
    } finally {
      setExporting(false)
    }
  }

  /* ── Kapak kaydet → editöre geç ── */
  async function handleSaveAndContinue() {
    if (saving) return
    setSaving(true)
    try {
      const token = getToken()
      const body = {
        head: head.trim() || (user?.ad ? `${user.ad} ${user.soyad || ''}`.trim() : ''),
        sub:  sub.trim(),
        imageBase64: photoBase64 || null,
      }
      const res = await fetch('/api/kapak/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('kapakPdf', data.kapakPdf)
        localStorage.setItem('kapakData', JSON.stringify(body))
        setSavedPdf(data.kapakPdf)
        showToast('Kapak kaydedildi! Röportaj formuna geçiliyor…')
        setTimeout(() => setStep(2), 600)
      } else {
        showToast('Kayıt başarısız')
      }
    } catch {
      showToast('Bağlantı hatası')
    } finally {
      setSaving(false)
    }
  }

  /* ── Editör: handlers ── */
  function handleEditorChange(field, value) {
    if (field === 'category') {
      setFormData(prev => ({ ...prev, category: value, answers: buildEmptyAnswers(value) }))
      return
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  function handleAnswer(questionId, value) {
    setFormData(prev => ({ ...prev, answers: { ...prev.answers, [questionId]: value } }))
  }
  function handleImageUpload(slot, base64) {
    setFormData(prev => ({ ...prev, images: { ...prev.images, [slot]: base64 } }))
  }
  function handleImageRemove(slot) {
    setFormData(prev => ({ ...prev, images: { ...prev.images, [slot]: null } }))
  }
  async function handleEditorSubmit() {
    if (!formData.category) return
    setIsLoading(true); setEditorError(null)
    try {
      const fd = new FormData()
      fd.append('category', formData.category)
      fd.append('title',    formData.title || formData.category)
      fd.append('ad',       (formData.ad    || '').toUpperCase())
      fd.append('soyad',    (formData.soyad || '').toUpperCase())
      fd.append('answers',  JSON.stringify(formData.answers))

      const kd = (() => {
        try { return JSON.parse(localStorage.getItem('kapakData') || 'null') } catch { return null }
      })()
      if (kd?.imageBase64) fd.append('kapakImageBase64', kd.imageBase64)
      if (kd?.head)        fd.append('kapakHead',        kd.head)
      if (kd?.sub)         fd.append('kapakSub',         kd.sub)

      if (formData.images.inset1) {
        const r1 = await fetch(formData.images.inset1); const b1 = await r1.blob()
        fd.append('image1', b1, `image1.${b1.type.split('/')[1] || 'jpg'}`)
      }
      if (formData.images.inset2) {
        const r2 = await fetch(formData.images.inset2); const b2 = await r2.blob()
        fd.append('image2', b2, `image2.${b2.type.split('/')[1] || 'jpg'}`)
      }

      const response = await fetch('/api/orders/submit', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data?.error?.message || 'Bir hata oluştu.')

      setPdfFileName(data.pdfFileName || null)
      setKapakPdfFileName(data.kapakPdfFileName || null)
      localStorage.removeItem('kapakData')
      localStorage.removeItem('kapakPdf')
      setIsSuccess(true)
    } catch (err) {
      setEditorError(err.message || 'Gönderim sırasında bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }
  function handleEditorReset() {
    setFormData(buildInitialEditor(user))
    setIsSuccess(false)
    setPdfFileName(null)
    setKapakPdfFileName(null)
    setEditorError(null)
  }

  /* ── Abonelik kapısı ── */
  if (!hasAbonelik) {
    return (
      <>
        <Header />
        <div className="kp-gate">
          <span className="kp-gate-icon">✦</span>
          <h2>Abonelik Gerekiyor</h2>
          <p>Kapak tasarlamak için önce abone olmanız gerekiyor.</p>
          <button onClick={() => navigate('/abonelik')} className="kp-gate-btn">Abone Ol</button>
        </div>
      </>
    )
  }

  const displayHead = head.trim() || (user?.ad ? `${user.ad} ${user.soyad || ''}`.trim() : 'Ad Soyad')

  /* ── ADIM 2: Editör ── */
  if (step === 2) {
    return (
      <>
        <Header />
        <div className="editor-page">
          <div className="editor-topbar">
            <button
              className="kp-btn kp-btn-ghost"
              style={{ fontSize: 11, padding: '6px 12px' }}
              onClick={() => setStep(1)}
            >
              ← Kapağa Dön
            </button>
            <div className="editor-topbar-sep" />
            <span className="editor-topbar-brand">Dergi Editörü</span>
            <div className="editor-topbar-sep" />
            <span className="editor-topbar-label">Röportaj Siparişi</span>
          </div>
          <main className="editor-body">
            {editorError && (
              <div className="editor-error">⚠ {editorError}</div>
            )}
            <OrderForm
              formData={formData}
              onChange={handleEditorChange}
              onAnswer={handleAnswer}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              onSubmit={handleEditorSubmit}
              isLoading={isLoading}
              isSuccess={isSuccess}
              pdfFileName={pdfFileName}
              kapakPdfFileName={kapakPdfFileName}
              hasKapak={!!kapakData}
              onReset={handleEditorReset}
            />
          </main>
        </div>
        {toast && <div className="kp-toast">{toast}</div>}
      </>
    )
  }

  /* ── ADIM 1: Kapak tasarla ── */
  return (
    <>
      <Header />
      <div className="kp-app">

        {/* ── Editör paneli ── */}
        <section className="kp-editor">
          <div className="kp-editor-inner">

            {/* 01 Fotoğraf */}
            <div className="kp-section">
              <div className="kp-section-head">
                <span className="kp-section-num">01</span>
                <span className="kp-section-title">Kapak Fotoğrafı</span>
              </div>

              <div
                className={`kp-upload ${dragOver ? 'kp-upload--drag' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
              >
                <div className="kp-upload-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b8880" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/>
                  </svg>
                </div>
                <span className="kp-upload-title">Fotoğraf seç veya sürükle</span>
                <span className="kp-upload-hint">JPG · PNG · Maks. 20 MB</span>
                <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={onFileChange} />
              </div>

              {photo && (
                <div className="kp-thumb">
                  <img src={photo} alt="Yüklenen fotoğraf" />
                  <button className="kp-thumb-rm" onClick={() => { URL.revokeObjectURL(photo); setPhoto(null); setBgZoom(1); setBgRotate(0); setBgMirror(false); setBgOffsetX(0); setBgOffsetY(0) }}>✕ Kaldır</button>
                </div>
              )}
              {photo && (
                <div className="kp-img-controls">
                  <div className="kp-img-ctrl-row">
                    <span className="kp-img-ctrl-label">Boyut</span>
                    <button className="kp-ic-btn" onClick={() => setBgZoom(z => Math.max(0.3, +(z - 0.1).toFixed(2)))}>−</button>
                    <input type="range" min="30" max="300" step="5" value={Math.round(bgZoom * 100)} onChange={e => setBgZoom(+(e.target.value / 100).toFixed(2))} className="kp-zoom-slider" />
                    <button className="kp-ic-btn" onClick={() => setBgZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))}>+</button>
                    <span className="kp-img-ctrl-val">%{Math.round(bgZoom * 100)}</span>
                  </div>
                  <div className="kp-img-ctrl-row">
                    <span className="kp-img-ctrl-label">Döndür</span>
                    <button className="kp-ic-btn" onClick={() => setBgRotate(r => r - 90)}>↺</button>
                    <span className="kp-img-ctrl-val kp-img-ctrl-val--mid">{((bgRotate % 360) + 360) % 360}°</span>
                    <button className="kp-ic-btn" onClick={() => setBgRotate(r => r + 90)}>↻</button>
                    <button className={`kp-ic-btn kp-ic-btn--mirror ${bgMirror ? 'kp-ic-btn--on' : ''}`} onClick={() => setBgMirror(m => !m)}>⟺ Ayna</button>
                  </div>
                </div>
              )}

              {/* Ön plan kişi fotoğrafı */}
              <div className="kp-upload kp-upload-fg" onClick={() => fgRef.current?.click()}>
                <div className="kp-upload-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b8880" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/>
                  </svg>
                </div>
                <span className="kp-upload-title">Kişi / Ön Plan PNG</span>
                <span className="kp-upload-hint">Arka planı silinmiş PNG · Logo önünde görünür</span>
                <input ref={fgRef} type="file" accept="image/png" style={{ display:'none' }} onChange={onFgChange} />
              </div>
              {fgPhoto && (
                <div className="kp-thumb">
                  <img src={fgPhoto} alt="Ön plan" />
                  <button className="kp-thumb-rm" onClick={() => { URL.revokeObjectURL(fgPhoto); setFgPhoto(null); setFgZoom(1); setFgRotate(0); setFgMirror(false); setFgOffsetX(0); setFgOffsetY(0); setDragTarget('bg') }}>✕ Kaldır</button>
                </div>
              )}
              {fgPhoto && (
                <div className="kp-img-controls">
                  <div className="kp-img-ctrl-row">
                    <span className="kp-img-ctrl-label">Boyut</span>
                    <button className="kp-ic-btn" onClick={() => setFgZoom(z => Math.max(0.3, +(z - 0.1).toFixed(2)))}>−</button>
                    <input type="range" min="30" max="300" step="5" value={Math.round(fgZoom * 100)} onChange={e => setFgZoom(+(e.target.value / 100).toFixed(2))} className="kp-zoom-slider" />
                    <button className="kp-ic-btn" onClick={() => setFgZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))}>+</button>
                    <span className="kp-img-ctrl-val">%{Math.round(fgZoom * 100)}</span>
                  </div>
                  <div className="kp-img-ctrl-row">
                    <span className="kp-img-ctrl-label">Döndür</span>
                    <button className="kp-ic-btn" onClick={() => setFgRotate(r => r - 90)}>↺</button>
                    <span className="kp-img-ctrl-val kp-img-ctrl-val--mid">{((fgRotate % 360) + 360) % 360}°</span>
                    <button className="kp-ic-btn" onClick={() => setFgRotate(r => r + 90)}>↻</button>
                    <button className={`kp-ic-btn kp-ic-btn--mirror ${fgMirror ? 'kp-ic-btn--on' : ''}`} onClick={() => setFgMirror(m => !m)}>⟺ Ayna</button>
                  </div>
                  <div className="kp-img-ctrl-row" style={{ marginTop: 4 }}>
                    <span className="kp-img-ctrl-label">Sürükle</span>
                    <button className={`kp-ic-btn ${dragTarget === 'bg' ? 'kp-ic-btn--on' : ''}`} onClick={() => setDragTarget('bg')}>Arka</button>
                    <button className={`kp-ic-btn ${dragTarget === 'fg' ? 'kp-ic-btn--on' : ''}`} onClick={() => setDragTarget('fg')}>Ön</button>
                  </div>
                </div>
              )}
            </div>

            {/* 02 Metinler */}
            <div className="kp-section">
              <div className="kp-section-head">
                <span className="kp-section-num">02</span>
                <span className="kp-section-title">Metinler</span>
              </div>

              <div className="kp-fields">
                <div className="kp-field kp-field-full">
                  <div className="kp-label-row">
                    <label className="kp-label">Ad Soyad</label>
                    <label className="kp-color-wrap">
                      <span>Renk</span>
                      <input type="color" value={headColor} onChange={e => setHeadColor(e.target.value)} className="kp-color-input" />
                    </label>
                  </div>
                  <input
                    className="kp-input"
                    type="text"
                    value={head}
                    onChange={e => setHead(e.target.value)}
                    placeholder={`${user?.ad || 'Ad'} ${user?.soyad || 'Soyad'}`}
                    maxLength={40}
                  />
                </div>
                <div className="kp-field kp-field-full">
                  <label className="kp-label">Alt Başlık <span className="kp-opt">(İsteğe bağlı)</span></label>
                  <textarea
                    className="kp-input"
                    value={sub}
                    onChange={e => setSub(e.target.value)}
                    placeholder="Kısa bir alt başlık…"
                    maxLength={120}
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* 03 Yan Yazılar */}
            <div className="kp-section">
              <div className="kp-section-head">
                <span className="kp-section-num">03</span>
                <span className="kp-section-title">Yan Yazılar</span>
              </div>
              <p className="kp-drag-hint">Önizlemede yazılara <strong>tıklayarak</strong> düzenleyebilir, <strong>basılı tutarak</strong> sürükleyebilirsiniz.</p>

              <div className="kp-side-group">
                <div className="kp-side-group-head">
                  <span className="kp-side-group-label">Sol Yazı</span>
                  <label className="kp-color-wrap">
                    <span>Renk</span>
                    <input type="color" value={leftColor} onChange={e => setLeftColor(e.target.value)} className="kp-color-input" />
                  </label>
                </div>
                <textarea
                  className="kp-input"
                  value={leftText}
                  onChange={e => setLeftText(enforceWordLimit(e.target.value))}
                  rows={2}
                  maxLength={80}
                  placeholder="Sol yazı..."
                />
                <select className="kp-font-select" value={leftFont} onChange={e => setLeftFont(e.target.value)}>
                  {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <div className="kp-img-ctrl-row">
                  <span className="kp-img-ctrl-label" style={{ color: 'var(--kp-muted)' }}>Boyut</span>
                  <button className="kp-ic-btn" style={{ borderColor: 'var(--kp-line-str)', color: 'var(--kp-label)' }} onClick={() => setLeftSize(s => Math.max(0.8, +(s - 0.1).toFixed(1)))}>−</button>
                  <span className="kp-img-ctrl-val" style={{ color: 'var(--kp-label)' }}>{leftSize.toFixed(1)}</span>
                  <button className="kp-ic-btn" style={{ borderColor: 'var(--kp-line-str)', color: 'var(--kp-label)' }} onClick={() => setLeftSize(s => Math.min(5, +(s + 0.1).toFixed(1)))}>+</button>
                </div>
              </div>

              <div className="kp-side-group">
                <div className="kp-side-group-head">
                  <span className="kp-side-group-label">Sağ Yazı</span>
                  <label className="kp-color-wrap">
                    <span>Renk</span>
                    <input type="color" value={rightColor} onChange={e => setRightColor(e.target.value)} className="kp-color-input" />
                  </label>
                </div>
                <textarea
                  className="kp-input"
                  value={rightText}
                  onChange={e => setRightText(enforceWordLimit(e.target.value))}
                  rows={2}
                  maxLength={80}
                  placeholder="Sağ yazı..."
                />
                <select className="kp-font-select" value={rightFont} onChange={e => setRightFont(e.target.value)}>
                  {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <div className="kp-img-ctrl-row">
                  <span className="kp-img-ctrl-label" style={{ color: 'var(--kp-muted)' }}>Boyut</span>
                  <button className="kp-ic-btn" style={{ borderColor: 'var(--kp-line-str)', color: 'var(--kp-label)' }} onClick={() => setRightSize(s => Math.max(0.8, +(s - 0.1).toFixed(1)))}>−</button>
                  <span className="kp-img-ctrl-val" style={{ color: 'var(--kp-label)' }}>{rightSize.toFixed(1)}</span>
                  <button className="kp-ic-btn" style={{ borderColor: 'var(--kp-line-str)', color: 'var(--kp-label)' }} onClick={() => setRightSize(s => Math.min(5, +(s + 0.1).toFixed(1)))}>+</button>
                </div>
              </div>

              <div className="kp-side-group">
                <div className="kp-side-group-head">
                  <span className="kp-side-group-label">Sol Yazı 2</span>
                  <label className="kp-color-wrap">
                    <span>Renk</span>
                    <input type="color" value={left2Color} onChange={e => setLeft2Color(e.target.value)} className="kp-color-input" />
                  </label>
                </div>
                <textarea
                  className="kp-input"
                  value={left2Text}
                  onChange={e => setLeft2Text(enforceWordLimit(e.target.value))}
                  rows={2}
                  maxLength={80}
                  placeholder="Sol yazı 2..."
                />
                <select className="kp-font-select" value={left2Font} onChange={e => setLeft2Font(e.target.value)}>
                  {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <div className="kp-img-ctrl-row">
                  <span className="kp-img-ctrl-label" style={{ color: 'var(--kp-muted)' }}>Boyut</span>
                  <button className="kp-ic-btn" style={{ borderColor: 'var(--kp-line-str)', color: 'var(--kp-label)' }} onClick={() => setLeft2Size(s => Math.max(0.8, +(s - 0.1).toFixed(1)))}>−</button>
                  <span className="kp-img-ctrl-val" style={{ color: 'var(--kp-label)' }}>{left2Size.toFixed(1)}</span>
                  <button className="kp-ic-btn" style={{ borderColor: 'var(--kp-line-str)', color: 'var(--kp-label)' }} onClick={() => setLeft2Size(s => Math.min(5, +(s + 0.1).toFixed(1)))}>+</button>
                </div>
              </div>

              <div className="kp-side-group">
                <div className="kp-side-group-head">
                  <span className="kp-side-group-label">Sağ Yazı 2</span>
                  <label className="kp-color-wrap">
                    <span>Renk</span>
                    <input type="color" value={right2Color} onChange={e => setRight2Color(e.target.value)} className="kp-color-input" />
                  </label>
                </div>
                <textarea
                  className="kp-input"
                  value={right2Text}
                  onChange={e => setRight2Text(enforceWordLimit(e.target.value))}
                  rows={2}
                  maxLength={80}
                  placeholder="Sağ yazı 2..."
                />
                <select className="kp-font-select" value={right2Font} onChange={e => setRight2Font(e.target.value)}>
                  {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <div className="kp-img-ctrl-row">
                  <span className="kp-img-ctrl-label" style={{ color: 'var(--kp-muted)' }}>Boyut</span>
                  <button className="kp-ic-btn" style={{ borderColor: 'var(--kp-line-str)', color: 'var(--kp-label)' }} onClick={() => setRight2Size(s => Math.max(0.8, +(s - 0.1).toFixed(1)))}>−</button>
                  <span className="kp-img-ctrl-val" style={{ color: 'var(--kp-label)' }}>{right2Size.toFixed(1)}</span>
                  <button className="kp-ic-btn" style={{ borderColor: 'var(--kp-line-str)', color: 'var(--kp-label)' }} onClick={() => setRight2Size(s => Math.min(5, +(s + 0.1).toFixed(1)))}>+</button>
                </div>
              </div>
            </div>

            {/* 04 Arka Plan Rengi */}
            <div className="kp-section">
              <div className="kp-section-head">
                <span className="kp-section-num">04</span>
                <span className="kp-section-title">Arka Plan Rengi</span>
              </div>
              <div className="kp-bg-swatches">
                {BG_COLORS.map(c => (
                  <button
                    key={c.value}
                    className={`kp-bg-swatch ${bgColor === c.value ? 'kp-bg-swatch--active' : ''}`}
                    style={{ background: c.value }}
                    onClick={() => setBgColor(c.value)}
                    title={c.label}
                  >
                    {bgColor === c.value && (
                      <span className="kp-bg-swatch-check" style={{ color: c.dark ? '#111' : '#fff' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>


            {/* 05 Logo Rengi */}
            <div className="kp-section">
              <div className="kp-section-head">
                <span className="kp-section-num">05</span>
                <span className="kp-section-title">Logo Rengi</span>
              </div>
              <div className="kp-bg-swatches">
                {LOGO_COLORS.map(c => (
                  <button
                    key={c.filter}
                    className={`kp-bg-swatch ${logoFilter === c.filter ? 'kp-bg-swatch--active' : ''}`}
                    style={{ background: c.preview }}
                    onClick={() => setLogoFilter(c.filter)}
                    title={c.label}
                  >
                    {logoFilter === c.filter && (
                      <span className="kp-bg-swatch-check" style={{ color: c.dark ? '#111' : '#fff' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="kp-logo-color-labels">
                {LOGO_COLORS.map(c => (
                  <span
                    key={c.filter}
                    className={`kp-logo-color-label ${logoFilter === c.filter ? 'kp-logo-color-label--active' : ''}`}
                    onClick={() => setLogoFilter(c.filter)}
                  >
                    {c.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Mobil aksiyonlar */}
            <div className="kp-editor-actions">
              <button className="kp-btn kp-btn-ghost" onClick={handleReset}>Sıfırla</button>
              <button className="kp-btn kp-btn-primary" onClick={handleExport} disabled={exporting}>
                {exporting ? 'İşleniyor…' : 'Kapağı İndir'}
              </button>
            </div>

            {/* Röportaja geç */}
            <div className="kp-continue">
              <div className="kp-continue-line" />
              <button className="kp-continue-btn" onClick={handleSaveAndContinue} disabled={saving}>
                {saving ? 'Kaydediliyor…' : 'Kapağı Kaydet & Röportaja Geç'} <span className="kp-arr">→</span>
              </button>
            </div>

          </div>
        </section>

        {/* ── Önizleme ── */}
        <section className="kp-preview">
          <span className="kp-preview-label">Canlı Önizleme</span>

          <div className="kp-cover-stage" style={{ background: bgColor }}>
            <div
              className="kp-cover"
              ref={coverRef}
              style={{ cursor: (photo || fgPhoto) ? 'grab' : 'default' }}
              onMouseDown={e => dragTarget === 'fg' && fgPhoto ? startFgDrag(e) : startBgDrag(e)}
              onTouchStart={e => dragTarget === 'fg' && fgPhoto ? startFgDrag(e) : startBgDrag(e)}
            >

              {/* Arka plan */}
              <div className="kp-cover-bg">
                {photo && <img className="kp-cover-img" src={photo} alt="" style={{ transform: `translate(${bgOffsetX}px, ${bgOffsetY}px) scale(${bgMirror ? -bgZoom : bgZoom}, ${bgZoom}) rotate(${bgRotate}deg)`, transformOrigin: 'center center' }} />}
                <div className="kp-cover-overlay" />
              </div>

              {/* Boş durum */}
              {!photo && (
                <div className="kp-cover-empty">
                  <div className="kp-cover-empty-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.6"/>
                      <path d="M3 16l5-5 4 4 3-3 6 6"/>
                    </svg>
                  </div>
                  <div className="kp-cover-empty-title">Önizleme burada</div>
                  <div className="kp-cover-empty-sub">Fotoğraf yükleyin</div>
                </div>
              )}

              {/* Logo — kp-cover-content dışında, doğrudan kp-cover içinde */}
              <div
                className="kp-cov-brand"
                style={logoFilter !== 'none' ? { filter: logoFilter } : undefined}
              >
                <img src={logoImg} className="kp-cov-logo-img" alt="Logo" />
              </div>

              {/* Ön plan kişi katmanı */}
              {fgPhoto && <img className="kp-cover-fg" src={fgPhoto} alt="" style={{ transform: `translate(${fgOffsetX}px, ${fgOffsetY}px) scale(${fgMirror ? -fgZoom : fgZoom}, ${fgZoom}) rotate(${fgRotate}deg)`, transformOrigin: 'center top' }} />}

              {/* Kapak içeriği */}
              <div className="kp-cover-content">

                {/* Alt bilgi */}
                <div className="kp-cov-bottom">
                  <div className="kp-cov-headline" style={{ color: headColor }}>{displayHead.toUpperCase()}</div>
                  {sub.trim() && <div className="kp-cov-sub">{sub.trim()}</div>}
                  <div className="kp-cov-edition">İLKBAHAR 2026</div>
                </div>

                {/* Barkod */}
                <div className="kp-cov-barcode">{BARCODE}</div>

              </div>

              {/* Sol yazı — textarea: tıkla/dokun yaz, sürükle taşı */}
              <textarea
                ref={leftDragRef}
                className="kp-cov-text-ta"
                value={leftText}
                onChange={e => setLeftText(enforceWordLimit(e.target.value))}
                onMouseDown={e => startTextDrag(e, 'left')}
                onTouchStart={e => startTextDrag(e, 'left')}
                rows={4}
                maxLength={80}
                style={{ left: `${leftPos.x}%`, top: `${leftPos.y}%`, color: leftColor, textAlign: 'left', fontSize: `${leftSize}cqh`, fontFamily: leftFont, width: '50%' }}
              />

              {/* Sağ yazı — textarea: tıkla/dokun yaz, sürükle taşı */}
              <textarea
                ref={rightDragRef}
                className="kp-cov-text-ta"
                value={rightText}
                onChange={e => setRightText(enforceWordLimit(e.target.value))}
                onMouseDown={e => startTextDrag(e, 'right')}
                onTouchStart={e => startTextDrag(e, 'right')}
                rows={4}
                maxLength={80}
                style={{ left: `${rightPos.x}%`, top: `${rightPos.y}%`, color: rightColor, textAlign: 'right', fontSize: `${rightSize}cqh`, fontFamily: rightFont, width: '40%' }}
              />

              {/* Sol yazı 2 */}
              <textarea
                ref={left2DragRef}
                className="kp-cov-text-ta"
                value={left2Text}
                onChange={e => setLeft2Text(enforceWordLimit(e.target.value))}
                onMouseDown={e => startTextDrag(e, 'left2')}
                onTouchStart={e => startTextDrag(e, 'left2')}
                rows={4}
                maxLength={80}
                style={{ left: `${left2Pos.x}%`, top: `${left2Pos.y}%`, color: left2Color, textAlign: 'left', fontSize: `${left2Size}cqh`, fontFamily: left2Font, width: '50%' }}
              />

              {/* Sağ yazı 2 */}
              <textarea
                ref={right2DragRef}
                className="kp-cov-text-ta"
                value={right2Text}
                onChange={e => setRight2Text(enforceWordLimit(e.target.value))}
                onMouseDown={e => startTextDrag(e, 'right2')}
                onTouchStart={e => startTextDrag(e, 'right2')}
                rows={4}
                maxLength={80}
                style={{ left: `${right2Pos.x}%`, top: `${right2Pos.y}%`, color: right2Color, textAlign: 'right', fontSize: `${right2Size}cqh`, fontFamily: right2Font, width: '40%' }}
              />

            </div>

          </div>

          <span className="kp-preview-size">21,6 × 27,9 cm · 300 dpi</span>

          {savedPdf && (
            <div className="kp-saved-notice">
              <span>✓ Kapak PDF oluşturuldu</span>
            </div>
          )}
          <div className="kp-preview-actions">
            <button className="kp-btn kp-btn-ghost" onClick={handleReset}>Sıfırla</button>
            <button className="kp-btn kp-btn-primary" onClick={handleExport} disabled={exporting || !photo}>
              {exporting ? 'İşleniyor…' : '↓ PNG İndir'}
            </button>
            <button className="kp-btn kp-btn-gold" onClick={handleSaveAndContinue} disabled={saving}>
              {saving ? 'Kaydediliyor…' : savedPdf ? 'Röportaja Geç →' : 'Kapağı Kaydet & Röportaja Geç →'}
            </button>
          </div>
        </section>

      </div>

      {toast && <div className="kp-toast">{toast}</div>}

      {exporting && (
        <div className="kp-export-overlay">
          <div className="kp-spinner" />
          <div className="kp-export-label">Dışa aktarılıyor…</div>
        </div>
      )}
    </>
  )
}
