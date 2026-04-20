const puppeteer = require('puppeteer')
const path      = require('path')
const fs        = require('fs')
const { v4: uuidv4 } = require('uuid')
const { buildHTML }  = require('../templates/magazineTemplate')

const PDF_DIR = path.join(__dirname, '../../uploads/pdfs')
if (!fs.existsSync(PDF_DIR)) fs.mkdirSync(PDF_DIR, { recursive: true })

async function generatePDF({ category, title, ad, soyad, questions, answers, image1Path, image2Path }) {
  const html     = buildHTML({ category, title, ad, soyad, questions, answers, image1Path, image2Path })
  const fileName = `order-${uuidv4()}.pdf`
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

    console.log(`[PDF] Oluşturuldu: ${fileName}`)
    return { fileName, filePath }
  } finally {
    if (browser) await browser.close()
  }
}

module.exports = { generatePDF }
