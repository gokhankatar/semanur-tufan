const PAGE_TURN_SOUND = '/sounds/page-turn.mp3'

export function usePageTurnSound() {
  let audio: HTMLAudioElement | null = null

  const play = () => {
    if (import.meta.server) return
    try {
      if (!audio) {
        audio = new Audio(PAGE_TURN_SOUND)
      }
      audio.currentTime = 0
      audio.volume = 0.5
      audio.play().catch(() => {})
    } catch {
      // Ses dosyası yoksa sessizce geç
    }
  }

  return { playPageTurnSound: play }
}
