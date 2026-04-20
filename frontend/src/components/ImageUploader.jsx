import React, { useRef } from 'react'

export default function ImageUploader({ label, value, onUpload, onRemove }) {
  const ref = useRef(null)
  const [err, setErr] = React.useState(null)

  function handle(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setErr(null)
    if (!file.type.startsWith('image/')) { setErr('Sadece görsel.'); return }
    if (file.size > 5 * 1024 * 1024)    { setErr('Maks 5MB.'); return }
    const r = new FileReader()
    r.onload = ev => onUpload(ev.target.result)
    r.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="iup">
      <span className="iup-lbl">{label}</span>
      {value ? (
        <div className="iup-pre">
          <img src={value} alt={label} />
          <div className="iup-pre-ov">
            <button type="button" onClick={() => ref.current?.click()}>Değiştir</button>
            <button type="button" onClick={onRemove}>Kaldır</button>
          </div>
        </div>
      ) : (
        <button type="button" className="iup-zone" onClick={() => ref.current?.click()}>
          <span className="iup-plus">+</span>
          <span className="iup-text">Görsel Seç</span>
          <span className="iup-sub">PNG · JPG · maks 5MB</span>
        </button>
      )}
      {err && <p className="iup-err">{err}</p>}
      <input ref={ref} type="file" accept="image/*" style={{display:'none'}} onChange={handle} />
    </div>
  )
}
