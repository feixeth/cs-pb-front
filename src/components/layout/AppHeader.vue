<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'


const router = useRouter()
const userStore = useUserStore()
const mobileMenuOpen = ref(false)

const isAuthenticated = computed(() => userStore.isAuthenticated)
const user = computed(() => userStore.userProfile)


const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const logout = () => {
  userStore.logout()
  router.push({ name: 'home' })
  closeMobileMenu()
}
</script>

<template>
  <header class="bg-csGray-900 border-b border-csGray-700 sticky top-0 z-50">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <router-link 
          to="/" 
          class="flex items-center space-x-2" 
          @click="closeMobileMenu"
        >
          <img src="/logo.png" alt="CS Playbook Logo" class="h-8 w-8" />
          <span class="font-heading font-bold text-xl text-white hidden sm:inline">CS Playbook</span>
        </router-link>
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-6 items-center">
          <router-link 
            to="/" 
            class="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Home
          </router-link>
          <router-link 
            to="/strategies" 
            class="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Strategies
          </router-link>

          <!-- test pour voir si bien auth  -->
          <!-- <p class="text-xs text-gray-400">isAuthenticated: {{ userStore.isAuthenticated }}</p> -->

          <!-- Authenticated Navigation -->
          <template v-if="userStore.isAuthenticated">
            <router-link 
              to="/create-strategy" 
              class="btn-primary text-sm"
            >
              Create Strategy
            </router-link>
            <div class="relative group">
              <button 
                class="flex items-center space-x-2 text-gray-300 hover:text-white"
                aria-haspopup="true"
              >
                <span>{{ user?.username }}</span>
                <img 
                  :src="user?.avatar" 
                  alt="Profile" 
                  class="w-8 h-8 rounded-full object-cover"
                />
              </button>
              <div 
                class="absolute right-0 mt-2 w-48 bg-csGray-800 rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              >
                <router-link 
                  to="/dashboard" 
                  class="block px-4 py-2 text-sm text-gray-300 hover:bg-csGray-700 hover:text-white"
                >
                  Dashboard
                </router-link>
                <router-link 
                  to="/profile" 
                  class="block px-4 py-2 text-sm text-gray-300 hover:bg-csGray-700 hover:text-white"
                >
                  My Profile
                </router-link>
                <router-link 
                  to="/my-strategies" 
                  class="block px-4 py-2 text-sm text-gray-300 hover:bg-csGray-700 hover:text-white"
                >
                  My Strategies
                </router-link>
                <button 
                  @click="logout" 
                  class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-csGray-700 hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </template>
          
          <!-- Guest Navigation -->
          <template v-else>
            <router-link 
              to="/login" 
              class="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Login
            </router-link>
            <router-link
              v-if="!userStore.isAuthenticated" 
              to="/register"
              class="btn-primary text-sm"
            >
              Sign Up
            </router-link>
          </template>
        </nav>
        
        <!-- Mobile menu button -->
        <button 
          @click="toggleMobileMenu" 
          class="md:hidden text-gray-300 hover:text-white transition-colors duration-200"
          aria-expanded="false"
          aria-controls="mobile-menu"
        >
          <span class="sr-only">Open main menu</span>
          <!-- Menu icon -->
          <svg 
            v-if="!mobileMenuOpen" 
            class="h-6 w-6" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <!-- Close icon -->
          <svg 
            v-else 
            class="h-6 w-6" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Navigation -->
      <div 
        id="mobile-menu" 
        class="md:hidden" 
        :class="mobileMenuOpen ? 'block' : 'hidden'"
      >
        <div class="px-2 pt-2 pb-3 space-y-1 border-t border-csGray-700 mt-3">
          <router-link 
            to="/" 
            class="block px-3 py-2 rounded-md text-gray-300 hover:bg-csGray-700 hover:text-white"
            @click="closeMobileMenu"
          >
            Home
          </router-link>
          <router-link 
            to="/strategies" 
            class="block px-3 py-2 rounded-md text-gray-300 hover:bg-csGray-700 hover:text-white"
            @click="closeMobileMenu"
          >
            Strategies
          </router-link>
          
          <!-- Authenticated Navigation -->
          <template v-if="isAuthenticated">
            <router-link 
              to="/dashboard" 
              class="block px-3 py-2 rounded-md text-gray-300 hover:bg-csGray-700 hover:text-white"
              @click="closeMobileMenu"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/profile" 
              class="block px-3 py-2 rounded-md text-gray-300 hover:bg-csGray-700 hover:text-white"
              @click="closeMobileMenu"
            >
              My Profile
            </router-link>
            <router-link 
              to="/my-strategies" 
              class="block px-3 py-2 rounded-md text-gray-300 hover:bg-csGray-700 hover:text-white"
              @click="closeMobileMenu"
            >
              My Strategies
            </router-link>
            <router-link 
              to="/create-strategy" 
              class="block px-3 py-2 rounded-md bg-tacticalGreen-500 text-white font-medium hover:bg-tacticalGreen-600"
              @click="closeMobileMenu"
            >
              Create Strategy
            </router-link>
            <button 
              @click="logout" 
              class="block w-full text-left px-3 py-2 rounded-md text-gray-300 hover:bg-csGray-700 hover:text-white"
            >
              Logout
            </button>
          </template>
          
          <!-- Guest Navigation -->
          <template v-else>
            <router-link 
              to="/login" 
              class="block px-3 py-2 rounded-md text-gray-300 hover:bg-csGray-700 hover:text-white"
              @click="closeMobileMenu"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="block px-3 py-2 rounded-md bg-tacticalGreen-500 text-white font-medium hover:bg-tacticalGreen-600"
              @click="closeMobileMenu"
            >
              Sign Up
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>