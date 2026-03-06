import type { Subscriber } from '~/interfaces'
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore'

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

export function useSubscribers() {
  const { $firestore } = useNuxtApp()

  const fetchSubscribers = async (): Promise<Subscriber[]> => {
    const q = query(
      collection($firestore, 'subscribers'),
      orderBy('created_at', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({
      ...toPlainObject(d.data() as Record<string, unknown>),
      id: d.id,
    })) as Subscriber[]
  }

  const addSubscriber = async (data: Omit<Subscriber, 'id'>) => {
    const docRef = await addDoc(collection($firestore, 'subscribers'), {
      ...data,
      created_at: serverTimestamp(),
    })
    return docRef.id
  }

  const deleteSubscriber = async (id: string) => {
    await deleteDoc(doc($firestore, 'subscribers', id))
  }

  return { fetchSubscribers, addSubscriber, deleteSubscriber }
}
