# 💻 SmartShopAI PC Kurulum Rehberi

## 📥 1. PROJE İNDİRME

### Yöntem A: ZIP İndirme (Kolay)
1. https://github.com/nesquaeke/smartshopaipoland adresine git
2. Yeşil "Code" butonu → "Download ZIP" 
3. `smartshopaipoland-main.zip` dosyasını indir
4. İstediğin klasöre çıkart

### Yöntem B: Git Klonlama (Geliştiriciler için)
```bash
# Terminal/Command Prompt'ta:
git clone https://github.com/nesquaeke/smartshopaipoland.git
cd smartshopaipoland
```

## 🛠️ 2. GEREKLİLİKLER

Bilgisayarında bunların yüklü olması gerekiyor:
- **Node.js 18+** (https://nodejs.org indirip yükle)
- **npm** (Node.js ile birlikte gelir)

## 🚀 3. KURULUM ADIM ADIM

### Frontend Kurulumu:
```bash
# 1. Frontend klasörüne git
cd frontend

# 2. Paketleri yükle
npm install

# 3. Geliştirme server'ını başlat
npm run dev
```

### Backend Kurulumu (İsteğe bağlı):
```bash
# 1. Backend klasörüne git
cd backend

# 2. Paketleri yükle  
npm install

# 3. Backend'i başlat
npm run dev
```

## 🌐 4. SİTEYİ AÇMA

1. **Frontend başladıktan sonra:**
   - Tarayıcıda `http://localhost:3000` aç
   - SmartShopAI sitesi açılacak!

2. **Tüm özellikler çalışacak:**
   - ✅ Ana sayfa
   - ✅ Ürün sayfaları  
   - ✅ Mağaza sayfaları
   - ✅ Shopping cart
   - ✅ Dark mode
   - ✅ Dil değiştirme (PL/EN)

## 📱 5. DOSYA YAPISI

```
smartshopaipoland/
├── frontend/          # Next.js React uygulaması
│   ├── src/app/      # Sayfa dosyaları
│   ├── package.json   # Frontend bağımlılıkları
│   └── ...
├── backend/           # Node.js Express API
│   ├── src/          # API dosyaları
│   ├── package.json   # Backend bağımlılıkları
│   └── ...
├── database/          # Veritabanı scriptleri
├── README.md          # Proje dokümantasyonu
└── .gitignore        # Git ignore dosyası
```

## 🔧 6. SORUN GİDERME

### Port zaten kullanımda hatası:
- Next.js otomatik olarak başka port bulacak (3001, 3002 vb.)
- Terminal'de gösterilen portu kullan

### npm install hatası:
```bash
# Cache temizle ve tekrar dene
npm cache clean --force
npm install
```

### Build hatası:
```bash
# Development mode'da çalıştır
npm run dev
```

## 💡 7. İPUÇLARI

- **Sadece frontend yeterli:** Backend olmadan da çalışır (mock data ile)
- **Kod değişiklikleri:** Otomatik yenilenir (hot reload)
- **Production build:** `npm run build` komutu ile
- **Git güncellemeleri:** `git pull` ile en son sürümü çek

## 🎯 8. HEDEF

Bu proje ile elde edeceğin:
- ✅ Modern React/Next.js deneyimi
- ✅ TypeScript kullanımı
- ✅ API entegrasyonu
- ✅ Responsive tasarım
- ✅ Shopping cart sistemi
- ✅ Dark mode implementasyonu
- ✅ Çok dilli destek

## 📞 DESTEK

Sorun yaşarsan:
1. Terminal/Command Prompt'taki hata mesajlarını oku
2. `npm install` ve `npm run dev` komutlarını tekrar dene
3. Port değişikliklerini kontrol et

---
🚀 **Başarılar! Artık SmartShopAI projen PC'nde çalışıyor!** 