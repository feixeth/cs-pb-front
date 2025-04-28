<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Edit Strategy</h1>
    <!-- Edit strategy form will go here -->
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-600">Edit strategy form coming soon...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  // Will be used to fetch strategy data using the ID from route params
  const strategyId = route.params.id
})
</script>