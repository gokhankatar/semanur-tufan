import type { Blog } from '~/interfaces'
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

export function useBlogs() {
  const { $firestore } = useNuxtApp()

  const fetchBlogById = async (id: string): Promise<Blog | null> => {
    const docSnap = await getDoc(doc($firestore, 'blogs', id))
    if (!docSnap.exists()) return null
    const data = docSnap.data() as Record<string, unknown>
    return { ...toPlainObject(data), id: docSnap.id } as Blog
  }

  const fetchBlogs = async (): Promise<Blog[]> => {
    const q = query(
      collection($firestore, 'blogs'),
      orderBy('created_at', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({
      ...toPlainObject(d.data() as Record<string, unknown>),
      id: d.id,
    })) as Blog[]
  }

  const addBlog = async (data: Omit<Blog, 'id'>) => {
    const docRef = await addDoc(collection($firestore, 'blogs'), {
      ...data,
      created_at: serverTimestamp(),
    })
    return docRef.id
  }

  const updateBlog = async (id: string, data: Partial<Omit<Blog, 'id'>>) => {
    await updateDoc(doc($firestore, 'blogs', id), data)
  }

  const deleteBlog = async (id: string) => {
    await deleteDoc(doc($firestore, 'blogs', id))
  }

  return { fetchBlogs, fetchBlogById, addBlog, updateBlog, deleteBlog }
}
