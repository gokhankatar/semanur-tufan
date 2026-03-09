export interface ArtworkRequest {
  id?: string;
  name: string;
  email: string;
  eser_turu: string;
  eser_baslik: string;
  aciklama: string;
  pdf_url: string;
  ozgecmis: string;
  created_at?: string;
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}
