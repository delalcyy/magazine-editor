import React, { useState } from 'react'
import { requestPDF } from '../services/pdfService'

/**
 * PDF oluştur butonu + durum UI.
 *
 * Props:
 *   formData {Object} — App.jsx'ten gelen form state'i
 */
function PdfExportButton({ formData }) {
  const [status, setStatus]   = useState('idle')   // idle | loading | success | error
  const [result, setResult]   = useState(null)      // { fileName, fileUrl }
  const [errorMsg, setErrorMsg] = useState(null)

  async function handleGeneratePDF() {
    if (!formData.category) {
      setErrorMsg('PDF oluşturmak için önce bir kategori seçin.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setResult(null)
    setErrorMsg(null)

    try {
      const data = await requestPDF(formData)
      setResult(data)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message || 'PDF oluşturulurken bir hata oluştu.')
      setStatus('error')
    }
  }

  function handleReset() {
    setStatus('idle')
    setResult(null)
    setErrorMsg(null)
  }

  return (
    <div className="pdf-export no-print">

      {/* ── Ana buton ─────────────────────────────────────── */}
      <button
        type="button"
        className={`pdf-btn ${status === 'loading' ? 'pdf-btn--loading' : ''}`}
        onClick={handleGeneratePDF}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <span className="pdf-btn-inner">
            <span className="pdf-spinner" />
            PDF Oluşturuluyor…
          </span>
        ) : (
          <span className="pdf-btn-inner">↓ PDF Oluştur</span>
        )}
      </button>

      {/* ── Başarı durumu ─────────────────────────────────── */}
      {status === 'success' && result && (
        <div className="pdf-result pdf-result--success">
          <span className="pdf-result-icon">✓</span>
          <div className="pdf-result-body">
            <p className="pdf-result-title">PDF hazır!</p>
            <p className="pdf-result-name">{result.fileName}</p>
          </div>
          <div className="pdf-result-actions">
            <a
              href={result.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pdf-download-btn"
              download={result.fileName}
            >
              İndir
            </a>
            <button
              type="button"
              className="pdf-reset-btn"
              onClick={handleReset}
            >
              Yenile
            </button>
          </div>
        </div>
      )}

      {/* ── Hata durumu ───────────────────────────────────── */}
      {status === 'error' && errorMsg && (
        <div className="pdf-result pdf-result--error">
          <span className="pdf-result-icon">⚠</span>
          <div className="pdf-result-body">
            <p className="pdf-result-title">Hata oluştu</p>
            <p className="pdf-result-name">{errorMsg}</p>
          </div>
          <button
            type="button"
            className="pdf-reset-btn"
            onClick={handleReset}
          >
            Tekrar Dene
          </button>
        </div>
      )}

    </div>
  )
}

export default PdfExportButton
