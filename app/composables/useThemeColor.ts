const PRIMARY_KEY = 'semanur-tufan-primary'

const DEFAULT_PRIMARY = {
  dark: '#69F0AE',
  light: '#3156FA',
}

/** Admin panelinde seçilebilecek hazır renkler */
export const PRESET_COLORS = [
  { hex: '#69F0AE', name: 'Yeşil' },
  { hex: '#3156FA', name: 'Mavi' },
  { hex: '#6366F1', name: 'İndigo' },
  { hex: '#8B5CF6', name: 'Mor' },
  { hex: '#EC4899', name: 'Pembe' },
  { hex: '#F59E0B', name: 'Amber' },
  { hex: '#10B981', name: 'Zümrüt' },
  { hex: '#06B6D4', name: 'Turkuaz' },
  { hex: '#EF4444', name: 'Kırmızı' },
] as const

export function useThemeColor() {
  const theme = useTheme()
  const { fetchPrimaryColors, savePrimaryColors } = useSiteSettings()

  const getStoredPrimary = (): { dark: string; light: string } => {
    if (import.meta.server) return DEFAULT_PRIMARY
    try {
      const raw = localStorage.getItem(PRIMARY_KEY)
      if (!raw) return DEFAULT_PRIMARY
      const parsed = JSON.parse(raw) as { dark?: string; light?: string }
      return {
        dark: parsed.dark || DEFAULT_PRIMARY.dark,
        light: parsed.light || DEFAULT_PRIMARY.light,
      }
    } catch {
      return DEFAULT_PRIMARY
    }
  }

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return '105 240 174'
    return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
  }

  const applyPrimary = (color: string) => {
    const current = theme.global.current.value
    if (current?.colors) (current.colors as Record<string, string>).primary = color
    if (import.meta.client && typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--v-theme-primary', hexToRgb(color))
    }
  }

  const applyBothThemes = (dark: string, light: string) => {
    try {
      const themes = theme.themes as { value?: Record<string, { colors?: Record<string, string> }> } | undefined
      if (themes?.value?.dark?.colors) themes.value.dark.colors.primary = dark
      if (themes?.value?.light?.colors) themes.value.light.colors.primary = light
    } catch {
      // themes might not be exposed
    }
    const name = theme.global.name.value
    applyPrimary(name === 'dark' ? dark : light)
  }

  const setPrimaryForTheme = async (themeName: 'dark' | 'light', color: string) => {
    if (import.meta.server) return
    const stored = getStoredPrimary()
    stored[themeName] = color
    localStorage.setItem(PRIMARY_KEY, JSON.stringify(stored))
    applyBothThemes(stored.dark, stored.light)
    try {
      await savePrimaryColors(stored.dark, stored.light)
    } catch {
      // Firebase save failed, localStorage still updated
    }
  }

  const loadStoredPrimary = async () => {
    if (import.meta.server) return
    try {
      const fromFirebase = await fetchPrimaryColors()
      if (fromFirebase) {
        localStorage.setItem(PRIMARY_KEY, JSON.stringify(fromFirebase))
        applyBothThemes(fromFirebase.dark, fromFirebase.light)
        return
      }
    } catch {
      // Fall through to localStorage / nuxt.config defaults
    }
    const stored = getStoredPrimary()
    applyBothThemes(stored.dark, stored.light)
  }

  const currentPrimary = computed(() => {
    const current = theme.global.current.value
    return (current?.colors?.primary as string) || DEFAULT_PRIMARY.light
  })

  return {
    setPrimaryForTheme,
    getStoredPrimary,
    loadStoredPrimary,
    currentPrimary,
    defaultPrimary: DEFAULT_PRIMARY,
    presetColors: PRESET_COLORS,
  }
}
