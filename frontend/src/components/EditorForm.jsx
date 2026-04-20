import React from 'react'
import ImageUploader from './ImageUploader'
import { CATEGORIES, QUESTIONS } from '../data/questions'
import { checkProfanity } from '../utils/profanityFilter'

function EditorForm({ formData, onChange, onAnswerChange, onImageUpload, onImageRemove }) {
  const { category, title, subtitle, answers, images } = formData
  const questions = category ? (QUESTIONS[category] ?? []) : []

  return (
    <aside className="ef-panel">
      <div className="ef-panel-head">
        <span className="ef-panel-tag">Editör</span>
        <h2 className="ef-panel-title">Röportaj Kurulumu</h2>
      </div>

      <div className="ef-panel-body">

        <div className="ef-field">
          <label className="ef-label">Kategori</label>
          <div className="ef-cat-grid">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                className={`ef-cat-btn ${category === cat ? 'ef-cat-btn--on' : ''}`}
                onClick={() => onChange('category', cat)}
              >{cat}</button>
            ))}
          </div>
        </div>

        <div className="ef-field">
          <label className="ef-label" htmlFor="ef-t">Ana Başlık</label>
          <input id="ef-t" type="text" className="ef-input"
            placeholder="Röportaj başlığı…"
            value={title} onChange={e => onChange('title', e.target.value)} maxLength={80} />
        </div>

        <div className="ef-field">
          <label className="ef-label" htmlFor="ef-s">Alt Başlık</label>
          <input id="ef-s" type="text" className="ef-input"
            placeholder="Kısa açıklama…"
            value={subtitle} onChange={e => onChange('subtitle', e.target.value)} maxLength={120} />
        </div>

        <div className="ef-field">
          <label className="ef-label">Görseller</label>
          <div className="ef-imgs">
            <ImageUploader label="Görsel 1 · 4:5" value={images.inset1}
              onUpload={b => onImageUpload('inset1', b)} onRemove={() => onImageRemove('inset1')} />
            <ImageUploader label="Görsel 2 · 4:5" value={images.inset2}
              onUpload={b => onImageUpload('inset2', b)} onRemove={() => onImageRemove('inset2')} />
          </div>
        </div>

        {category ? (
          <div className="ef-field">
            <label className="ef-label">Sorular</label>
            <div className="ef-qa-list">
              {questions.map((q, i) => (
                <AnswerField key={q.id} num={i + 1} question={q.text}
                  value={answers[q.id] ?? ''} onChange={v => onAnswerChange(q.id, v)} />
              ))}
            </div>
          </div>
        ) : (
          <p className="ef-hint">Soruları görmek için kategori seçin.</p>
        )}
      </div>
    </aside>
  )
}

function AnswerField({ num, question, value, onChange }) {
  const [draft, setDraft] = React.useState(value)
  const [err, setErr]     = React.useState(null)
  React.useEffect(() => { setDraft(value); setErr(null) }, [value])

  function handle(e) {
    const v = e.target.value
    setDraft(v)
    const { isClean } = checkProfanity(v)
    if (isClean) { setErr(null); onChange(v) }
    else setErr('Uygunsuz ifade tespit edildi.')
  }

  return (
    <div className="ef-qa">
      <div className="ef-qa-top">
        <span className="ef-qa-num">{String(num).padStart(2,'0')}</span>
        <p className="ef-qa-q">{question}</p>
      </div>
      <textarea className={`ef-qa-ta${err ? ' ef-qa-ta--err' : ''}`}
        placeholder="Cevabı yazın…" rows={3} value={draft} onChange={handle} />
      {err && <p className="ef-qa-err">⚠ {err}</p>}
    </div>
  )
}

export default EditorForm
