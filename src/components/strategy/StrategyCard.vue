<script setup>
import { defineProps, computed } from 'vue'
import { useUserStore } from '../../stores/user'

const props = defineProps({
  strategy: {
    type: Object,
    required: true
  }
})

const userStore = useUserStore()

// Format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Calculate votes score
const voteScore = computed(() => {
  return props.strategy.upvotes - props.strategy.downvotes
})

// Check if current user is the author
const isAuthor = computed(() => {
  if (!userStore.isAuthenticated) return false
  return userStore.user?.id === props.strategy.userId
})


const mapImages = {
  dust2: '/images/maps/dust2.jpg',
  mirage: '/images/maps/mirage.jpg',
  inferno: '/images/maps/inferno.jpg',
  nuke: '/images/maps/nuke.jpg',
  overpass: '/images/maps/overpass.jpg',
  vertigo: '/images/maps/vertigo.jpg',
  ancient: '/images/maps/ancient.jpg',
}


const mapImageUrl = computed(() => {
  return mapImages[props.strategy.map?.toLowerCase()]
})

</script>

<template>
  <router-link :to="`/strategies/${strategy.id}`" class="card group hover:translate-y-[-4px]">
    <!-- Card Header with Map Name -->
    <div class="h-48 relative overflow-hidden rounded-t-lg">
      <img 
        :src="mapImageUrl" 
        alt="Map preview" 
        class="w-full h-full object-cover"
      />
      <!-- Map Background -->
      <div class="absolute inset-0 opacity-70 bg-gradient-to-t from-csGray-900 to-transparent"></div>
      
      <!-- Strategy Type Badge -->
      <div class="absolute top-3 right-3 bg-csGray-900 bg-opacity-80 px-3 py-1 rounded-full text-xs font-medium">
        {{ strategy.type }}
      </div>
      
      <!-- Map Name -->
      <div class="absolute bottom-3 left-3">
        <div class="flex items-center mb-1">
          <span class="text-sm text-gray-400">Map:</span>
          <span class="ml-2 text-white font-medium capitalize">{{ strategy.map }}</span>
        </div>
        
        <!-- Visibility Badge -->
        <span 
          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
          :class="strategy.is_public ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'"
        >
          <svg 
            class="mr-1 h-3 w-3" 
            :class="strategy.is_public ? 'text-green-300' : 'text-gray-300'"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              v-if="strategy.is_public" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path 
              v-if="strategy.is_public"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
            <path 
              v-else
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
          {{ strategy.is_public ? 'Public' : 'Private' }}
        </span>
      </div>
    </div>
    
    <!-- Card Content -->
    <div class="p-5">
      <h3 class="text-lg font-heading font-medium mb-2 text-white group-hover:text-tacticalGreen-500 transition-colors duration-200">
        {{ strategy.title }}
      </h3>
      
      <p class="text-gray-400 text-sm mb-4 line-clamp-2">
        {{ strategy.description }}
      </p>
      
      <!-- Card Footer -->
      <div class="flex items-center justify-between mt-4">
        <!-- Date -->
        <span class="text-xs text-gray-500">
          {{ formatDate(strategy.createdAt) }}
        </span>
        
        <!-- Vote Count -->
        <div class="flex items-center space-x-1">
          <svg class="h-4 w-4 text-tacticalGreen-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12 7a1 1 0 01-1 1H9a1 1 0 01-1-1V6a1 1 0 011-1h2a1 1 0 011 1v1zm-3 5a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-1z" clip-rule="evenodd" />
            <path fill-rule="evenodd" d="M5 5a3 3 0 013-3h4a3 3 0 013 3v9a3 3 0 01-3 3H8a3 3 0 01-3-3V5zm3-1a1 1 0 00-1 1v9a1 1 0 001 1h4a1 1 0 001-1V5a1 1 0 00-1-1H8z" clip-rule="evenodd" />
          </svg>
          <span 
            class="text-sm font-medium" 
            :class="voteScore > 0 ? 'text-tacticalGreen-500' : voteScore < 0 ? 'text-red-500' : 'text-gray-400'"
          >
            {{ voteScore > 0 ? '+' : '' }}{{ voteScore }}
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>