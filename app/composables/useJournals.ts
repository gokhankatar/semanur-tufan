import type { Journal } from '~/interfaces'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp, increment } from 'firebase/firestore'

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
    const snapshot = await getDocs(collection($firestore, 'journals'))
    const items = snapshot.docs.map((d) => ({
      ...toPlainObject(d.data() as Record<string, unknown>),
      id: d.id,
    })) as Journal[]
    return items.sort((a, b) => (b.journal_volume_number ?? 0) - (a.journal_volume_number ?? 0))
  }

  const addJournal = async (data: Omit<Journal, 'id'>) => {
    const docRef = await addDoc(collection($firestore, 'journals'), {
      ...data,
      view_count: 0,
      created_at: serverTimestamp(),
    })
    return docRef.id
  }

  const incrementJournalView = async (id: string) => {
    await updateDoc(doc($firestore, 'journals', id), { view_count: increment(1) })
  }

  const updateJournal = async (id: string, data: Partial<Omit<Journal, 'id'>>) => {
    await updateDoc(doc($firestore, 'journals', id), data)
  }

  const deleteJournal = async (id: string) => {
    await deleteDoc(doc($firestore, 'journals', id))
  }

  return { fetchJournals, fetchJournalById, addJournal, updateJournal, deleteJournal, incrementJournalView }
}
