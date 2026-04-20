const fs   = require('fs')
const path = require('path')

const BARCODE_SVG = `<svg viewBox="0 0 60 22" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="width:70px;height:26px;display:block">
<g fill="#fff">
${[[1,1.2],[3.5,0.6],[5,1.8],[8,0.6],[9.5,1.2],[12,0.6],[13.5,2],
  [17,0.6],[18.5,1.2],[21,0.8],[23,1.6],[26,0.6],[27.5,1.2],[30,0.8],
  [32,1.4],[34.5,0.6],[36,1.2],[38.5,0.6],[40,1.8],[43,0.6],[44.5,1.2],
  [47,0.8],[49,1.6],[52,0.6],[53.5,1.2],[56,0.6],[57.5,1.4]]
  .map(([x,w]) => `<rect x="${x}" y="1" width="${w}" height="20"/>`)
  .join('')}
</g>
</svg>`

// Logo base64 (build time'da bir kez yükle)
function getLogoBase64() {
  try {
    const p = path.join(__dirname, '../../uploads/logo.png')
    if (fs.existsSync(p)) {
      return `data:image/png;base64,${fs.readFileSync(p).toString('base64')}`
    }
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

  const logoHtml = LOGO_B64
    ? `<img class="brand-logo" src="${LOGO_B64}" alt="logo" />`
    : ''

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 794px; height: 1123px; overflow: hidden;
  font-family: 'Cormorant Garamond', Georgia, serif;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.cover {
  position: relative; width: 794px; height: 1123px;
  background: #1a1a1a; overflow: hidden;
}
.cover-photo {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; object-position: center top; display: block;
}
.overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.50) 0%,
    rgba(0,0,0,0.08) 30%,
    rgba(0,0,0,0.05) 55%,
    rgba(0,0,0,0.60) 78%,
    rgba(0,0,0,0.88) 100%
  );
}

/* ── Üst marka ── */
.brand {
  position: absolute; top: 26px; left: 38px; right: 38px;
  display: flex; align-items: flex-start; gap: 14px;
}
.brand-logo {
  height: 52px; width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
  flex-shrink: 0;
  display: block;
}
.brand-text {
  display: flex; flex-direction: column;
  flex: 1; padding-top: 0;
}
.brand-ftv {
  font-family: Arial Black, Arial, sans-serif;
  font-size: 52px; font-weight: 900; letter-spacing: 0.04em;
  color: #fff; text-transform: uppercase; line-height: 1;
  display: block;
}
.brand-mag {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 11px; font-weight: 400; font-style: italic;
  letter-spacing: 0.42em; color: rgba(255,255,255,0.80);
  text-transform: lowercase;
  text-align: right; display: block; margin-top: 2px;
}
/* Üst ayırıcı çizgi */
.brand-rule {
  position: absolute; top: 108px; left: 38px; right: 38px;
  height: 1px; background: rgba(255,255,255,0.35);
}

/* ── Sol/Sağ dikey yazılar — writing-mode kullanıyoruz (Puppeteer'da güvenilir) ── */
.side-text {
  position: absolute;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 7.5px; letter-spacing: 0.28em; text-transform: uppercase;
  color: rgba(255,255,255,0.75);
  writing-mode: vertical-rl;
  display: flex; align-items: center;
  top: 140px; bottom: 200px;
}
.side-left {
  left: 10px;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  justify-content: center;
}
.side-right {
  right: 10px;
  writing-mode: vertical-rl;
  justify-content: center;
}

/* ── Alt içerik ── */
.bottom {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 0 46px 36px 46px;
}
.bottom-rule { height: 1px; background: rgba(255,255,255,0.4); margin-bottom: 20px; }
.headline {
  font-size: 50px; font-weight: 700; font-style: italic;
  color: #fff; line-height: 1.03; letter-spacing: -0.5px;
  text-shadow: 0 2px 16px rgba(0,0,0,0.55);
  word-break: break-word;
}
.sub-text {
  font-size: 15px; font-weight: 400; font-style: italic;
  color: rgba(255,255,255,0.85); margin-top: 10px; line-height: 1.45;
}
.edition {
  font-family: Arial, sans-serif;
  font-size: 8.5px; letter-spacing: 0.38em; text-transform: uppercase;
  color: rgba(255,255,255,0.55); margin-top: 16px;
}

/* ── Barkod ── */
.barcode-wrap {
  position: absolute; bottom: 30px; right: 46px; opacity: 0.70;
}
</style>
</head>
<body>
<div class="cover">
  ${imageBase64 ? `<img class="cover-photo" src="${imageBase64}" alt=""/>` : ''}
  <div class="overlay"></div>

  <div class="brand">
    ${logoHtml}
    <div class="brand-text">
      <span class="brand-ftv">FASHIONTV</span>
      <span class="brand-mag">magazine</span>
    </div>
  </div>
  <div class="brand-rule"></div>

  <div class="side-text side-left">YENİ STİL KODLARI &nbsp;·&nbsp; MODA DOSYASI &nbsp;·&nbsp; İLHAM VEREN SEÇKİLER</div>
  <div class="side-text side-right">ÖZEL RÖPORTAJLAR &nbsp;·&nbsp; GÜÇLÜ İSİMLER &nbsp;·&nbsp; YENİ SEZON</div>

  <div class="bottom">
    <div class="bottom-rule"></div>
    <div class="headline">${esc(name.toUpperCase())}</div>
    ${hasSub ? `<div class="sub-text">${esc(sub.trim())}</div>` : ''}
    <div class="edition">İLKBAHAR 2026</div>
  </div>

  <div class="barcode-wrap">${BARCODE_SVG}</div>
</div>
</body>
</html>`
}

module.exports = { buildKapakHTML }
