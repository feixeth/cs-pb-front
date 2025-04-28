import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fakeStrategiesApi } from '../services/fakeApi'

export const useStrategiesStore = defineStore('strategies', () => {
  // State
  const strategies = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // Getters
  const allStrategies = computed(() => strategies.value)
  const publicStrategies = computed(() => 
    strategies.value.filter(strategy => strategy.isPublic)
  )
  const topStrategies = computed(() => 
    [...publicStrategies.value]
      .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
      .slice(0, 4)
  )
  
  // Get strategies by user ID
  const getStrategiesByUserId = (userId) => 
    strategies.value.filter(strategy => strategy.userId === userId)
  
  // Get strategy by ID
  const getStrategyById = (id) => 
    strategies.value.find(strategy => strategy.id === id)
  
  // Actions
  async function fetchStrategies() {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await fakeStrategiesApi.getStrategies()
      strategies.value = data
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
      // Try to get it from store first
      let strategy = getStrategyById(id)
      
      if (!strategy) {
        // If not in store, fetch it
        strategy = await fakeStrategiesApi.getStrategyById(id)
        
        // Add to store if not already there
        if (!strategies.value.some(s => s.id === strategy.id)) {
          strategies.value.push(strategy)
        }
      }
      
      return strategy
    } catch (err) {
      error.value = 'Failed to fetch strategy'
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  async function createStrategy(strategyData) {
    isLoading.value = true
    error.value = null
    
    try {
      const newStrategy = await fakeStrategiesApi.createStrategy(strategyData)
      strategies.value.push(newStrategy)
      return newStrategy
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
      const updatedStrategy = await fakeStrategiesApi.updateStrategy(id, strategyData)
      
      // Update in the store
      const index = strategies.value.findIndex(s => s.id === id)
      if (index !== -1) {
        strategies.value[index] = updatedStrategy
      }
      
      return updatedStrategy
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
      await fakeStrategiesApi.deleteStrategy(id)
      
      // Remove from store
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
      const result = await fakeStrategiesApi.voteStrategy(id, voteType)
      
      // Update strategy in store
      const index = strategies.value.findIndex(s => s.id === id)
      if (index !== -1) {
        strategies.value[index] = {
          ...strategies.value[index],
          upvotes: result.upvotes,
          downvotes: result.downvotes
        }
      }
      
      return result
    } catch (err) {
      console.error('Failed to vote', err)
      return null
    }
  }
  
  return {
    strategies,
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