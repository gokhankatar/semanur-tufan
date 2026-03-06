const BUCKET = 'semanur_tufan'

function randomId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().slice(0, 8)
  }
  return Math.random().toString(36).slice(2, 10)
}

export function useProfileUpload() {
  const { $supabase } = useNuxtApp()

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!file) throw new Error('Dosya yok!')
    if (!file.type.startsWith('image/')) throw new Error('Sadece resim dosyaları yüklenebilir.')

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `avatars/${Date.now()}_${randomId()}.${ext}`

    const { error } = await $supabase.storage.from(BUCKET).upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    })

    if (error) {
      console.error('Supabase upload hatası:', error)
      throw error
    }

    const { data: urlData } = $supabase.storage.from(BUCKET).getPublicUrl(fileName)
    if (!urlData?.publicUrl) throw new Error('Public URL alınamadı!')

    return urlData.publicUrl
  }

  /** Blog görselleri için - aynı bucket, blogs/ klasörü */
  const uploadBlogImage = async (file: File): Promise<string> => {
    if (!file) throw new Error('Dosya yok!')

    const fileName = `blogs/${Date.now()}_${file.name}`

    const { error } = await $supabase.storage.from(BUCKET).upload(fileName, file, {
      upsert: true,
    })

    if (error) {
      console.error('Supabase upload hatası:', error)
      throw error
    }

    const { data: urlData } = $supabase.storage.from(BUCKET).getPublicUrl(fileName)
    if (!urlData?.publicUrl) throw new Error('Public URL alınamadı!')

    return urlData.publicUrl
  }

  /** Genel dosya yükleme - PDF, resim vb. path: pdfs, covers, blogs vb. */
  const uploadFile = async (path: string, file: File): Promise<string> => {
    if (!file) throw new Error('Dosya yok!')

    const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')
    const fileName = `${path}/${Date.now()}_${safeName}`

    const { error } = await $supabase.storage.from(BUCKET).upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    })

    if (error) {
      console.error('Supabase upload hatası:', error)
      throw error
    }

    const { data: urlData } = $supabase.storage.from(BUCKET).getPublicUrl(fileName)
    if (!urlData?.publicUrl) throw new Error('Public URL alınamadı!')

    return urlData.publicUrl
  }

  return { uploadAvatar, uploadBlogImage, uploadFile }
}
