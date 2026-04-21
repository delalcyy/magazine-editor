const fs   = require('fs')
const path = require('path')

const BARCODE_SVG = `<svg viewBox="0 0 60 22" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
<g fill="#111">
${[[1,1.2],[3.5,0.6],[5,1.8],[8,0.6],[9.5,1.2],[12,0.6],[13.5,2],
  [17,0.6],[18.5,1.2],[21,0.8],[23,1.6],[26,0.6],[27.5,1.2],[30,0.8],
  [32,1.4],[34.5,0.6],[36,1.2],[38.5,0.6],[40,1.8],[43,0.6],[44.5,1.2],
  [47,0.8],[49,1.6],[52,0.6],[53.5,1.2],[56,0.6],[57.5,1.4]]
  .map(([x,w]) => `<rect x="${x}" y="1" width="${w}" height="20"/>`)
  .join('\n')}
</g>
</svg>`

function getLogoBase64() {
  try {
    const p = path.join(__dirname, '../../uploads/logo.png')
    if (fs.existsSync(p)) return `data:image/png;base64,${fs.readFileSync(p).toString('base64')}`
  } catch {}
  return null
}
const LOGO_B64 = getLogoBase64()

function esc(s) {
  if (!s) return ''
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

function buildKapakHTML({ imageBase64, head, sub }) {
  const name   = (head || '').trim() || 'Ad Soyad'
  const hasSub = sub && sub.trim()
  const logoHtml = LOGO_B64 ? `<img class="kp-cov-logo-img" src="${LOGO_B64}" alt="logo"/>` : ''

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;900&display=swap" rel="stylesheet"/>
<style>
/* ── Tokens (frontend ile aynı) ── */
:root {
  --kp-serif: 'Playfair Display', Georgia, serif;
  --kp-sans:  'Inter', system-ui, Arial, sans-serif;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  width: 794px; height: 1123px; overflow: hidden;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}

/* Cover — container-type: size ile cqh/cqw çalışır */
.kp-cover {
  position: relative; width: 794px; height: 1123px;
  background: #1a1a18; overflow: hidden;
  container-type: size;
}

/* Arka plan */
.kp-cover-bg { position: absolute; inset: 0; z-index: 0; }
.kp-cover-img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; display: block;
}
.kp-cover-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.72) 0%, rgba(0,0,0,.28) 45%, rgba(0,0,0,.10) 100%);
}

/* Kapak içeriği */
.kp-cover-content {
  position: absolute; inset: 0; z-index: 2;
  padding: 6cqh 5cqw; color: #fff;
}

/* Marka */
.kp-cov-brand {
  position: absolute; top: 2cqh; left: 0; right: 0;
  padding: 0 3cqw;
  display: flex; flex-direction: column; gap: 0.15cqh;
  overflow: hidden;
}
.kp-cov-brand-row {
  display: flex; align-items: center; gap: 2cqw; width: 100%;
}
.kp-cov-logo-img {
  height: 10cqh; width: auto; object-fit: contain; flex-shrink: 0;
}
.kp-cov-ftv-name {
  font-family: var(--kp-sans); font-size: 10cqh; font-weight: 900;
  letter-spacing: 0.06em; color: #fff; line-height: 1;
  white-space: nowrap; overflow: hidden;
  flex: 1 1 0; min-width: 0; display: block;
}
.kp-cov-ftv-mag {
  font-family: var(--kp-serif); font-size: 3.8cqh; font-weight: 700;
  letter-spacing: 0.65em; color: rgba(255,255,255,0.88);
  text-transform: lowercase; font-style: italic;
  text-align: right; display: block;
  margin-left: 43cqw; width: 50cqw; margin-top: -1.1cqh;
}

/* Sol/sağ yazılar */
.kp-cov-side {
  position: absolute; font-size: 1.9cqh; line-height: 1.5; font-weight: 500;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(255,255,255,.9); max-width: 38cqw; white-space: pre-line;
}
.kp-cov-side-left  { left: 2cqw; top: 60cqh; text-align: left; }
.kp-cov-side-right { right: 2cqw; top: 32cqh; text-align: right; }

/* Alt bilgi */
.kp-cov-bottom {
  position: absolute; left: 2cqw; right: 28cqw; bottom: 6cqh;
  display: flex; flex-direction: column; align-items: flex-start;
}
.kp-cov-headline {
  font-family: var(--kp-serif); font-weight: 700; font-size: 5cqh;
  line-height: 1.02; letter-spacing: -0.005em; color: #fff;
  word-break: break-word; text-transform: uppercase;
}
.kp-cov-sub {
  font-size: 2.4cqh; line-height: 1.5; color: rgba(255,255,255,.9);
  font-weight: 400; margin-top: 1.2cqh;
}
.kp-cov-edition {
  font-size: 1.3cqh; letter-spacing: 0.34em; text-transform: uppercase;
  color: rgba(255,255,255,.72); white-space: nowrap; margin-top: 1.4cqh;
}

/* Barkod */
.kp-cov-barcode {
  position: absolute; right: 5cqw; bottom: 5cqh;
  width: 22cqw; max-width: 90px; height: 5.5cqh;
  background: #fff; border-radius: 2px; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  padding: 0.8cqh 1cqw;
}
.kp-cov-barcode svg { width: 100%; height: 100%; }
</style>
</head>
<body>
<div class="kp-cover">

  <div class="kp-cover-bg">
    ${imageBase64 ? `<img class="kp-cover-img" src="${imageBase64}" alt=""/>` : ''}
    <div class="kp-cover-overlay"></div>
  </div>

  <div class="kp-cover-content">

    <div class="kp-cov-brand">
      <div class="kp-cov-brand-row">
        ${logoHtml}
        <span class="kp-cov-ftv-name">fashiontv</span>
      </div>
      <span class="kp-cov-ftv-mag">magazine</span>
    </div>

    <div class="kp-cov-side kp-cov-side-left">YENİ STİL KODLARI
MODA DOSYASI
İLHAM VEREN SEÇKİLER</div>
    <div class="kp-cov-side kp-cov-side-right">ÖZEL RÖPORTAJLAR
GÜÇLÜ İSİMLER
YENİ SEZON</div>

    <div class="kp-cov-bottom">
      <div class="kp-cov-headline">${esc(name.toUpperCase())}</div>
      ${hasSub ? `<div class="kp-cov-sub">${esc(sub.trim())}</div>` : ''}
      <div class="kp-cov-edition">İLKBAHAR 2026</div>
    </div>

    <div class="kp-cov-barcode">${BARCODE_SVG}</div>

  </div>
</div>
</body>
</html>`
}

module.exports = { buildKapakHTML }
