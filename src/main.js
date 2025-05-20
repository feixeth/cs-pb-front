import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './style.css'
import { useUserStore } from './stores/user'

// Create pinia store
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Create and mount the app
const app = createApp(App)
app.use(pinia)

const userStore = useUserStore()

await userStore.loadUser()


app.use(router)
app.mount('#app')