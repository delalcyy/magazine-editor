const path  = require('path')
const fs    = require('fs')
const { v4: uuidv4 }          = require('uuid')
const { generatePDF }         = require('../services/pdfService')
const { generateKapakPDF }    = require('../services/kapakPdfService')
const { QUESTIONS }           = require('../data/questions')
const { checkProfanity }      = require('../utils/profanityFilter')
const db                      = require('../db')

const ORDERS_DIR = path.join(__dirname, '../../orders')
if (!fs.existsSync(ORDERS_DIR)) fs.mkdirSync(ORDERS_DIR, { recursive: true })

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function submitOrder(req, res, next) {
  try {
    const { category, title, ad, soyad, answers: answersRaw, kapakImageBase64, kapakHead, kapakSub } = req.body
    const userId = req.user?.id || null

    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, error: { message: 'Kategori zorunludur.' } })
    }

    const questions = QUESTIONS[category.trim()]
    if (!questions) {
      return res.status(400).json({ success: false, error: { message: `Geçersiz kategori: ${category}` } })
    }

    let answers = {}
    if (answersRaw) {
      try { answers = JSON.parse(answersRaw) }
      catch { return res.status(400).json({ success: false, error: { message: 'answers alanı geçerli JSON olmalı.' } }) }
    }

    // Cevaplarda uygunsuz içerik kontrolü
    for (const [qId, val] of Object.entries(answers)) {
      if (!val) continue
      const { isClean, matchedWords } = checkProfanity(String(val))
      if (!isClean) {
        return res.status(400).json({
          success: false,
          error: { message: `Uygunsuz ifade tespit edildi (soru: ${qId}).` },
        })
      }
    }

    // 2 görsel — req.files.image1[0] ve req.files.image2[0]
    const image1Path = req.files?.image1?.[0]?.path || null
    const image2Path = req.files?.image2?.[0]?.path || null

    const orderId = uuidv4()

    const { fileName: pdfFileName } = await generatePDF({
      category:  category.trim(),
      title:     (title || category).trim(),
      ad:        (ad || '').trim(),
      soyad:     (soyad || '').trim(),
      questions,
      answers,
      image1Path,
      image2Path,
    })

    // Kapak PDF oluştur
    let kapakPdfFileName = null
    if (kapakImageBase64 || kapakHead) {
      try {
        const { fileName } = await generateKapakPDF({
          imageBase64: kapakImageBase64 || null,
          head: kapakHead || (ad ? `${ad} ${soyad || ''}`.trim() : ''),
          sub:  kapakSub  || '',
        })
        kapakPdfFileName = fileName
      } catch (kapakErr) {
        console.error('[KAPAK PDF] Hata (devam ediliyor):', kapakErr.message)
      }
    }

    // Veritabanına kaydet
    if (userId) {
      try {
        await db.query(
          `INSERT INTO siparisler (order_id, user_id, ad, soyad, kategori, baslik, cevaplar, pdf_dosya, kapak_pdf)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            userId,
            (ad || '').trim(),
            (soyad || '').trim(),
            category.trim(),
            (title || category).trim(),
            JSON.stringify(answers),
            pdfFileName,
            kapakPdfFileName,
          ]
        )
      } catch (dbErr) {
        console.error('[ORDER] DB kayıt hatası:', dbErr.message)
      }
    }

    const order = {
      orderId,
      category:         category.trim(),
      title:            (title || category).trim(),
      answers,
      image1Path:       image1Path || null,
      image2Path:       image2Path || null,
      pdfFileName,
      kapakPdfFileName: kapakPdfFileName || null,
      createdAt:        new Date().toISOString(),
    }

    const orderFile = path.join(ORDERS_DIR, `${orderId}.json`)
    fs.writeFileSync(orderFile, JSON.stringify(order, null, 2), 'utf8')

    console.log(`[ORDER] ${orderId} — Editör PDF: ${pdfFileName} — Kapak PDF: ${kapakPdfFileName}`)

    return res.status(200).json({
      success: true,
      orderId,
      pdfFileName,
      kapakPdfFileName: kapakPdfFileName || null,
      message: 'Siparişiniz alındı.',
    })

  } catch (err) {
    console.error('[ORDER] Hata:', err.message)
    next(err)
  }
}

async function listOrders(req, res, next) {
  try {
    const [rows] = await db.query(
      `SELECT s.order_id, s.kategori, s.baslik, s.pdf_dosya, s.kapak_pdf, s.created_at,
              u.ad, u.soyad, u.email
       FROM siparisler s
       LEFT JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC LIMIT 200`
    )
    return res.status(200).json({ success: true, count: rows.length, orders: rows })
  } catch (err) { next(err) }
}

function getOrder(req, res, next) {
  try {
    const { orderId } = req.params
    if (!UUID_RE.test(orderId)) {
      return res.status(400).json({ success: false, error: { message: 'Geçersiz sipariş ID.' } })
    }
    const file = path.join(ORDERS_DIR, `${orderId}.json`)
    if (!fs.existsSync(file)) {
      return res.status(404).json({ success: false, error: { message: 'Sipariş bulunamadı.' } })
    }
    return res.status(200).json({ success: true, order: JSON.parse(fs.readFileSync(file, 'utf8')) })
  } catch (err) { next(err) }
}

async function myOrders(req, res, next) {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, error: { message: 'Giriş gerekli.' } })
    const [rows] = await db.query(
      `SELECT order_id, kategori, baslik, pdf_dosya, kapak_pdf, created_at
       FROM siparisler WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
      [userId]
    )
    return res.json({ success: true, orders: rows })
  } catch (err) { next(err) }
}

module.exports = { submitOrder, listOrders, getOrder, myOrders }
