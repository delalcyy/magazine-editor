// Bu dosya AŞAMA 5'te gerçek AI servisiyle değiştirilecek.
// Şimdilik kategori bazlı sahte veri döner.

const MOCK_QUESTIONS = {
  'Doğum Günü': [
    'Bu yeni yaş senin için ne ifade ediyor?',
    'Geçen yıldan aklında kalan en özel an hangisiydi?',
    'Yeni yaşında kendine vermek istediğin en güzel söz ne?',
    'Seni en çok mutlu eden doğum günü hatıran hangisi?',
    'Bu yılı tek cümleyle nasıl anlatırsın?',
    'Yeni yaşında en çok neyi başarmak istiyorsun?',
    'Zamanın geriye gidebilseyin hangi anına dönerdin?',
    'Bu yaşa gelirken seni en çok şaşırtan şey ne oldu?',
    'Sevdiklerinden aldığın en değerli hediye hangisi?',
    'Bir yıl sonra kendini nerede hayal ediyorsun?',
  ],
  'Evlilik': [
    'Birlikte geçirdiğiniz en unutulmaz anı nasıl tarif edersiniz?',
    'Partnerinizde sizi her gün şaşırtan bir şey var mı?',
    'Mutlu bir birlikteliğin sırrı sizce nedir?',
    'İlk tanıştığınız anı bugün nasıl hissederek anımsıyorsunuz?',
    'Birlikte en çok neyi özgürce yaşayabildiğinizi düşünüyorsunuz?',
    'Geleceğe dair en büyük ortak hayaliniz nedir?',
    'Zor bir dönemden geçerken sizi bir arada tutan şey ne oldu?',
    'Birlikte en çok güldüğünüz an hangisiydi?',
    'Partnerinize hiç söyleyemediğiniz ama söylemek istediğiniz bir şey var mı?',
    'Evliliğiniz bir müzik parçası olsaydı hangisi olurdu?',
  ],
  'Kariyer': [
    'Kariyerinde seni en çok zorlayan dönem hangisiydi ve nasıl aştın?',
    'Bu alanda başarının tarifi sana göre nasıl?',
    'Bugünkü konumuna gelirken sana en çok kim ya da ne ilham verdi?',
    'Genç profesyonellere vereceğin tek tavsiye ne olurdu?',
    'İş hayatında en çok gurur duyduğun karar hangisi?',
    'Önümüzdeki beş yılda nerede olmak istiyorsun?',
    'Yolun başındaki haline bugün ne söylerdin?',
    'Başarısızlıktan öğrendiğin en değerli ders neydi?',
    'İş ve özel hayat dengesini nasıl kuruyorsun?',
    'Alanında fark yaratan kişilerin ortak özelliği ne sence?',
  ],
  'Bebek': [
    'Bebeğinizi ilk kucağınıza aldığınızda ne hissettiniz?',
    'Ebeveyn olmanın sizi en çok şaşırtan yönü ne oldu?',
    'Bebeğinizin size öğrettiği en değerli şey nedir?',
    'Bu yeni dönemi bir renge benzetseniz hangi rengi seçerdiniz?',
    'Bebeğinize büyüdüğünde anlatmak istediğiniz bir şey var mı?',
    'Aile olmanın size kattığı en güzel duygu nedir?',
    'Bebeğinizle geçirdiğiniz ilk geceyi nasıl anımsıyorsunuz?',
    'Çocuğunuza dünya hakkında ilk öğretmek istediğiniz şey ne?',
    'Bu süreçte en çok hangi desteğe ihtiyaç duydunuz?',
    'Ebeveynliği yaşamadan önce yanlış bildiğiniz bir şey var mıydı?',
  ],
  'Mezuniyet': [
    'Bu yolculukta seni en çok zorlayan an hangisiydi?',
    'Bugüne gelirken en çok kime minnettarsın?',
    'Diplomayı aldığın an aklından geçen ilk şey ne oldu?',
    'Öğrencilik yıllarından taşımak istediğin en değerli alışkanlık nedir?',
    'Gelecekte kendini nerede ve nasıl hayal ediyorsun?',
    'Bu süreçte kendini en iyi tanıdığın an hangisiydi?',
    'Okul sıralarında öğrendiğin en önemli ders hangisiydi?',
    'Hayatının bu dönemine tek bir kelimeyle ne derdin?',
    'Mezun olduktan sonra ilk yapmak istediğin şey neydi?',
    'Bu dönemde kendine olan inancını korumanı sağlayan şey neydi?',
  ],
}

/**
 * Kategori ve parametrelere göre soru listesi döner.
 * AŞAMA 5'te bu fonksiyonun içi AI çağrısıyla değiştirilecek,
 * dışarıya açık arayüzü (parametre + return tipi) aynı kalacak.
 *
 * @param {Object} params
 * @param {string} params.category
 * @param {string} params.tone
 * @param {number} params.questionCount
 * @returns {Promise<string[]>}
 */
async function generateQuestions({ category, tone, questionCount }) {
  // Sahte gecikme — gerçek API latency'sini simüle eder
  await new Promise((resolve) => setTimeout(resolve, 300))

  const pool = MOCK_QUESTIONS[category]

  if (!pool) {
    throw new Error(`'${category}' kategorisi için soru havuzu bulunamadı.`)
  }

  return pool.slice(0, questionCount)
}

module.exports = { generateQuestions }
