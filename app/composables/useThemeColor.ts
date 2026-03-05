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

  const applyPrimary = (color: string) => {
    const current = theme.global.current.value
    if (current?.colors) (current.colors as Record<string, string>).primary = color
  }

  const setPrimaryForTheme = (themeName: 'dark' | 'light', color: string) => {
    if (import.meta.server) return
    const stored = getStoredPrimary()
    stored[themeName] = color
    localStorage.setItem(PRIMARY_KEY, JSON.stringify(stored))
    const name = theme.global.name.value
    if (name === themeName) applyPrimary(color)
  }

  const loadStoredPrimary = () => {
    if (import.meta.server) return
    const stored = getStoredPrimary()
    const name = theme.global.name.value
    const color = name === 'dark' ? stored.dark : stored.light
    applyPrimary(color)
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
