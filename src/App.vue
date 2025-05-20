<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from './stores/user'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'

const route = useRoute()
const userStore = useUserStore()

// Check authentication status on app load
onMounted(() => {
  userStore.loadUser()
})

// Update page title based on route
watch(() => route.meta.title, (title) => {
  if (title) {
    document.title = `${title} | CS Playbook`
  } else {
    document.title = 'CS Playbook - Counter-Strike Strategy Resource'
  }
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
        <!-- Bloc pub haut -->
    <div class="bg-gray-900 text-center py-2">
      <span class="text-xs text-gray-300">[ Ads CPM - Up ]</span>
    </div>

    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- Bloc pub bas -->
    <div class="bg-gray-900 text-center py-2">
      <span class="text-xs text-gray-300">[ Ads CPM - Down ]</span>
    </div>

    <AppFooter />
  </div>
</template>