<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const loginForm = reactive({
  email: '',
  password: ''
})

const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    const success = await userStore.login(loginForm)
    
    if (success) {
      // Redirect to the intended page or dashboard
      router.push('/')
    } else {
      error.value = 'Invalid credentials. Please try again.'
    }
  } catch (err) {
    error.value = err.message || 'An error occurred during login.'
  } finally {
    isLoading.value = false
  }
}

const handleDemoLogin = async () => {
  loginForm.email = 'demo@example.com'
  loginForm.password = 'password'
  await handleLogin()
}
</script>

<template>
  <div class="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <img class="mx-auto h-14 w-auto" src="/logo.png" alt="CS Playbook Logo" />
        <h2 class="mt-6 text-3xl font-heading font-bold">Sign in to your account</h2>
        <p class="mt-2 text-sm text-gray-400">
          Or
          <router-link to="/register" class="font-medium text-tacticalGreen-500 hover:text-tacticalGreen-400">
            create a new account
          </router-link>
        </p>
      </div>
      
      <div class="bg-csGray-800 shadow rounded-lg p-6">
        <!-- Error Alert -->
        <div v-if="error" class="mb-4 bg-red-900 bg-opacity-50 border border-red-700 text-red-200 px-4 py-3 rounded">
          {{ error }}
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              required
              class="input"
              placeholder="your@email.com"
            />
          </div>
          
          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              required
              class="input"
              placeholder="••••••••"
            />
          </div>
          
          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-600 bg-csGray-700 text-tacticalGreen-500 focus:ring-tacticalGreen-500 focus:ring-offset-csGray-800"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>
            <a href="#" class="text-sm font-medium text-tacticalGreen-500 hover:text-tacticalGreen-400">
              Forgot password?
            </a>
          </div>
          
          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              class="w-full btn-primary py-2.5 text-center"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
              <span v-else>Sign in</span>
            </button>
          </div>
          
          <!-- Demo Account Button -->
          <div>
            <button
              type="button"
              @click="handleDemoLogin"
              class="w-full btn bg-csGray-600 hover:bg-csGray-500 text-white py-2.5 text-center"
              :disabled="isLoading"
            >
              Use Demo Account
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>