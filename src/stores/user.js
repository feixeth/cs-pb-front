import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../services/authApi'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  
  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userProfile = computed(() => user.value)
  
  // Actions
  function setUser(userData) {
    user.value = userData
  }
  
  function setToken(tokenValue) {
    token.value = tokenValue
  }
  
  function checkAuth() {
    // In a real app, validate the token with backend
    // For now, we'll just check if we have a token
    return !!token.value
  }
  
  async function login(credentials) {
    try {
      const response = await authApi.login(credentials)
      setToken(response.token)
      setUser(response.user)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }
  
  async function register(userData) {
    try {
      const response = await authApi.register(userData)
      setToken(response.token)
      setUser(response.user)
      return true
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }
  
  function logout() {
    // Clear user data and token
    user.value = null
    token.value = null
  }
  
  async function updateProfile(profileData) {
    try {
      const updatedUser = await authApi.updateProfile(profileData)
      setUser(updatedUser)
      return true
    } catch (error) {
      console.error('Update profile error:', error)
      return false
    }
  }
  
  return {
    user,
    token,
    isAuthenticated,
    userProfile,
    setUser,
    setToken,
    checkAuth,
    login,
    register,
    logout,
    updateProfile
  }
}, {
  persist: {
    storage: localStorage,
    paths: ['token', 'user']
  }
})