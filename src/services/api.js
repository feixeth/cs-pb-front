// services/api.js
//manage here the axios and api settings
import axios from 'axios'

// Configuration Axios globale
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true, // sanctum required
})
export default api
