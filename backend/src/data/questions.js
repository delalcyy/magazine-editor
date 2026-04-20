/**
 * Backend soru listesi — frontend/src/data/questions.js ile senkron.
 * Kategori adları ve soru ID'leri birebir aynı olmalı.
 */
const QUESTIONS = {
  'Doğum Günü': [
    { id: 'bd-01', text: 'Bu yeni yaş senin için ne ifade ediyor?' },
    { id: 'bd-02', text: 'Geçen yıldan aklında kalan en özel an hangisiydi?' },
    { id: 'bd-03', text: 'Yeni yaşında kendine vermek istediğin en güzel söz ne?' },
    { id: 'bd-04', text: 'Seni en çok mutlu eden doğum günü hatıran hangisi?' },
    { id: 'bd-05', text: 'Yeni yaşında en çok neyi başarmak istiyorsun?' },
    { id: 'bd-06', text: 'Zamanın geriye gidebilseydin hangi anına dönerdin?' },
    { id: 'bd-07', text: 'Bu yaşa gelirken seni en çok şaşırtan şey ne oldu?' },
    { id: 'bd-08', text: 'Sevdiklerinden aldığın en değerli hediye hangisi?' },
    { id: 'bd-09', text: 'Bir yıl sonra kendini nerede hayal ediyorsun?' },
    { id: 'bd-10', text: 'Bu yılı tek cümleyle nasıl anlatırsın?' },
  ],
  'Evlilik': [
    { id: 'ev-01', text: 'Birlikte geçirdiğiniz en unutulmaz anı nasıl tarif edersiniz?' },
    { id: 'ev-02', text: 'Partnerinizde sizi her gün şaşırtan bir şey var mı?' },
    { id: 'ev-03', text: 'Mutlu bir birlikteliğin sırrı sizce nedir?' },
    { id: 'ev-04', text: 'Geleceğe dair en büyük ortak hayaliniz nedir?' },
    { id: 'ev-05', text: 'Birlikte en çok güldüğünüz an hangisiydi?' },
    { id: 'ev-06', text: 'İlk tanıştığınızda birbirinizde ne gördünüz?' },
    { id: 'ev-07', text: 'Zor bir dönemde sizi bir arada tutan şey neydi?' },
    { id: 'ev-08', text: 'Partnerinize hiç söyleyemediğiniz bir şeyi burada paylaşır mısınız?' },
    { id: 'ev-09', text: 'Birlikteliğinizi bir müzik parçasına benzetseniz hangisi olurdu?' },
    { id: 'ev-10', text: 'Önümüzdeki yıllarda birlikte yapmak istediğiniz bir şey var mı?' },
  ],
  'Kariyer': [
    { id: 'kr-01', text: 'Kariyerinde seni en çok zorlayan dönem hangisiydi ve nasıl aştın?' },
    { id: 'kr-02', text: 'Bu alanda başarının tarifi sana göre nasıl?' },
    { id: 'kr-03', text: 'Bugünkü konumuna gelirken sana en çok kim ya da ne ilham verdi?' },
    { id: 'kr-04', text: 'Genç profesyonellere vereceğin tek tavsiye ne olurdu?' },
    { id: 'kr-05', text: 'İş hayatında en çok gurur duyduğun karar hangisi?' },
    { id: 'kr-06', text: 'Önümüzdeki beş yılda nerede olmak istiyorsun?' },
    { id: 'kr-07', text: 'Yolun başındaki haline bugün ne söylerdin?' },
    { id: 'kr-08', text: 'Başarısızlıktan öğrendiğin en değerli ders neydi?' },
    { id: 'kr-09', text: 'İş ve özel hayat dengesini nasıl kuruyorsun?' },
    { id: 'kr-10', text: 'Alanında fark yaratan insanların ortak özelliği ne sence?' },
  ],
  'Bebek': [
    { id: 'bb-01', text: 'Bebeğinizi ilk kucağınıza aldığınızda ne hissettiniz?' },
    { id: 'bb-02', text: 'Ebeveyn olmanın sizi en çok şaşırtan yönü ne oldu?' },
    { id: 'bb-03', text: 'Bebeğinizin size öğrettiği en değerli şey nedir?' },
    { id: 'bb-04', text: 'Bebeğinize büyüdüğünde anlatmak istediğiniz bir şey var mı?' },
    { id: 'bb-05', text: 'Aile olmanın size kattığı en güzel duygu nedir?' },
    { id: 'bb-06', text: 'Bebeğinizle geçirdiğiniz ilk geceyi nasıl anımsıyorsunuz?' },
    { id: 'bb-07', text: 'Çocuğunuza dünya hakkında ilk öğretmek istediğiniz şey ne?' },
    { id: 'bb-08', text: 'Bu süreçte en çok hangi desteğe ihtiyaç duydunuz?' },
    { id: 'bb-09', text: 'Ebeveynliği yaşamadan önce yanlış bildiğiniz bir şey var mıydı?' },
    { id: 'bb-10', text: 'Bebeğinizin geleceğe dair en büyük hayaliniz nedir?' },
  ],
  'Mezuniyet': [
    { id: 'mz-01', text: 'Bu yolculukta seni en çok zorlayan an hangisiydi?' },
    { id: 'mz-02', text: 'Bugüne gelirken en çok kime minnettarsın?' },
    { id: 'mz-03', text: 'Diplomayı aldığın an aklından geçen ilk şey ne oldu?' },
    { id: 'mz-04', text: 'Öğrencilik yıllarından taşımak istediğin en değerli alışkanlık nedir?' },
    { id: 'mz-05', text: 'Gelecekte kendini nerede ve nasıl hayal ediyorsun?' },
    { id: 'mz-06', text: 'Bu süreçte kendini en iyi tanıdığın an hangisiydi?' },
    { id: 'mz-07', text: 'Okul sıralarında öğrendiğin en önemli ders hangisiydi?' },
    { id: 'mz-08', text: 'Hayatının bu dönemine tek bir kelimeyle ne derdin?' },
    { id: 'mz-09', text: 'Mezun olduktan sonra ilk yapmak istediğin şey neydi?' },
    { id: 'mz-10', text: 'Bu dönemde kendine olan inancını korumanı sağlayan şey neydi?' },
  ],
}

module.exports = { QUESTIONS }
