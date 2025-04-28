<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useStrategiesStore } from '../../stores/strategies'

const router = useRouter()
const userStore = useUserStore()
const strategiesStore = useStrategiesStore()

const user = computed(() => userStore.userProfile)

// Fetch user strategies
onMounted(async () => {
  if (strategiesStore.allStrategies.length === 0) {
    await strategiesStore.fetchStrategies()
  }
})

// Get user strategies
const userStrategies = computed(() => {
  if (!user.value) return []
  return strategiesStore.getStrategiesByUserId(user.value.id)
})

// Count public and private strategies
const publicCount = computed(() => 
  userStrategies.value.filter(s => s.isPublic).length
)

const privateCount = computed(() => 
  userStrategies.value.filter(s => !s.isPublic).length
)

// Navigate to create strategy
const createStrategy = () => {
  router.push({ name: 'create-strategy' })
}
</script>

<template>
  <div class="container mx-auto px-4 py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-heading font-bold mb-2">Dashboard</h1>
      <p class="text-gray-400">
        Welcome back, {{ user?.username || 'User' }}! Here's an overview of your CS Playbook activity.
      </p>
    </div>
    
    <!-- Dashboard Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <!-- Strategy Stats Card -->
      <div class="bg-csGray-800 rounded-lg p-6">
        <div class="flex items-center mb-4">
          <div class="h-10 w-10 rounded-full bg-tacticalGreen-800 flex items-center justify-center mr-3">
            <svg class="h-5 w-5 text-tacticalGreen-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold">Your Strategies</h2>
        </div>
        <div class="flex items-center justify-between">
          <div class="text-3xl font-bold">{{ userStrategies.length }}</div>
          <div class="text-sm text-gray-400">
            <div>{{ publicCount }} public</div>
            <div>{{ privateCount }} private</div>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions Card -->
      <div class="bg-csGray-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
        <div class="space-y-2">
          <button @click="createStrategy" class="w-full btn-primary justify-center flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Strategy
          </button>
          <router-link to="/my-strategies" class="w-full btn-outline justify-center flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View My Strategies
          </router-link>
        </div>
      </div>
      
      <!-- Account Info Card -->
      <div class="bg-csGray-800 rounded-lg p-6">
        <div class="flex items-center mb-4">
          <img 
            :src="user?.avatar" 
            alt="Profile" 
            class="h-10 w-10 rounded-full object-cover mr-3"
          />
          <h2 class="text-xl font-semibold">Account Info</h2>
        </div>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">Username:</span>
            <span class="text-white">{{ user?.username }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Email:</span>
            <span class="text-white">{{ user?.email }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Member since:</span>
            <span class="text-white">{{ new Date(user?.createdAt).toLocaleDateString() }}</span>
          </div>
        </div>
        <div class="mt-4">
          <router-link to="/profile" class="text-tacticalGreen-500 hover:text-tacticalGreen-400 text-sm font-medium flex items-center">
            Edit Profile
            <svg class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Recent Strategies -->
    <div class="mb-10">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-heading font-semibold">Recent Strategies</h2>
        <router-link to="/my-strategies" class="text-tacticalGreen-500 hover:text-tacticalGreen-400 text-sm font-medium flex items-center">
          View All
          <svg class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
      
      <div v-if="userStrategies.length > 0" class="space-y-4">
        <div 
          v-for="strategy in userStrategies.slice(0, 3)" 
          :key="strategy.id"
          class="bg-csGray-800 rounded-lg p-4 hover:bg-csGray-700 transition-colors duration-200"
        >
          <router-link :to="`/strategies/${strategy.id}`" class="block">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-lg text-white">{{ strategy.title }}</h3>
                <div class="flex items-center mt-1 text-sm">
                  <span class="text-gray-400 capitalize">{{ strategy.map }}</span>
                  <span class="mx-2 text-gray-600">•</span>
                  <span class="text-gray-400">{{ strategy.type }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  :class="strategy.isPublic ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'"
                >
                  {{ strategy.isPublic ? 'Public' : 'Private' }}
                </span>
                <div class="flex items-center space-x-1 text-gray-400">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span class="text-xs">{{ strategy.upvotes - strategy.downvotes }}</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      
      <div v-else class="bg-csGray-800 rounded-lg p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-300">No strategies yet</h3>
        <p class="mt-1 text-gray-500">
          Start by creating your first strategy.
        </p>
        <button @click="createStrategy" class="mt-4 btn-primary">
          Create First Strategy
        </button>
      </div>
    </div>
  </div>
</template>