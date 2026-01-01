# 🐟 Balıkhane - Stok Takip Uygulaması

Balık hali için günlük stok takip uygulaması. Hem web hem de Android'de çalışır.

## Özellikler

- 📥 **Balık Girişi**: Gelen balıkları türe göre kaydetme
- 📤 **Balık Çıkışı**: Satılan/çıkan balıkları kaydetme
- 📦 **Stok Takibi**: Mevcut stok durumu
- 📊 **Günlük Rapor**: Günlük giriş/çıkış özeti
- 📱 **PWA**: Telefona kurulabilir
- 💾 **Offline**: İnternet olmadan da çalışır

## Kurulum

```bash
npm install
npm run dev
```

## APK Oluşturma

APK dosyası GitHub Actions tarafından otomatik oluşturulur:

1. Kodu GitHub'a push edin
2. Actions sekmesine gidin
3. "Build Android APK" workflow'u çalışacak
4. Artifacts bölümünden APK'yı indirin

## Teknolojiler

- React + Vite
- Capacitor (Android)
- localStorage (Veri saklama)
- PWA (Progressive Web App)

## Lisans

MIT
