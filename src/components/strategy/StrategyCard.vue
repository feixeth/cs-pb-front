<script setup>
import { ref, watch, computed } from 'vue'
import { defineProps } from 'vue'
import { useUserStore } from '@/stores/user'
import { useStrategiesStore } from '@/stores/strategies'

// Props
const props = defineProps({
  strategy: {
    type: Object,
    required: true
  }
})

// Stores
const userStore = useUserStore()
const strategiesStore = useStrategiesStore()

// Donnée locale réactive (pour rendre les votes dynamiques)
const localStrategy = ref({ ...props.strategy })

// Mettre à jour localStrategy si la prop change
watch(() => props.strategy, (newVal) => {
  localStrategy.value = { ...newVal }
})

// Méthode de vote
function handleVote(type) {
  strategiesStore.toggleVote(localStrategy.value.id, type).then((updated) => {
    if (updated) {
      localStrategy.value.upvotes = updated.upvotes
      localStrategy.value.downvotes = updated.downvotes
      localStrategy.value.user_vote = updated.user_vote
    }
  })
}

// Score calculé
const voteScore = computed(() => {
  return (localStrategy.value.upvotes ?? 0) - (localStrategy.value.downvotes ?? 0)
})

// Map preview
const mapImages = {
  dust2: '/images/maps/dust2.jpg',
  mirage: '/images/maps/mirage.jpg',
  inferno: '/images/maps/inferno.jpg',
  nuke: '/images/maps/nuke.jpg',
  overpass: '/images/maps/overpass.jpg',
  vertigo: '/images/maps/vertigo.jpg',
  ancient: '/images/maps/ancient.jpg',
  anubis: '/images/maps/anubis.jpg',
}

const mapImageUrl = computed(() => {
  return mapImages[localStrategy.value.map?.toLowerCase()]
})

// Format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<template>
  <router-link :to="`/strategies/${localStrategy.id}`" class="card group hover:translate-y-[-4px]">
    <div class="h-48 relative overflow-hidden rounded-t-lg">
      <img :src="mapImageUrl" alt="Map preview" class="w-full h-full object-cover" />
      <div class="absolute inset-0 opacity-70 bg-gradient-to-t from-csGray-900 to-transparent"></div>
      <div class="absolute top-3 right-3 bg-csGray-900 bg-opacity-80 px-3 py-1 rounded-full text-xs font-medium">
        {{ localStrategy.type }}
      </div>
      <div class="absolute bottom-3 left-3">
        <div class="flex items-center mb-1">
          <span class="text-sm text-gray-400">Map:</span>
          <span class="ml-2 text-white font-medium capitalize">{{ localStrategy.map }}</span>
        </div>
        <span 
          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
          :class="localStrategy.is_public ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'"
        >
          {{ localStrategy.is_public ? 'Public' : 'Private' }}
        </span>
      </div>
    </div>

    <div class="p-5">
      <h3 class="text-lg font-heading font-medium mb-2 text-white group-hover:text-tacticalGreen-500 transition-colors duration-200">
        {{ localStrategy.title }}
      </h3>
      <p class="text-gray-400 text-sm mb-4 line-clamp-2">
        {{ localStrategy.description }}
      </p>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-4">
        <span class="text-xs text-gray-500">{{ formatDate(localStrategy.createdAt) }}</span>
        <div class="flex items-center space-x-2">
          <!-- Upvote Button -->
          <button
            @click.stop.prevent="handleVote('upvote')"
            class="p-1 rounded transition-colors"
            :class="[
              localStrategy.user_vote === 1 ? 'text-green-600 bg-green-100' : 'text-green-400 hover:bg-green-900'
            ]"
            title="Vote positif"
          >
            👍
          </button>

          <!-- Score -->
          <span 
            class="text-sm font-medium"
            :class="voteScore > 0 ? 'text-tacticalGreen-500' : voteScore < 0 ? 'text-red-500' : 'text-gray-400'"
          >
            {{ voteScore > 0 ? '+' : '' }}{{ voteScore }}
          </span>

          <!-- Downvote Button -->
          <button
            @click.stop.prevent="handleVote('downvote')"
            class="p-1 rounded transition-colors"
            :class="[
              localStrategy.user_vote === -1 ? 'text-red-600 bg-red-100' : 'text-red-400 hover:bg-red-900'
            ]"
            title="Vote négatif"
          >
            👎
          </button>

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
