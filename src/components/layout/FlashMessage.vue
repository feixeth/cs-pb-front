<template>
    <transition name="fade">
      <div
        v-if="visible"
        class="absolute right-4 top-12 sm:top-32 px-6 py-3 rounded shadow-lg z-50 text-sm font-medium"
        :style="{
          backgroundColor: '#334613',
          color: 'rgb(125 160 24 / var(--tw-text-opacity, 1))'
        }"
      >
        {{ message }}
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const props = defineProps({
    message: String,
    duration: {
      type: Number,
      default: 4000
    }
  })
  
  const visible = ref(true)
  
  onMounted(() => {
    setTimeout(() => {
      visible.value = false
    }, props.duration)
  })
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
  