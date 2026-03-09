import type { ArtworkRequest } from '~/interfaces/artwork'
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

export function useArtworkRequests() {
  const { $firestore } = useNuxtApp()

  const fetchArtworkRequests = async (): Promise<ArtworkRequest[]> => {
    const q = query(
      collection($firestore, 'incoming_artwork_requests'),
      orderBy('created_at', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => {
      const data = d.data() as Record<string, unknown>
      const created = data.created_at as { seconds?: number } | undefined
      const createdStr = created?.seconds ? new Date(created.seconds * 1000).toISOString() : undefined
      const plain = toPlainObject(data)
      return { ...plain, id: d.id, created_at: createdStr } as ArtworkRequest
    })
  }

  const addArtworkRequest = async (data: Omit<ArtworkRequest, 'id'>) => {
    const docRef = await addDoc(collection($firestore, 'incoming_artwork_requests'), {
      ...data,
      status: 'pending',
      created_at: serverTimestamp(),
    })
    return docRef.id
  }

  const deleteArtworkRequest = async (id: string) => {
    await deleteDoc(doc($firestore, 'incoming_artwork_requests', id))
  }

  return { fetchArtworkRequests, addArtworkRequest, deleteArtworkRequest }
}
