<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <img src="/logo.png" alt="CS Playbook Logo" class="mx-auto h-24 w-auto mb-6" />
      
      <h1 class="text-6xl font-heading font-bold text-white mb-4">404</h1>
      <h2 class="text-2xl font-medium text-tacticalGreen-500 mb-6">Page Not Found</h2>
      
      <p class="text-gray-400 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <router-link to="/" class="btn-primary">
          Go to Home
        </router-link>
        <router-link to="/strategies" class="btn-outline">
          Browse Strategies
        </router-link>
      </div>
    </div>
  </div>
</template>