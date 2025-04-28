<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStrategiesStore } from '../../stores/strategies'
import StrategyCard from '../../components/strategy/StrategyCard.vue'

const strategiesStore = useStrategiesStore()
const searchQuery = ref('')
const filterMap = ref('')
const filterType = ref('')
const sortBy = ref('newest')

// Maps and types for filters
const maps = ['dust2', 'mirage', 'inferno', 'nuke', 'overpass', 'vertigo', 'ancient']
const types = ['T Side', 'CT Side', 'Pistol Round', 'Eco', 'Force Buy']

// Fetch strategies on component mount
onMounted(async () => {
  await strategiesStore.fetchStrategies()
})

// Filter and sort strategies
const filteredStrategies = computed(() => {
  // Start with public strategies only
  let result = strategiesStore.publicStrategies
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(strategy => 
      strategy.title.toLowerCase().includes(query) || 
      strategy.description.toLowerCase().includes(query)
    )
  }
  
  // Filter by map
  if (filterMap.value) {
    result = result.filter(strategy => strategy.map === filterMap.value)
  }
  
  // Filter by type
  if (filterType.value) {
    result = result.filter(strategy => strategy.type === filterType.value)
  }
  
  // Sort strategies
  if (sortBy.value === 'newest') {
    result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortBy.value === 'oldest') {
    result = [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  } else if (sortBy.value === 'most-votes') {
    result = [...result].sort((a, b) => 
      (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
    )
  } else if (sortBy.value === 'least-votes') {
    result = [...result].sort((a, b) => 
      (a.upvotes - a.downvotes) - (b.upvotes - b.downvotes)
    )
  }
  
  return result
})

// Reset all filters
const resetFilters = () => {
  searchQuery.value = ''
  filterMap.value = ''
  filterType.value = ''
  sortBy.value = 'newest'
}
</script>

<template>
  <div class="container mx-auto px-4 py-10">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-heading font-bold mb-4">Browse Strategies</h1>
      <p class="text-lg text-gray-400 max-w-3xl mx-auto">
        Discover community-created Counter-Strike strategies, filter by map or type, and find the perfect tactics for your next match.
      </p>
    </div>
    
    <!-- Filters and Search Section -->
    <div class="bg-csGray-800 rounded-lg p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search Input -->
        <div>
          <label for="search" class="block text-sm font-medium text-gray-400 mb-1">
            Search
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              class="input pl-10"
              placeholder="Search strategies..."
            />
          </div>
        </div>
        
        <!-- Map Filter -->
        <div>
          <label for="map-filter" class="block text-sm font-medium text-gray-400 mb-1">
            Map
          </label>
          <select
            id="map-filter"
            v-model="filterMap"
            class="input"
          >
            <option value="">All Maps</option>
            <option v-for="map in maps" :key="map" :value="map">
              {{ map.charAt(0).toUpperCase() + map.slice(1) }}
            </option>
          </select>
        </div>
        
        <!-- Type Filter -->
        <div>
          <label for="type-filter" class="block text-sm font-medium text-gray-400 mb-1">
            Type
          </label>
          <select
            id="type-filter"
            v-model="filterType"
            class="input"
          >
            <option value="">All Types</option>
            <option v-for="type in types" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
        
        <!-- Sort Options -->
        <div>
          <label for="sort-by" class="block text-sm font-medium text-gray-400 mb-1">
            Sort By
          </label>
          <select
            id="sort-by"
            v-model="sortBy"
            class="input"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-votes">Most Votes</option>
            <option value="least-votes">Least Votes</option>
          </select>
        </div>
      </div>
      
      <!-- Reset Filters Button -->
      <div class="mt-4 flex justify-end">
        <button
          @click="resetFilters"
          class="px-4 py-2 bg-csGray-700 text-gray-300 rounded-md hover:bg-csGray-600 transition-colors duration-200"
        >
          Reset Filters
        </button>
      </div>
    </div>
    
    <!-- Strategies Grid -->
    <div v-if="strategiesStore.isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tacticalGreen-500"></div>
    </div>
    
    <template v-else>
      <div v-if="filteredStrategies.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StrategyCard 
          v-for="strategy in filteredStrategies" 
          :key="strategy.id"
          :strategy="strategy"
        />
      </div>
      
      <div v-else class="text-center py-12 bg-csGray-800 rounded-lg">
        <svg class="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-300">No strategies found</h3>
        <p class="mt-1 text-gray-500">
          Try adjusting your filters or search query.
        </p>
        <button
          @click="resetFilters"
          class="mt-4 btn-primary"
        >
          Reset Filters
        </button>
      </div>
    </template>
  </div>
</template>