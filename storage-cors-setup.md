# Firebase Storage CORS Kurulumu

PDF ve görsel yüklemeleri için Firebase Storage CORS hatası alıyorsanız, aşağıdaki adımları uygulayın.

## 1. Google Cloud SDK / gsutil Kurulumu

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) indirip kurun
- Veya [gsutil tek başına](https://cloud.google.com/storage/docs/gsutil_install) kurabilirsiniz

## 2. Google Cloud'a Giriş

```bash
gcloud auth login
```

## 3. Proje Seçimi

```bash
gcloud config set project semanur-tufan-a85df
```

## 4. CORS Konfigürasyonunu Uygulama

Proje kök dizininde:

```bash
gsutil cors set storage-cors.json gs://semanur-tufan-a85df.firebasestorage.app
```

## Alternatif: Google Cloud Console

1. [Google Cloud Console](https://console.cloud.google.com/) → Storage → Buckets
2. `semanur-tufan-a85df.firebasestorage.app` bucket'ını seçin
3. Permissions / CORS sekmesinden `storage-cors.json` içeriğini ekleyin

## Not

- `"origin": ["*"]` tüm origin'lere izin verir (geliştirme için uygun)
- Production'da kendi domain'inizi ekleyin: `["https://siteniz.com", "http://localhost:5000"]`
