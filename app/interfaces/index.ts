export interface Journal {
  id?: string
  journal_cover_img: string
  journal_keywords: string[]
  journal_summary: string
  journal_title: string
  journal_volume_number: number
  pdf_url: string
  publisher_name: string
  created_at?: { seconds: number; nanoseconds: number }
}
