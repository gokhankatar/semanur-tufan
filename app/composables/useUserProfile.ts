import type { UserProfile } from '~/stores/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export function useUserProfile() {
  const { $firestore } = useNuxtApp()
  const authStore = useAuthStore()

  const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const snap = await getDoc(doc($firestore, 'users', uid))
      const data = snap.exists() ? (snap.data() as UserProfile) : null
      authStore.setUserProfile(data)
      return data
    } catch {
      return null
    }
  }

  const updateAvatar = async (uid: string, avatarUrl: string): Promise<void> => {
    await setDoc(doc($firestore, 'users', uid), { avatar_url: avatarUrl }, { merge: true })
    authStore.setUserProfile({ ...(authStore.userProfile || {}), avatar_url: avatarUrl })
  }

  const profile = computed(() => authStore.userProfile)

  return { fetchProfile, updateAvatar, profile }
}
