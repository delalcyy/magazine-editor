import React from 'react'
import { QUESTIONS } from '../data/questions'
import { checkProfanity } from '../utils/profanityFilter'

function QuestionItem({ num, question, value, onChange }) {
  const [draft, setDraft] = React.useState(value)
  const [err, setErr]     = React.useState(null)

  React.useEffect(() => { setDraft(value); setErr(null) }, [value])

  function handle(e) {
    const v = e.target.value
    setDraft(v)
    const { isClean } = checkProfanity(v)
    if (isClean) { setErr(null); onChange(v) }
    else { setErr('Uygunsuz ifade tespit edildi.'); onChange('') }
  }

  return (
    <div className="q-item">
      <div className="q-item-top">
        <span className="q-num">{String(num).padStart(2, '0')}</span>
        <p className="q-text">{question}</p>
      </div>
      <textarea
        className={`q-textarea${err ? ' q-textarea--err' : ''}`}
        placeholder="Cevabınızı buraya yazın…"
        rows={3}
        value={draft}
        onChange={handle}
      />
      {err && <p className="q-err">⚠ {err}</p>}
    </div>
  )
}

export default function QuestionFields({ category, answers, onChange }) {
  if (!category) return null

  const questions = QUESTIONS[category] ?? []

  return (
    <div className="questions-list">
      {questions.map((q, i) => (
        <QuestionItem
          key={q.id}
          num={i + 1}
          question={q.text}
          value={answers[q.id] ?? ''}
          onChange={val => onChange(q.id, val)}
        />
      ))}
    </div>
  )
}
