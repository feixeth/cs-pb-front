import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../services/authApi'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  function setUser(data) {
    user.value = data
  }
  
  const userProfile = ref(null)
  async function checkAuth() {
    try {
      const userData = await authApi.getUser()
      setUser(userData)
      return true
    } catch (e) {
      user.value = null
      return false
    }
  }
  

  async function login(credentials) {
    try {
      const userData = await authApi.login(credentials)
      setUser(userData)
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

  async function userInfo() {
    try { 
      const data = await authApi.getUser(); // /api/user doit renvoyer le UserResource
      userProfile.value = data
      return data
    } catch (error) {
      console.error('User info error:', error)
      throw error.response?.data || { message: 'Data fetching error' }
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
    checkAuth,
    userInfo,
    userProfile,
  }
}, {
  persist: {
    storage: localStorage,
    paths: ['user']
  }
})
