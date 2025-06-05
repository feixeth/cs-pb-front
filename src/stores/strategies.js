
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useStrategiesStore = defineStore('strategies', () => {
  const strategies = ref([])
  const userStrategies = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const allStrategies = computed(() => strategies.value)
  const publicStrategies = computed(() => 
    strategies.value.filter(strategy => !!strategy.is_public)
  )
  
  const topStrategies = computed(() => 
    [...publicStrategies.value]
      .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
      .slice(0, 4)
  )

  const getStrategyById = (id) => 
    strategies.value.find(strategy => strategy.id === id)

  async function fetchStrategies() {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('/api/strategies')
      strategies.value = response.data
      return response;
    } catch (err) {
      error.value = 'Failed to fetch strategies'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchStrategyById(id) {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get(`/api/strategies/${id}`)
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch strategy'
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function getStrategiesByUserId() {
    isLoading.value = true
    error.value = null
  
    try {
      const response = await api.get('/api/my-strategies')
      // ⚠️ CORRECTION: S'assurer que les données sont correctement stockées
      if (response && response.data) {
        userStrategies.value = response.data
        // ⚠️ CORRECTION: Mettre à jour également strategies pour le dashboard
        strategies.value = response.data
      } else {
        console.error('API response missing data structure', response)
      }
    } catch (err) {
      error.value = 'Failed to fetch your strategies'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
  

  async function createStrategy(strategyData) {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.post('/api/strategies', strategyData)
      strategies.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = 'Failed to create strategy'
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateStrategy(id, strategyData) {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.put(`/api/strategies/${id}`, strategyData)
      const index = strategies.value.findIndex(s => s.id === id)
      if (index !== -1) {
        strategies.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to update strategy'
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function deleteStrategy(id) {
    isLoading.value = true
    error.value = null
    try {
      await api.delete(`/api/strategies/${id}`)
      strategies.value = strategies.value.filter(s => s.id !== id)
      return true
    } catch (err) {
      error.value = 'Failed to delete strategy'
      console.error(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function toggleVote(id, voteType) {
    try {
      const value = voteType === 'upvote' ? 1 : -1
      const response = await api.post(`/api/strategies/${id}/vote`, { value })
      const updated = response.data
  
      const index = strategies.value.findIndex(s => s.id === id)
      if (index !== -1) {
        strategies.value[index].upvotes = updated.upvotes
        strategies.value[index].downvotes = updated.downvotes
        strategies.value[index].score = updated.score
      }
  
      return updated
    } catch (err) {
      console.error('Failed to vote', err)
      return null
    }
  }
  
  

  return {
    strategies,
    userStrategies,
    isLoading,
    error,
    allStrategies,
    publicStrategies,
    topStrategies,
    getStrategiesByUserId,
    getStrategyById,
    fetchStrategies,
    fetchStrategyById,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    toggleVote
  }
})
