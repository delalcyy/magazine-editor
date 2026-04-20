const puppeteer = require('puppeteer')
const path      = require('path')
const fs        = require('fs')
const { v4: uuidv4 }    = require('uuid')
const { buildKapakHTML } = require('../templates/kapakTemplate')

const PDF_DIR = path.join(__dirname, '../../uploads/pdfs')
if (!fs.existsSync(PDF_DIR)) fs.mkdirSync(PDF_DIR, { recursive: true })

async function generateKapakPDF({ imageBase64, head, sub }) {
  const html     = buildKapakHTML({ imageBase64, head, sub })
  const fileName = `kapak-${uuidv4()}.pdf`
  const filePath = path.join(PDF_DIR, fileName)

  let browser
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 })
    await page.setContent(html, { waitUntil: 'networkidle0' })
    await page.pdf({
      path:            filePath,
      width:           '794px',
      height:          '1123px',
      printBackground: true,
      margin:          { top: 0, right: 0, bottom: 0, left: 0 },
    })
    console.log(`[KAPAK PDF] Oluşturuldu: ${fileName}`)
    return { fileName, filePath }
  } finally {
    if (browser) await browser.close()
  }
}

module.exports = { generateKapakPDF }
