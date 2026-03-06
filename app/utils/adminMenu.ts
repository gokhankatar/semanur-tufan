export type AdminSectionId = 'ozet' | 'dergi' | 'blog' | 'calisma' | 'todo' | 'profil' | 'ayarlar'

export type AdminMenuItem =
  | { type: 'nav'; id: AdminSectionId; icon: string; title: string }
  | { type: 'divider' }
  | { type: 'theme'; icon: string; title: string }

export const adminMenuItems: AdminMenuItem[] = [
  { type: 'nav', id: 'ozet', icon: 'mdi-view-dashboard', title: 'Özet' },
  { type: 'nav', id: 'dergi', icon: 'mdi-book-open-variant', title: 'Dergiler' },
  { type: 'nav', id: 'blog', icon: 'mdi-post', title: 'Bloglar' },
  { type: 'nav', id: 'calisma', icon: 'mdi-briefcase', title: 'Çalışmalar' },
  { type: 'nav', id: 'todo', icon: 'mdi-format-list-checks', title: 'Yapılacaklar' },
  { type: 'divider' },
  { type: 'nav', id: 'profil', icon: 'mdi-account', title: 'Profil' },
  { type: 'nav', id: 'ayarlar', icon: 'mdi-cog', title: 'Ayarlar' },
  { type: 'theme', icon: 'mdi-palette', title: 'Tema Değiştir' },
]
