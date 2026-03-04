import type { Auth } from 'firebase/auth'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'

export default defineNuxtPlugin({
  name: 'auth',
  order: 5,
  dependsOn: ['firebase'],
  setup() {
    const nuxt = useNuxtApp()
    const auth = nuxt.$auth as Auth
    const authStore = useAuthStore()

    onAuthStateChanged(auth, (user) => {
      authStore.setLoading(false)
      if (user?.email) {
        authStore.setUser({ email: user.email, uid: user.uid })
      } else {
        authStore.setUser(null)
      }
    })

    return {
      provide: {
        authActions: {
          signIn: (email: string, password: string) =>
            signInWithEmailAndPassword(auth, email, password),
          signOut: () => signOut(auth),
        },
      },
    }
  },
})
