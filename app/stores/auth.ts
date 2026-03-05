export interface AuthUser {
  email: string
  uid: string
  lastSignInTime?: string
}

export interface UserProfile {
  avatar_url?: string
  name?: string
  surname?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    userProfile: null as UserProfile | null,
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
    setUser(user: AuthUser | null) {
      this.user = user
    },
    setUserProfile(profile: UserProfile | null) {
      this.userProfile = profile
    },
    setLoading(loading: boolean) {
      this.loading = loading
    },
  },
})
