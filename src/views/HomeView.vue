<script setup>
import { onMounted } from 'vue'
import { useStrategiesStore } from '../stores/strategies'
import { useRoute } from 'vue-router'

import FlashMessage from '../components/layout/FlashMessage.vue'
import StrategyCard from '../components/strategy/StrategyCard.vue'

const strategiesStore = useStrategiesStore()
onMounted(async () => {
  await strategiesStore.fetchStrategies()
})

const route = useRoute()
</script>
<template>
  <div>
    <FlashMessage
      v-if="route.query.registered === 'true'"
      message="Account created! Please check your email to confirm your address."
    />
    <!-- Hero Section -->
    <section class="bg-csGray-900 relative overflow-hidden">
      <div class="absolute inset-0 z-0 opacity-20 bg-gradient-to-r from-tacticalGreen-900 to-primary-900"></div>
      
      <div class="container mx-auto px-4 py-20 relative z-10">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
    
    <!-- IMAGE À GAUCHE -->
    <div class="flex justify-center md:justify-end">
      <img src="/hero-char.png" alt="Character reading book" class="w-[250px] md:w-[300px] lg:w-[350px]">
    </div>

    <!-- TEXTE À DROITE -->
    <div class="text-center md:text-left max-w-[320px]">
      <h1 class="text-4xl sm:text-5xl font-heading font-bold mb-6 text-white leading-tight">
        <span class="block">Level Up Your</span>
        <span class="block text-tacticalGreen-500">Counter-Strike</span>
        <span class="block">Strategy Game</span>
      </h1>

      <p class="text-xl text-gray-300 mb-8">
        Create, share, and discover winning strategies with the ultimate CS playbook platform.
      </p>
    </div>

  </div>
  <br>
  <div class="flex flex-col sm:flex-row md:justify-center justify-center gap-5 mt-7">
        <router-link to="/strategies" class="btn-primary px-8 py-3 text-lg">
          Browse Strategies
        </router-link>
        <router-link to="/register" class="btn-outline px-8 py-3 text-lg">
          Create Your Playbook
        </router-link>
      </div>
</div>




    </section>
    
    <!-- Top Strategies Section -->
    <section class="py-16 bg-csGray-800">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-heading font-bold mb-4">Top Rated Strategies</h2>
          <p class="text-gray-400 max-w-2xl mx-auto">
            Check out the most popular strategies crafted by the community. Learn from the best and take your game to the next level.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-if="strategiesStore.isLoading" class="col-span-full flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tacticalGreen-500"></div>
          </div>
          
          <template v-else-if="strategiesStore.topStrategies.length > 0">
            <StrategyCard 
              v-for="strategy in strategiesStore.topStrategies" 
              :key="strategy.id"
              :strategy="strategy"
            />
          </template>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StrategyCard
              v-for="strategy in strategiesStore.strategies"
              :key="strategy.id"
              :strategy="strategy"
            />
          </div>
        </div>
        
        <div class="text-center mt-10">
          <router-link to="/strategies" class="btn-outline">
            View All Strategies
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-16 bg-csGray-900">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-heading font-bold mb-4">Why Use CS Playbook?</h2>
          <p class="text-gray-400 max-w-2xl mx-auto">
            Our platform offers everything you need to organize, perfect, and share your Counter-Strike strategies.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-csGray-800 p-6 rounded-lg">
            <div class="w-12 h-12 bg-tacticalGreen-800 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-tacticalGreen-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-xl font-heading font-semibold mb-2">Strategy Organization</h3>
            <p class="text-gray-400">
              Organize your strategies by map, side, and type. Keep your playbook organized and easily accessible.
            </p>
          </div>
          
          <!-- Feature 2 -->
          <div class="bg-csGray-800 p-6 rounded-lg">
            <div class="w-12 h-12 bg-primary-800 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-heading font-semibold mb-2">Player Role Assignment</h3>
            <p class="text-gray-400">
              Assign specific roles and tasks to each player in your squad for clear communication and execution.
            </p>
          </div>
          <!-- Feature 3 -->
          <div class="bg-csGray-800 p-6 rounded-lg">
            <div class="w-12 h-12 bg-secondary-800 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-heading font-semibold mb-2">Utility Lineups</h3>
            <p class="text-gray-400">
              Store screenshots and descriptions of your smoke, flash, and molotov lineups for quick reference.
            </p>
          </div>
          
          <!-- Feature 4 -->
          <div class="bg-csGray-800 p-6 rounded-lg">
            <div class="w-12 h-12 bg-tacticalGreen-800 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-tacticalGreen-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-heading font-semibold mb-2">Practice Planning</h3>
            <p class="text-gray-400">
              Plan your team's practice sessions around specific strategies to improve coordination and execution.
            </p>
          </div>
          
          <!-- Feature 5 -->
          <div class="bg-csGray-800 p-6 rounded-lg">
            <div class="w-12 h-12 bg-primary-800 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-heading font-semibold mb-2">Strategy Sharing</h3>
            <p class="text-gray-400">
              Share your strategies with teammates or the community, and discover new tactics from others.
            </p>
          </div>
          
          <!-- Feature 6 -->
          <div class="bg-csGray-800 p-6 rounded-lg">
            <div class="w-12 h-12 bg-secondary-800 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 class="text-xl font-heading font-semibold mb-2">Private Strategies</h3>
            <p class="text-gray-400">
              Keep your secret tactics private or share them only with your team members. You control who sees what.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-tacticalGreen-900 to-primary-900">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-heading font-bold mb-4">Ready to Elevate Your Game?</h2>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of players who use CS Playbook to organize their strategies and improve their tactical gameplay.
        </p>
        <router-link to="/register" class="btn bg-white text-csGray-900 hover:bg-gray-200 px-8 py-3 text-lg font-medium">
          Get Started Now
        </router-link>
      </div>
    </section>
    
    <!-- About Us Section -->
    <section class="py-16 bg-csGray-800">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-heading font-bold mb-4">About CS Playbook</h2>
          <p class="text-gray-400 mb-6">
            CS Playbook was created by a team of passionate Counter-Strike players who were tired of storing strategies in disorganized Discord channels and notebooks.
          </p>
          <p class="text-gray-400 mb-6">
            Our mission is to provide the Counter-Strike community with the best tools to create, organize, and share effective strategies. Whether you're a casual player or competing at a high level, CS Playbook helps you take your tactical gameplay to the next level.
          </p>
          <p class="text-gray-400">
            Join our growing community and start building your winning playbook today!
          </p>
        </div>
      </div>
    </section>
  </div>
</template>