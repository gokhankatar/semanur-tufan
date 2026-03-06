export type AdminSectionId = 'ozet' | 'dergi' | 'blog' | 'calisma' | 'profil' | 'ayarlar'

export type AdminMenuItem =
  | { type: 'nav'; id: AdminSectionId; icon: string; title: string }
  | { type: 'divider' }
  | { type: 'theme'; icon: string; title: string }

export const adminMenuItems: AdminMenuItem[] = [
  { type: 'nav', id: 'ozet', icon: 'mdi-view-dashboard', title: 'Özet' },
  { type: 'nav', id: 'dergi', icon: 'mdi-book-open-variant', title: 'Dergi Ekle' },
  { type: 'nav', id: 'blog', icon: 'mdi-post', title: 'Blog Yazısı Ekle' },
  { type: 'nav', id: 'calisma', icon: 'mdi-briefcase', title: 'Çalışma Ekle' },
  { type: 'divider' },
  { type: 'nav', id: 'profil', icon: 'mdi-account', title: 'Profil' },
  { type: 'nav', id: 'ayarlar', icon: 'mdi-cog', title: 'Ayarlar' },
  { type: 'theme', icon: 'mdi-palette', title: 'Tema Değiştir' },
]
