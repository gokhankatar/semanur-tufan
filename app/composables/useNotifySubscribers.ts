export type NotifyType = 'dergi' | 'blog' | 'calisma'

export function useNotifySubscribers() {
  const { fetchSubscribers } = useSubscribers()

  const notifySubscribers = async (type: NotifyType, title: string) => {
    try {
      const subscribers = await fetchSubscribers()
      const emails = subscribers.map((s) => s.email).filter(Boolean)
      if (emails.length === 0) return

      await $fetch('/api/notify-subscribers', {
        method: 'POST',
        body: { type, title, emails },
      })
    } catch (e) {
      console.error('[notifySubscribers] Bildirim gönderilemedi:', e)
    }
  }

  return { notifySubscribers }
}
