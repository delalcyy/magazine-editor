const fs   = require('fs')
const path = require('path')

function esc(s) {
  if (!s) return ''
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

function imgToBase64(fp) {
  try {
    if (!fp || !fs.existsSync(fp)) return null
    const ext  = path.extname(fp).slice(1).toLowerCase()
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : ext === 'webp' ? 'webp' : 'png'
    return `data:image/${mime};base64,${fs.readFileSync(fp).toString('base64')}`
  } catch { return null }
}

function capFirst(str) {
  if (!str) return ''
  const s = str.trim()
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/* ── Sayfa boyutları ── */
const PW = 794, PH = 1123
const PL = 46,  PR = 46, PT = 38
const IMG_W = 220

/* ── Soru satırı HTML ── */
function qaRowHTML(num, qText, answer, dropCap) {
  const raw = (answer && String(answer).trim()) ? capFirst(String(answer).trim()) : null

  const qHtml = `<span style="font-family:Georgia,serif;font-size:12px;font-weight:bold;font-style:italic;color:#111;line-height:1.3;">${esc(qText)}</span>`
  const numHtml = `<span style="font-family:Arial,sans-serif;font-size:7.5px;color:#bbb;letter-spacing:0.08em;vertical-align:top;padding-top:2px;min-width:22px;display:inline-block;">${String(num).padStart(2,'0')}</span>`
  const ansHtml = raw
    ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:1.65;color:#333;word-break:break-word;margin-top:3px;margin-left:22px;">${esc(raw)}</div>`
    : `<div style="font-family:Arial,sans-serif;font-size:10px;color:#ccc;font-style:italic;margin-top:3px;margin-left:22px;">—</div>`

  if (dropCap && raw) {
    const first = esc(raw.charAt(0))
    const rest  = esc(raw.slice(1))
    return `
      <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
        <tr>
          <td style="width:22px;vertical-align:top;padding-top:2px;">
            <span style="font-family:Arial,sans-serif;font-size:7.5px;color:#bbb;">${String(num).padStart(2,'0')}</span>
          </td>
          <td style="vertical-align:top;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="vertical-align:top;padding-right:4px;width:42px;">
                  <span style="font-family:Georgia,serif;font-size:50px;font-weight:bold;font-style:italic;line-height:0.82;color:#111;display:block;">${first}</span>
                </td>
                <td style="vertical-align:top;">
                  ${qHtml}
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:1.65;color:#333;word-break:break-word;margin-top:2px;">${rest}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`
  }

  return `
    <div style="display:flex;align-items:flex-start;gap:0;margin-bottom:3px;">
      ${numHtml}${qHtml}
    </div>
    ${ansHtml}`
}

/* ── Sayfa builder ── */
function buildPage({ cat, name, nameSize, questions, answers, img1, img2, pgN, useDropCap }) {
  const qCount = Math.max(questions.length, 1)

  /*
   * Masthead yüksekliği (sabit fontlarla):
   *   üst satır (brand)  : 16px + 5px margin = 21px
   *   isim satırı        : nameSize + 7px margin
   *   çizgi              : 1px
   *   alt boşluk         : 12px
   * Toplam               : nameSize + 41
   */
  const MH  = nameSize + 28
  const CT  = PT + MH                      // içerik başlangıcı
  const CB  = PH - 22 - 30 - 8            // içerik bitişi (footer üstü)
  const CH  = CB - CT                      // toplam içerik yüksekliği
  const GAP = 30                           // görsel-soru arası boşluk
  const QW  = PW - PL - PR - IMG_W - GAP  // soru genişliği = 482px

  /* Her soruya eşit yükseklik */
  const QH    = Math.floor(CH / qCount)
  const lastH = CH - QH * (qCount - 1)

  /* Üst grup: ilk 3 soru — IMG1 SAĞDA */
  const upper  = questions.slice(0, 3)
  const upperH = upper.length * QH         // ilk 3 sorunun toplam yüksekliği

  /* Alt grup: son 2 soru — IMG2 SOLDA */
  const lower  = questions.slice(3)
  const lowerH = CH - upperH               // kalan yükseklik

  /* Görsel sabit kısa kutu — sorulardan bağımsız */
  const IMG_H1 = 330
  const IMG_H2 = 293

  /* Görsel kutusu */
  function imgBox(src, label, top, left, h) {
    const inner = src
      ? `<img src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;" alt=""/>`
      : `<div style="position:absolute;inset:0;background:#f0f0f0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px;">
           <span style="font-size:22px;color:#bbb;">▭</span>
           <span style="font-family:Arial,sans-serif;font-size:7px;letter-spacing:0.1em;text-transform:uppercase;color:#bbb;">${label}</span>
         </div>`
    return `<div style="position:absolute;top:${top}px;left:${left}px;width:${IMG_W}px;height:${h}px;background:#f0f0f0;overflow:hidden;border-radius:8px;">${inner}</div>`
  }

  /* Soru bloğu */
  function qaBlock(q, i, globalI, top, left, w) {
    const h    = (globalI === qCount - 1) ? lastH : QH
    const bdr  = (globalI < qCount - 1) ? 'border-bottom:1px solid #e0dcd4;' : ''
    const body = qaRowHTML(q._n, q.text, answers[q.id], globalI === 0 && useDropCap)
    return `<div style="position:absolute;top:${top}px;left:${left}px;width:${w}px;height:${h}px;overflow:hidden;${bdr}padding:10px 0;">${body}</div>`
  }

  /* ── Üst grup: sorular SOLDA, img1 SAĞDA ── */
  const img1Left   = PL + QW + GAP
  const upperQLeft = PL
  const upperQA    = upper.map((q, i) =>
    qaBlock(q, i, i, CT + 30 + i * QH, upperQLeft, QW)
  ).join('\n')

  /* ── Alt grup: img2 SOLDA, sorular SAĞDA ── */
  const lowerQLeft = PL + IMG_W + GAP
  const lowerQA = lower.map((q, i) => {
    const globalI = upper.length + i
    return qaBlock(q, i, globalI, CT + upperH + 10 + i * QH, lowerQLeft, QW)
  }).join('\n')

  return `
<div style="position:relative;width:${PW}px;height:${PH}px;background:#fff;overflow:hidden;page-break-after:always;">

  <!-- masthead -->
  <div style="position:absolute;top:${PT}px;left:${PL}px;right:${PR}px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:5px;">
      <div style="flex:1;height:1px;background:#c9a96e;"></div>
      <span style="font-family:Arial,sans-serif;font-size:9px;font-weight:bold;letter-spacing:0.32em;text-transform:uppercase;color:#c9a96e;white-space:nowrap;">Hatıra Dergi</span>
      <div style="flex:1;height:1px;background:#c9a96e;"></div>
    </div>
    <span style="font-family:Georgia,serif;font-size:${nameSize}px;font-weight:bold;color:#111;letter-spacing:0.05em;line-height:1;display:block;margin-bottom:7px;text-transform:uppercase;">${esc(name)}</span>
    <div style="height:1px;background:#111;"></div>
  </div>

  <!-- img1: ilk soruyla hizalı (padding kadar aşağı) -->
  ${imgBox(img1, 'Görsel 1', CT + 30, img1Left, IMG_H1)}

  <!-- üst sorular (1-3): sağ taraf -->
  ${upperQA}

  <!-- img2: alt grup - 1. soruyla hizalı -->
  ${imgBox(img2, 'Görsel 2', CT + upperH + 10, PL, IMG_H2)}

  <!-- alt sorular (4-5): sağ taraf -->
  ${lowerQA}

  <!-- footer -->
  <div style="position:absolute;bottom:22px;left:${PL}px;right:${PR}px;border-top:1px solid #111;padding-top:6px;display:flex;align-items:center;justify-content:space-between;">
    <span style="font-family:Arial,sans-serif;font-size:7px;font-weight:bold;letter-spacing:0.20em;text-transform:uppercase;color:#bbb;">Hatıra Dergi Stüdyo</span>
    <span style="font-family:Georgia,serif;font-size:9px;font-style:italic;color:#888;">${esc(cat)}</span>
    <span style="font-family:Arial,sans-serif;font-size:11px;font-weight:bold;color:#111;">${String(pgN).padStart(2,'0')}</span>
  </div>

</div>`
}

/* ── Ana builder ── */
function buildHTML({ category, title, ad, soyad, questions, answers, image1Path, image2Path }) {
  const img1 = imgToBase64(image1Path)
  const img2 = imgToBase64(image2Path)
  const cat  = (category || 'Röportaj').trim()

  /* Ad ve soyad zorla büyük harf */
  const name = [(ad||'').trim().toUpperCase(), (soyad||'').trim().toUpperCase()]
    .filter(Boolean).join(' ') || (title || cat).trim().toUpperCase()

  const nLen  = name.length
  const nSize = nLen > 40 ? 24 : nLen > 28 ? 28 : nLen > 18 ? 34 : 40

  const ans = answers   || {}
  const qs  = questions || []

  const qs1 = qs.slice(0, 5).map((q, i) => ({ ...q, _n: i + 1 }))
  const qs2 = qs.slice(5, 10).map((q, i) => ({ ...q, _n: i + 6 }))

  const p1 = buildPage({ cat, name, nameSize: nSize, questions: qs1, answers: ans, img1, img2, pgN: 1, useDropCap: true  })
  const p2 = buildPage({ cat, name, nameSize: nSize, questions: qs2, answers: ans, img1, img2, pgN: 2, useDropCap: false })

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
body { background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
</style>
</head>
<body>${p1}${p2}</body>
</html>`
}

module.exports = { buildHTML }
