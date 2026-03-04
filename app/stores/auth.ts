export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { email: string; uid: string } | null,
    loading: true,
  }),
  getters: {
    isAdmin: (state) => {
      const config = useRuntimeConfig()
      const adminEmail = config.public.adminEmail as string
      return !!state.user && state.user.email === adminEmail
    },
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    setUser(user: { email: string; uid: string } | null) {
      this.user = user
    },
    setLoading(loading: boolean) {
      this.loading = loading
    },
  },
  // Firebase auth state ile senkron - persist gerekmez
})
