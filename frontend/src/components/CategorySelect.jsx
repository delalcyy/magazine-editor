import React from 'react'
import { CATEGORIES } from '../data/questions'

export default function CategorySelect({ value, onChange }) {
  return (
    <div className="cat-grid">
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          type="button"
          className={`cat-card${value === cat.label ? ' cat-card--active' : ''}`}
          onClick={() => onChange(cat.label)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
