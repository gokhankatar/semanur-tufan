import type { Todo } from '~/interfaces'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'

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

export function useTodos() {
  const { $firestore } = useNuxtApp()

  const fetchTodos = async (): Promise<Todo[]> => {
    const snapshot = await getDocs(collection($firestore, 'todo'))
    const items = snapshot.docs.map((d) => ({
      ...toPlainObject(d.data() as Record<string, unknown>),
      id: d.id,
    })) as Todo[]
    return items.sort((a, b) => {
      const aTime = (a.created_at as { seconds?: number })?.seconds ?? 0
      const bTime = (b.created_at as { seconds?: number })?.seconds ?? 0
      return bTime - aTime
    })
  }

  const addTodo = async (title: string) => {
    const docRef = await addDoc(collection($firestore, 'todo'), {
      title,
      completed: false,
      created_at: serverTimestamp(),
    })
    return docRef.id
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    await updateDoc(doc($firestore, 'todo', id), { completed })
  }

  const deleteTodo = async (id: string) => {
    await deleteDoc(doc($firestore, 'todo', id))
  }

  return { fetchTodos, addTodo, toggleTodo, deleteTodo }
}
