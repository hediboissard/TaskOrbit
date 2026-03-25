import { ref, computed } from 'vue'

const user = ref<any>(null)
const token = ref<string | null>(null)

export const useAuth = () => {
  const api = useApi()
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const loadFromStorage = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')
      if (storedToken) token.value = storedToken
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
        } catch {
          user.value = null
        }
      }
    }
  }

  const login = async (email: string, password: string) => {
    const data = await api.post('/auth/login', { email, password })
    token.value = data.token
    user.value = data.user
    if (process.client) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
    }
    return data
  }

  const register = async (username: string, email: string, password: string) => {
    const data = await api.post('/auth/register', { username, email, password })
    token.value = data.token
    user.value = data.user
    if (process.client) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
    }
    return data
  }

  const logout = () => {
    token.value = null
    user.value = null
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
    router.push('/')
  }

  // Load auth state from localStorage on first use (client-side)
  if (process.client && !token.value) {
    loadFromStorage()
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    loadFromStorage,
  }
}
