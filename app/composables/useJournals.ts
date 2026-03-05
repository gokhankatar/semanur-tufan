import type { Journal } from '~/interfaces'
import { collection, getDocs, addDoc, query, orderBy, doc, getDoc, serverTimestamp } from 'firebase/firestore'

function toPlainObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object' && 'seconds' in v && 'nanoseconds' in v) {
      result[k] = { seconds: (v as { seconds: number }).seconds, nanoseconds: (v as { nanoseconds: number }).nanoseconds }
    } else {
      result[k] = v
    }
  }
  return result
}

export function useJournals() {
  const { $firestore } = useNuxtApp()

  const fetchJournalById = async (id: string): Promise<Journal | null> => {
    const docSnap = await getDoc(doc($firestore, 'journals', id))
    if (!docSnap.exists()) return null
    const data = docSnap.data() as Record<string, unknown>
    return { ...toPlainObject(data), id: docSnap.id } as Journal
  }

  const fetchJournals = async (): Promise<Journal[]> => {
    const q = query(
      collection($firestore, 'journals'),
      orderBy('journal_volume_number', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({
      ...toPlainObject(d.data() as Record<string, unknown>),
      id: d.id,
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
