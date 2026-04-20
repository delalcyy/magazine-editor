import React, { useRef } from 'react'

const MAX_MB = 5

function Slot({ label, value, onUpload, onRemove }) {
  const ref = useRef(null)
  const [err, setErr] = React.useState(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setErr(null)
    if (!file.type.startsWith('image/')) { setErr('Sadece görsel dosyası.'); return }
    if (file.size > MAX_MB * 1024 * 1024) { setErr(`Maks ${MAX_MB}MB.`); return }
    const reader = new FileReader()
    reader.onload = ev => onUpload(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="upload-slot">
      <span className="upload-slot-label">{label}</span>

      {value ? (
        <div className="upload-preview">
          <img src={value} alt={label} />
          <div className="upload-preview-ov">
            <button type="button" className="upload-ov-btn" onClick={() => ref.current?.click()}>
              Değiştir
            </button>
            <button type="button" className="upload-ov-btn upload-ov-rm" onClick={onRemove}>
              Kaldır
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="upload-btn" onClick={() => ref.current?.click()}>
          <span className="upload-btn-icon">+</span>
          <span className="upload-btn-text">Görsel Seç</span>
          <span className="upload-btn-sub">JPG · PNG · WEBP · maks {MAX_MB}MB</span>
        </button>
      )}

      {err && <p style={{ fontSize: 11, color: '#c0392b', marginTop: 4 }}>{err}</p>}
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  )
}

export default function ImageUpload({ images, onUpload, onRemove }) {
  return (
    <div className="upload-grid">
      <Slot
        label="Görsel 1"
        value={images.inset1}
        onUpload={b64 => onUpload('inset1', b64)}
        onRemove={() => onRemove('inset1')}
      />
      <Slot
        label="Görsel 2"
        value={images.inset2}
        onUpload={b64 => onUpload('inset2', b64)}
        onRemove={() => onRemove('inset2')}
      />
    </div>
  )
}
