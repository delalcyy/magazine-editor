import React from 'react'
import CategorySelect from './CategorySelect'
import ImageUpload from './ImageUpload'
import QuestionFields from './QuestionFields'

/**
 * OrderForm — dergi sipariş formu
 *
 * Props:
 *   formData   { category, answers, images }
 *   onChange   fn(field, value)
 *   onAnswer   fn(questionId, value)
 *   onImageUpload fn(slot, base64)
 *   onImageRemove fn(slot)
 *   onSubmit   fn()
 *   isLoading  boolean
 *   isSuccess  boolean
 *   onReset    fn()
 */
export default function OrderForm({
  formData,
  onChange,
  onAnswer,
  onImageUpload,
  onImageRemove,
  onSubmit,
  isLoading,
  isSuccess,
  pdfFileName,
  kapakPdfFileName,
  hasKapak,
  onReset,
}) {
  const { ad, soyad, category, answers, images } = formData

  /* Gönder hazır mı? En az kategori seçilmiş olmalı */
  const canSubmit = !!category && !isLoading

  if (isSuccess) {
    return (
      <div className="success-card">
        <span className="success-icon">✦</span>
        <h2 className="success-title">Formunuz Alındı</h2>
        <p className="success-sub">
          Röportajınız hazırlanacak ve sizinle paylaşılacak. Teşekkür ederiz.
        </p>
        <button type="button" className="success-btn" onClick={onReset}>
          Yeni Form Doldur
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit() }} noValidate>
      {hasKapak && (
        <div style={{
          background: '#f5f2ec', border: '1px solid #c9a96e',
          borderRadius: 4, padding: '10px 16px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 13, color: '#7a6230',
        }}>
          <span>✦</span>
          <span>Kapak tasarımınız kaydedildi — editör formu gönderildiğinde kapak PDF'iniz de oluşturulacak.</span>
        </div>
      )}

      {/* ── 0. Ad Soyad ─────────────────────────────────────── */}
      <div className="order-section">
        <div className="order-section-head">
          <span className="order-section-num">1</span>
          <div>
            <div className="order-section-title">Ad & Soyad</div>
            <div className="order-section-sub">PDF'e yazdırılacak isim</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Ad</label>
            <input
              style={{ width: '100%', border: '1px solid #e2dfd8', padding: '10px 12px', fontFamily: 'inherit', fontSize: 14, outline: 'none' }}
              value={ad}
              onChange={e => onChange('ad', e.target.value)}
              placeholder="Adınız"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Soyad</label>
            <input
              style={{ width: '100%', border: '1px solid #e2dfd8', padding: '10px 12px', fontFamily: 'inherit', fontSize: 14, outline: 'none' }}
              value={soyad}
              onChange={e => onChange('soyad', e.target.value)}
              placeholder="Soyadınız"
            />
          </div>
        </div>
      </div>

      <div className="order-divider" />

      {/* ── 2. Kategori ─────────────────────────────────────── */}
      <div className="order-section">
        <div className="order-section-head">
          <span className="order-section-num">2</span>
          <div>
            <div className="order-section-title">Kategori Seçin</div>
            <div className="order-section-sub">Derginin temasını belirleyin</div>
          </div>
        </div>
        <CategorySelect value={category} onChange={val => onChange('category', val)} />
      </div>

      <div className="order-divider" />

      {/* ── 2. Görseller ────────────────────────────────────── */}
      <div className="order-section">
        <div className="order-section-head">
          <span className="order-section-num">3</span>
          <div>
            <div className="order-section-title">Fotoğraflarınızı Yükleyin</div>
            <div className="order-section-sub">En az bir fotoğraf ekleyin (4:3 oranı önerilir)</div>
          </div>
        </div>
        <ImageUpload images={images} onUpload={onImageUpload} onRemove={onImageRemove} />
      </div>

      <div className="order-divider" />

      {/* ── 3. Sorular ──────────────────────────────────────── */}
      <div className="order-section">
        <div className="order-section-head">
          <span className="order-section-num">4</span>
          <div>
            <div className="order-section-title">Röportaj Soruları</div>
            <div className="order-section-sub">
              {category
                ? `${category} kategorisi için 10 soru — istediğiniz kadar doldurun`
                : 'Önce kategori seçin'}
            </div>
          </div>
        </div>
        {!category && (
          <p style={{ fontSize: 13, color: 'var(--f-ghost)', fontStyle: 'italic', padding: '1rem 0' }}>
            Soruları görmek için yukarıdan bir kategori seçin.
          </p>
        )}
        <QuestionFields category={category} answers={answers} onChange={onAnswer} />
      </div>

      {/* ── Gönder ──────────────────────────────────────────── */}
      <div className="submit-area">
        <button type="submit" className="submit-btn" disabled={!canSubmit}>
          {isLoading
            ? <><span className="submit-spinner" /> Gönderiliyor…</>
            : 'Formu Gönder'
          }
        </button>
        <p className="submit-note">
          Formunuz gönderildikten sonra ekibimiz sizinle iletişime geçecek.
        </p>
      </div>

    </form>
  )
}
