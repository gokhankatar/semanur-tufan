import type { Work } from '~/interfaces'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, doc, getDoc, serverTimestamp } from 'firebase/firestore'

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

export function useWorks() {
  const { $firestore } = useNuxtApp()

  const fetchWorkById = async (id: string): Promise<Work | null> => {
    const docSnap = await getDoc(doc($firestore, 'works', id))
    if (!docSnap.exists()) return null
    const data = docSnap.data() as Record<string, unknown>
    return { ...toPlainObject(data), id: docSnap.id } as Work
  }

  const fetchWorks = async (): Promise<Work[]> => {
    const q = query(
      collection($firestore, 'works'),
      orderBy('created_at', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({
      ...toPlainObject(d.data() as Record<string, unknown>),
      id: d.id,
    })) as Work[]
  }

  const addWork = async (data: Omit<Work, 'id'>) => {
    const docRef = await addDoc(collection($firestore, 'works'), {
      ...data,
      created_at: serverTimestamp(),
    })
    return docRef.id
  }

  const updateWork = async (id: string, data: Partial<Omit<Work, 'id'>>) => {
    await updateDoc(doc($firestore, 'works', id), data)
  }

  const deleteWork = async (id: string) => {
    await deleteDoc(doc($firestore, 'works', id))
  }

  return { fetchWorks, fetchWorkById, addWork, updateWork, deleteWork }
}
