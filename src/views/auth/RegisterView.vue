<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const router = useRouter()

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const error = ref('')
const passwordsMatch = ref(true)

const validateForm = () => {
  if (registerForm.password !== registerForm.confirmPassword) {
    passwordsMatch.value = false
    return false
  }
  
  passwordsMatch.value = true
  return true
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  error.value = ''
  isLoading.value = true
  
  try {
    const success = await userStore.register({
      name: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      password_confirmation:registerForm.confirmPassword
    })
    if (userStore.isAuthenticated) {
      error.value = 'You are already logged in.'
      return
    }
    if (success) {
      router.push('/')
    } else {
      error.value = 'Registration failed. Please try again.'
    }
  } catch (err) {
    error.value = err.message || 'An error occurred during registration.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <img class="mx-auto h-14 w-auto" src="/logo.png" alt="CS Playbook Logo" />
        <h2 class="mt-6 text-3xl font-heading font-bold">Create your account</h2>
        <p class="mt-2 text-sm text-gray-400">
          Or
          <router-link to="/login" class="font-medium text-tacticalGreen-500 hover:text-tacticalGreen-400">
            sign in to existing account
          </router-link>
        </p>
      </div>
      
      <div class="bg-csGray-800 shadow rounded-lg p-6">
        <!-- Error Alert -->
        <div v-if="error" class="mb-4 bg-red-900 bg-opacity-50 border border-red-700 text-red-200 px-4 py-3 rounded">
          {{ error }}
        </div>
        
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Username Input -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              id="username"
              v-model="registerForm.username"
              type="text"
              required
              class="input"
              placeholder="Your username"
              minlength="3"
            />
          </div>
          
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              v-model="registerForm.email"
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
              v-model="registerForm.password"
              type="password"
              required
              class="input"
              placeholder="••••••••"
              minlength="6"
            />
          </div>
          
          <!-- Confirm Password Input -->
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              v-model="registerForm.confirmPassword"
              type="password"
              required
              class="input"
              :class="{ 'border-red-500 focus:ring-red-500': !passwordsMatch }"
              placeholder="••••••••"
              minlength="6"
            />
            <p v-if="!passwordsMatch" class="mt-1 text-sm text-red-500">
              Passwords don't match
            </p>
          </div>
          
          <!-- Terms & Conditions -->
          <div class="flex items-center">
            <input
              id="terms"
              type="checkbox"
              required
              class="h-4 w-4 rounded border-gray-600 bg-csGray-700 text-tacticalGreen-500 focus:ring-tacticalGreen-500 focus:ring-offset-csGray-800"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-400">
              I agree to the
              <a href="#" class="font-medium text-tacticalGreen-500 hover:text-tacticalGreen-400">
                Terms of Service
              </a>
              and
              <a href="#" class="font-medium text-tacticalGreen-500 hover:text-tacticalGreen-400">
                Privacy Policy
              </a>
            </label>
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
                Creating account...
              </span>
              <span v-else>Create account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>