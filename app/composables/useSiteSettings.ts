const SITE_SETTINGS_DOC = 'theme'

export type SiteSettings = {
  primary_dark?: string
  primary_light?: string
}

const DEFAULT_PRIMARY = {
  dark: '#69F0AE',
  light: '#3156FA',
}

export function useSiteSettings() {
  const { $firestore } = useNuxtApp()

  const fetchSiteSettings = async (): Promise<SiteSettings | null> => {
    if (import.meta.server) return null
    try {
      const { doc, getDoc } = await import('firebase/firestore')
      const docRef = doc($firestore, 'site-settings', SITE_SETTINGS_DOC)
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        return snap.data() as SiteSettings
      }
    } catch (e) {
      console.warn('Site settings fetch failed:', e)
    }
    return null
  }

  const fetchPrimaryColors = async (): Promise<{ dark: string; light: string } | null> => {
    const settings = await fetchSiteSettings()
    if (settings?.primary_dark && settings?.primary_light) {
      return {
        dark: settings.primary_dark,
        light: settings.primary_light,
      }
    }
    return null
  }

  const savePrimaryColors = async (dark: string, light: string) => {
    if (import.meta.server) return
    try {
      const { doc, setDoc } = await import('firebase/firestore')
      const docRef = doc($firestore, 'site-settings', SITE_SETTINGS_DOC)
      await setDoc(docRef, { primary_dark: dark, primary_light: light }, { merge: true })
    } catch (e) {
      console.error('Site settings save failed:', e)
      throw e
    }
  }

  return {
    fetchSiteSettings,
    fetchPrimaryColors,
    savePrimaryColors,
    defaultPrimary: DEFAULT_PRIMARY,
  }
}
