<template>
    <button @click="share" class="px-4 py-2 bg-tacticalGreen-500 text-white rounded transition mb-2">
      📤 {{ buttonText }}
    </button>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const buttonText = ref('Partager cette stratégie')
  
  const share = async () => {
    const url = window.location.href
    const title = document.title || 'Stratégie Counter-Strike'
  
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch (error) {
        console.error('Partage annulé ou échoué', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        buttonText.value = 'Lien copié !'
        setTimeout(() => {
          buttonText.value = 'Partager cette stratégie'
        }, 2000)
      } catch (err) {
        alert('Erreur lors de la copie du lien. Voici l’URL : ' + url)
      }
    }
  }
  </script>
  