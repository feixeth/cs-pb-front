<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStrategiesStore } from '../../stores/strategies'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const strategiesStore = useStrategiesStore()
const userStore = useUserStore()

const isLoading = ref(false)
const error = ref('')

const maps = ['dust2', 'mirage', 'inferno', 'nuke', 'train', 'anubis', 'ancient']
const types = ['T Side', 'CT Side', 'Pistol Round', 'Eco', 'Force Buy']

const strategyForm = reactive({
  title: '',
  description: '',
  map: '',
  type: '',
  is_public: true,
  players: Array.from({ length: 5 }, (_, i) => ({
    position: i + 1,
    role: '',
    tasks: ''
  })),
  lineups: []
})

const addLineup = () => {
  strategyForm.lineups.push({
    id: `lineup-${Date.now()}`,
    title: '',
    image: ''
  })
}

const removeLineup = (index) => {
  strategyForm.lineups.splice(index, 1)
}

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const newStrategy = await strategiesStore.createStrategy({
      ...strategyForm,
      userId: userStore.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    
    if (newStrategy) {
      router.push(`/strategies/${newStrategy.id}`)
    } else {
      error.value = 'Failed to create strategy'
    }
  } catch (err) {
    error.value = err.message || 'An error occurred while creating the strategy'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-10">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-heading font-bold mb-6">Create New Strategy</h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Error Alert -->
        <div v-if="error" class="bg-red-900 bg-opacity-50 border border-red-700 text-red-200 px-4 py-3 rounded">
          {{ error }}
        </div>
        
        <!-- Basic Information -->
        <div class="bg-csGray-800 rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div class="space-y-4">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-300 mb-1">
                Strategy Title
              </label>
              <input
                id="title"
                v-model="strategyForm.title"
                type="text"
                required
                class="input"
                placeholder="Enter strategy title"
              />
            </div>
            
            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                v-model="strategyForm.description"
                rows="4"
                required
                class="input"
                placeholder="Describe your strategy..."
              ></textarea>
            </div>
            
            <!-- Map & Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="map" class="block text-sm font-medium text-gray-300 mb-1">
                  Map
                </label>
                <select
                  id="map"
                  v-model="strategyForm.map"
                  required
                  class="input"
                >
                  <option value="">Select a map</option>
                  <option v-for="map in maps" :key="map" :value="map">
                    {{ map.charAt(0).toUpperCase() + map.slice(1) }}
                  </option>
                </select>
              </div>
              
              <div>
                <label for="type" class="block text-sm font-medium text-gray-300 mb-1">
                  Type
                </label>
                <select
                  id="type"
                  v-model="strategyForm.type"
                  required
                  class="input"
                >
                  <option value="">Select type</option>
                  <option v-for="type in types" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>
            </div>
            
            <!-- Visibility -->
            <div class="flex items-center">
              <input
                id="is_public"
                v-model="strategyForm.is_public"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-600 bg-csGray-700 text-tacticalGreen-500 focus:ring-tacticalGreen-500 focus:ring-offset-csGray-800"
              />
              <label for="is_public" class="ml-2 block text-sm text-gray-300">
                Make this strategy public
              </label>
            </div>
          </div>
        </div>
        
        <!-- Player Roles -->
        <div class="bg-csGray-800 rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Player Roles</h2>
          
          <div class="grid grid-cols-1 gap-6">
            <div 
              v-for="(player, index) in strategyForm.players" 
              :key="`player-${index}`"
              class="bg-csGray-700 p-4 rounded-lg"
            >
              <h3 class="font-medium mb-3">Player {{ index + 1 }}</h3>
              
              <div class="space-y-4">
                <div>
                  <label :for="`player-${index}-role`" class="block text-sm font-medium text-gray-300 mb-1">
                    Role
                  </label>
                  <input
                    :id="`player-${index}-role`"
                    v-model="player.role"
                    type="text"
                    class="input"
                    placeholder="e.g., Entry, Support, AWPer"
                  />
                </div>
                
                <div>
                  <label :for="`player-${index}-tasks`" class="block text-sm font-medium text-gray-300 mb-1">
                    Tasks
                  </label>
                  <textarea
                    :id="`player-${index}-tasks`"
                    v-model="player.tasks"
                    rows="2"
                    class="input"
                    placeholder="Describe player's responsibilities..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Utility Lineups -->
        <div class="bg-csGray-800 rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Utility Lineups</h2>
            <button
              type="button"
              @click="addLineup"
              class="btn-outline text-sm"
            >
              Add Lineup
            </button>
          </div>
          
          <div class="space-y-4">
            <div 
              v-for="(lineup, index) in strategyForm.lineups" 
              :key="lineup.id"
              class="bg-csGray-700 p-4 rounded-lg"
            >
              <div class="flex justify-between items-start mb-4">
                <h3 class="font-medium">Lineup {{ index + 1 }}</h3>
                <button
                  type="button"
                  @click="removeLineup(index)"
                  class="text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label :for="`lineup-${index}-title`" class="block text-sm font-medium text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    :id="`lineup-${index}-title`"
                    v-model="lineup.title"
                    type="text"
                    class="input"
                    placeholder="e.g., Smoke for A Site"
                  />
                </div>
                
                <div>
                  <label :for="`lineup-${index}-image`" class="block text-sm font-medium text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    :id="`lineup-${index}-image`"
                    v-model="lineup.image"
                    type="url"
                    class="input"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>
            </div>
            
            <div v-if="strategyForm.lineups.length === 0" class="text-center py-6 bg-csGray-700 rounded-lg">
              <p class="text-gray-400 mb-2">No lineups added yet</p>
              <button
                type="button"
                @click="addLineup"
                class="btn-outline text-sm"
              >
                Add Your First Lineup
              </button>
            </div>
          </div>
        </div>
        
        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="btn-primary px-8 py-3"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Strategy...
            </span>
            <span v-else>Create Strategy</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>