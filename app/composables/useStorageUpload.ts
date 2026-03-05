export function useStorageUpload() {
  const uploadFile = async (
    file: File,
    path: string
  ): Promise<string> => {
    const { $storage, $auth } = useNuxtApp()
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage')

    const user = $auth.currentUser
    if (!user) throw new Error('Giriş yapmanız gerekiyor')

    const timestamp = Date.now()
    const ext = file.name.split('.').pop() || ''
    const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')
    const fullPath = `${path}/${timestamp}-${safeName}`

    const storageRef = ref($storage, fullPath)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  }

  return { uploadFile }
}
