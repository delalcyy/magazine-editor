import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import OrderForm from '../components/OrderForm'
import '../form.css'
import { buildEmptyAnswers } from '../data/questions'
import './EditorPage.css'

function buildInitial(user) {
  return {
    ad:       user?.ad    || '',
    soyad:    user?.soyad || '',
    category: '',
    title:    '',
    answers:  {},
    images:   { inset1: null, inset2: null },
  }
}

export default function EditorPage() {
  const { user, getToken, hasAbonelik } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData]   = useState(() => buildInitial(user))
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [pdfFileName, setPdfFileName]       = useState(null)
  const [kapakPdfFileName, setKapakPdfFileName] = useState(null)
  const [error, setError]         = useState(null)

  // Kapak verisini localStorage'dan al
  const kapakData = (() => {
    try { return JSON.parse(localStorage.getItem('kapakData') || 'null') } catch { return null }
  })()

  function handleChange(field, value) {
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

  async function handleSubmit() {
    if (!formData.category) return
    setIsLoading(true); setError(null)
    try {
      const fd = new FormData()
      fd.append('category', formData.category)
      fd.append('title',    formData.title || formData.category)
      fd.append('ad',       formData.ad)
      fd.append('soyad',    formData.soyad)
      fd.append('answers',  JSON.stringify(formData.answers))

      // Kapak verisi
      if (kapakData?.imageBase64) fd.append('kapakImageBase64', kapakData.imageBase64)
      if (kapakData?.head)        fd.append('kapakHead',        kapakData.head)
      if (kapakData?.sub)         fd.append('kapakSub',         kapakData.sub)

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
      setError(err.message || 'Gönderim sırasında bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    setFormData(buildInitial(user))
    setIsSuccess(false)
    setPdfFileName(null)
    setKapakPdfFileName(null)
    setError(null)
  }

  // Abonelik yoksa yönlendir
  if (!hasAbonelik) {
    return (
      <>
        <Header />
        <div className="editor-gate">
          <span className="editor-gate-icon">✦</span>
          <h2>Abonelik Gerekiyor</h2>
          <p>Dergi editörünü kullanmak için önce abone olmanız gerekiyor.</p>
          <button onClick={() => navigate('/abonelik')} className="editor-gate-btn">
            Abone Ol
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="editor-page">
        <div className="editor-topbar">
          <span className="editor-topbar-brand">Dergi Editörü</span>
          <div className="editor-topbar-sep" />
          <span className="editor-topbar-label">Röportaj Siparişi</span>
        </div>
        <main className="editor-body">
          {error && (
            <div className="editor-error">⚠ {error}</div>
          )}
          <OrderForm
            formData={formData}
            onChange={handleChange}
            onAnswer={handleAnswer}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isSuccess={isSuccess}
            pdfFileName={pdfFileName}
            kapakPdfFileName={kapakPdfFileName}
          hasKapak={!!kapakData}
          onReset={handleReset}
          />
        </main>
      </div>
    </>
  )
}
