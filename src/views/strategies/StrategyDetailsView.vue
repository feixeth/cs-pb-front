<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStrategiesStore } from '../../stores/strategies'
import { useUserStore } from '../../stores/user'
import ShareButton from '../../components/layout/ShareButton.vue'

const route = useRoute()
const router = useRouter()
const strategiesStore = useStrategiesStore()
const userStore = useUserStore()

const strategyId = route.params.id
const strategy = ref(null)
const isLoading = ref(true)
const error = ref(null)
const activeLineupIndex = ref(0)

const currentUser = computed(() => userStore.user)

const isAuthor = computed(() => {
  if (!userStore.isAuthenticated || !strategy.value) return false
  return userStore.user?.id === strategy.value.userId
})

const voteScore = computed(() => {
  if (!strategy.value) return 0
  return (strategy.value.upvotes ?? 0) - (strategy.value.downvotes ?? 0)
})

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const fetchStrategyData = async () => {
  isLoading.value = true
  error.value = null

  try {
    strategy.value = await strategiesStore.fetchStrategyById(strategyId)
    if (!strategy.value) {
      error.value = 'Strategy not found'
    }
  } catch (err) {
    error.value = 'Failed to load strategy data'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const handleVote = async (type) => {
  if (!userStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  const res = await strategiesStore.toggleVote(strategyId, type)
  if (res) {
    strategy.value.upvotes = res.upvotes
    strategy.value.downvotes = res.downvotes
    strategy.value.user_vote = res.user_vote
  }
}

const showLineup = (index) => {
  activeLineupIndex.value = index
}

const editStrategy = () => {
  router.push({ name: 'edit-strategy', params: { id: strategyId } })
}

const deleteStrategy = async () => {
  if (confirm('Are you sure you want to delete this strategy? This action cannot be undone.')) {
    const success = await strategiesStore.deleteStrategy(strategyId)
    if (success) {
      router.push({ name: 'my-strategies' })
    }
  }
}

onMounted(fetchStrategyData)
</script>

<template>
  <div class="container mx-auto px-4 py-10">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tacticalGreen-500"></div>
    </div>

    <div v-else-if="error" class="text-center py-12 bg-csGray-800 rounded-lg">
      <svg class="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-red-300">{{ error }}</h3>
      <router-link to="/strategies" class="mt-4 inline-block btn-primary">
        Back to Strategies
      </router-link>
    </div>

    <template v-else-if="strategy">
      <div class="mb-6">
        <router-link to="/strategies" class="flex items-center text-tacticalGreen-500 hover:text-tacticalGreen-400 transition-colors">
          <svg class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all strategies
        </router-link>
      </div>

      <div class="bg-csGray-800 rounded-lg overflow-hidden mb-8">
        <div class="p-6">
          <div class="flex flex-wrap items-start justify-between mb-4">
            <div class="mb-4 md:mb-0">
              <div class="flex items-center mb-3">
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mr-2"
                  :class="strategy.is_public ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'"
                >
                  {{ strategy.is_public ? 'Public' : 'Private' }}
                </span>
                <span class="text-gray-400 capitalize">{{ strategy.map }}</span>
                <span class="mx-2 text-gray-600">•</span>
                <span class="text-gray-400">{{ strategy.type }}</span>
              </div>
              <h1 class="text-3xl font-heading font-bold text-white mb-2">{{ strategy.title }}</h1>
              <p class="text-gray-400 text-sm">
                Created on {{ formatDate(strategy.created_at) }}
                <span v-if="strategy.created_at !== strategy.updated_at">
                  • Updated on {{ formatDate(strategy.updated_at) }}
                </span>
              </p>
            </div>

            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2 bg-csGray-700 rounded-lg p-1">
                <button 
                  @click="handleVote('upvote')" 
                  class="p-2 rounded-md transition-colors"
                  :class="strategy.user_vote === 1 ? 'text-green-600 bg-green-100' : 'text-green-400 hover:bg-green-900'"
                  :title="`${strategy.upvotes ?? 0} upvotes`"
                  aria-label="Vote positif"
                >
                  👍
                </button>
                <span 
                  class="text-base font-medium min-w-[2rem] text-center"
                  :class="voteScore > 0 ? 'text-tacticalGreen-500' : voteScore < 0 ? 'text-red-500' : 'text-gray-400'"
                >
                  {{ voteScore > 0 ? '+' : '' }}{{ voteScore }}
                </span>
                <button 
                  @click="handleVote('downvote')" 
                  class="p-2 rounded-md transition-colors"
                  :class="strategy.user_vote === -1 ? 'text-red-600 bg-red-100' : 'text-red-400 hover:bg-red-900'"
                  :title="`${strategy.downvotes ?? 0} downvotes`"
                  aria-label="Vote négatif"
                >
                  👎
                </button>
              </div>

              <div v-if="isAuthor" class="flex items-center space-x-2">
                <button 
                  @click="editStrategy"
                  class="p-2 rounded-md text-gray-400 hover:text-white hover:bg-csGray-700 transition-colors"
                  aria-label="Edit Strategy"
                >
                  ✏️
                </button>
                <button 
                  @click="deleteStrategy"
                  class="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-csGray-700 transition-colors"
                  aria-label="Delete Strategy"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>

          <div class="bg-csGray-700 p-4 rounded-lg mb-6">
            <h2 class="text-xl font-semibold mb-2">Description</h2>
            <p class="text-gray-300 whitespace-pre-line">{{ strategy.description }}</p>
          </div>
          <ShareButton />

          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-4">Player Roles</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div 
                v-for="(player, index) in strategy.players" 
                :key="`player-${index}`"
                class="bg-csGray-700 p-4 rounded-lg"
              >
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-medium">Player {{ index + 1 }}</h3>
                  <span class="bg-tacticalGreen-800 text-tacticalGreen-300 px-2 py-0.5 rounded text-xs font-medium">
                    {{ player.role }}
                  </span>
                </div>
                <p class="text-gray-300 text-sm">{{ player.tasks }}</p>
              </div>
            </div>
          </div>

          <div v-if="strategy.lineups && strategy.lineups.length > 0">
            <h2 class="text-xl font-semibold mb-4">Utility Lineups</h2>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="(lineup, index) in strategy.lineups" 
                :key="lineup.id"
                @click="showLineup(index)"
                class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                :class="activeLineupIndex === index ? 'bg-tacticalGreen-500 text-white' : 'bg-csGray-700 text-gray-300 hover:bg-csGray-600'"
              >
                {{ lineup.title }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%;
}
.aspect-h-9 {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
