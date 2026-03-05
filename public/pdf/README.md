# PDF Klasörü

Bu klasöre dergi PDF dosyalarınızı ekleyin.

## Hızlı Test (Örnek Değerler)

Admin panelinde (`/admin/dergi-yukle`) şu değerlerle deneyebilirsiniz:

| Alan | Örnek Değer |
|------|-------------|
| Dergi Başlığı | Test Dergi Sayı 1 |
| Yayıncı Adı | Semanur Tufan |
| Sayı Numarası | 1 |
| Kapak Görsel URL | `https://placehold.co/400x600/69f0ae/0d1421?text=Kapak` |
| PDF URL | `/pdf/ornek.pdf` (önce bu klasöre ornek.pdf ekleyin) |
| Özet | Bu bir test dergisidir. |
| Anahtar Kelimeler | test, dergi |

## Adımlar

### 1. PDF Dosyası Ekle
- Bir PDF dosyasını bu klasöre kopyalayın
- Örn: `ornek.pdf` veya `dergi-sayi-1.pdf`

### 2. Admin Paneline Git
- Giriş yapın (admin e-postası ile)
- Navbar → **Dergi Yükle** veya `/admin/dergi-yukle`

### 3. PDF URL Formatı
- Bu klasördeki dosya: `/pdf/dosya-adi.pdf`
- `ornek.pdf` → `/pdf/ornek.pdf`
- **Harici URL** (PDF yoksa hızlı test için):  
  `https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf`

### 4. Kapak Görseli
- `public/images/` klasörüne koyarsanız: `/images/kapak.jpg`
- Veya placeholder: `https://placehold.co/400x600?text=Kapak`

### 5. Görüntüle
- Ana sayfa → dergi kartına tıkla → PDF görüntüleyici
- Klavye: ← → ile sayfa değiştir
