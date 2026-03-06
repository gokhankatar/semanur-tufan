import { collection, getDocs, getCountFromServer } from 'firebase/firestore'

export function useAdminStats() {
  const { $firestore } = useNuxtApp()

  const fetchJournalCount = async (): Promise<number> => {
    try {
      const snapshot = await getCountFromServer(collection($firestore, 'journals'))
      return snapshot.data().count
    } catch {
      return 0
    }
  }

  const fetchBlogCount = async (): Promise<number> => {
    try {
      const snapshot = await getCountFromServer(collection($firestore, 'blogs'))
      return snapshot.data().count
    } catch {
      return 0
    }
  }

  const fetchCalismaCount = async (): Promise<number> => {
    try {
      const snapshot = await getCountFromServer(collection($firestore, 'works'))
      return snapshot.data().count
    } catch {
      return 0
    }
  }

  const fetchTodoCount = async (): Promise<number> => {
    try {
      const snapshot = await getCountFromServer(collection($firestore, 'todo'))
      return snapshot.data().count
    } catch {
      return 0
    }
  }

  const fetchAllStats = async () => {
    const [journalCount, blogCount, calismaCount, todoCount] = await Promise.all([
      fetchJournalCount(),
      fetchBlogCount(),
      fetchCalismaCount(),
      fetchTodoCount(),
    ])
    return { journalCount, blogCount, calismaCount, todoCount }
  }

  return { fetchJournalCount, fetchBlogCount, fetchCalismaCount, fetchTodoCount, fetchAllStats }
}
