<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">My Strategies</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StrategyCard 
        v-for="strategy in userStrategies" 
        :key="strategy.id" 
        :strategy="strategy"
      />
    </div>
    <div v-if="userStrategies.length === 0" class="text-center py-8">
      <p class="text-gray-600">You haven't created any strategies yet.</p>
      <router-link 
        to="/create-strategy" 
        class="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Create Your First Strategy
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStrategiesStore } from '../../stores/strategies'
import { useUserStore } from '../../stores/user'
import StrategyCard from '../../components/strategy/StrategyCard.vue'

const strategiesStore = useStrategiesStore()
const userStore = useUserStore()
const userStrategies = ref([])

onMounted(async () => {
  // Assuming the store has a method to fetch user's strategies
  userStrategies.value = await strategiesStore.getUserStrategies(userStore.user.id)
})
</script>