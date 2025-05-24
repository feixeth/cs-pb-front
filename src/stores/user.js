import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../services/authApi'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  // ⚠️ CORRECTION: Initialiser avec un objet vide, pas un ref
  const userProfile = ref({})

  function setUser(data) {
    user.value = data
  }
  const isReady = ref(false) // Ajoute en haut

  async function loadUser() {
    try {
      const response = await authApi.getUser()
      setUser(response)
      userProfile.value = response?.data ?? response
      isReady.value = true
      return userProfile.value
    } catch (error) {
      user.value = null
      userProfile.value = {}
      isReady.value = true
      return null
    }
  }
  
  async function login(credentials) {
    try {
      await authApi.login(credentials)
      await loadUser() // récupère et met à jour user + userProfile
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  async function register(userData) {
    try {
      const userDataResponse = await authApi.register(userData)
      setUser(userDataResponse)
      return true
    } catch (error) {
      console.error('Register error:', error)
      throw error.response?.data || { message: 'Registration error' }
    }
  }
  async function logout() {
    try {
      await authApi.logout()
    } finally {
      user.value = null
    }
  }

  return {
    user,
    isAuthenticated,
    setUser,
    login,
    register,
    logout,
    loadUser,
    userProfile,
    isReady,
  }
}, {
  persist: {
    storage: localStorage,
    paths: ['user']
  }
})