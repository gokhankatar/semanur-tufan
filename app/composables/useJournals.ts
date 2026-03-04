import type { Journal } from '~/interfaces'
import { collection, getDocs, addDoc, query, orderBy, doc, getDoc, serverTimestamp } from 'firebase/firestore'

export function useJournals() {
  const { $firestore } = useNuxtApp()

  const fetchJournalById = async (id: string): Promise<Journal | null> => {
    const docSnap = await getDoc(doc($firestore, 'journals', id))
    if (!docSnap.exists()) return null
    return { ...docSnap.data(), id: docSnap.id } as Journal
  }

  const fetchJournals = async (): Promise<Journal[]> => {
    const q = query(
      collection($firestore, 'journals'),
      orderBy('journal_volume_number', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Journal[]
  }

  const addJournal = async (data: Omit<Journal, 'id'>) => {
    const docRef = await addDoc(collection($firestore, 'journals'), {
      ...data,
      created_at: serverTimestamp(),
    })
    return docRef.id
  }

  return { fetchJournals, fetchJournalById, addJournal }
}
