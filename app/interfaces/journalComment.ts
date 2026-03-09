export interface IncomingComment {
  id?: string;
  journal_id: string;
  journal_title: string;
  author_name?: string | null;
  is_anonymous: boolean;
  comment_text: string;
  created_at?: string | { seconds: number; nanoseconds?: number };
  status?: "pending" | "approved" | "rejected";
}

export interface JournalComment {
  id: string;
  author_name: string;
  comment_text: string;
  created_at: string;
  visible: boolean;
}
