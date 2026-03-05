import type { Auth } from 'firebase/auth'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'

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
        authStore.setUser({
          email: user.email,
          uid: user.uid,
          lastSignInTime: user.metadata?.lastSignInTime,
        })
      } else {
        authStore.setUser(null)
        authStore.setUserProfile(null)
      }
    })

    return {
      provide: {
        authActions: {
          signIn: (email: string, password: string) =>
            signInWithEmailAndPassword(auth, email, password),
          signOut: () => signOut(auth),
          updatePassword: (newPassword: string) => {
            const u = auth.currentUser
            if (!u) throw new Error('Giriş yapılmamış')
            return updatePassword(u, newPassword)
          },
          reauthenticate: async (password: string) => {
            const u = auth.currentUser
            if (!u?.email) throw new Error('Giriş yapılmamış')
            const cred = EmailAuthProvider.credential(u.email, password)
            return reauthenticateWithCredential(u, cred)
          },
          updateEmail: async (newEmail: string, password: string) => {
            const u = auth.currentUser
            if (!u) throw new Error('Giriş yapılmamış')
            const cred = EmailAuthProvider.credential(u.email!, password)
            await reauthenticateWithCredential(u, cred)
            return updateEmail(u, newEmail)
          },
        },
      },
    }
  },
})
