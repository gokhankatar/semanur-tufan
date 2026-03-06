export interface Journal {
  id?: string
  journal_cover_img: string
  journal_keywords: string[]
  journal_summary: string
  journal_title: string
  journal_volume_number: number
  pdf_url: string
  publisher_name: string
  view_count?: number
  created_at?: { seconds: number; nanoseconds: number }
}

export interface Blog {
  id?: string
  cover_img: string
  blog_title: string
  blog_content: string
  blog_keywords: string[]
  created_at?: { seconds: number; nanoseconds: number }
}

export interface Work {
  id?: string
  cover_img: string
  work_title: string
  work_content: string
  work_keywords: string[]
  created_at?: { seconds: number; nanoseconds: number }
}

export interface Todo {
  id?: string
  title: string
  completed: boolean
  created_at?: { seconds: number; nanoseconds: number }
}
