import axios from 'axios'

console.log('📡 API Base URL:', import.meta.env.DEV ? '/api' : '/api')

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CSRF
})

// Helper to get CSRF token from cookie
const getCsrfToken = () => {
  const name = 'csrftoken'
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

// Request interceptor - support both user and admin tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token')
    
    // Add token auth if available
    if (token) {
      config.headers.Authorization = `Token ${token}`
      console.log('🔑 Using token auth')
    } else {
      // Add CSRF token if no token auth (for session-based auth)
      const csrfToken = getCsrfToken()
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken
        console.log('🛡️ Using CSRF token')
      }
    }
    
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.status)
    return response
  },
  (error) => {
    console.error(`❌ Error from ${error.config?.url}:`, error.response?.status, error.response?.data)
    
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin')
      localStorage.removeItem('token')
      localStorage.removeItem('admin_token')
      if (isAdminRoute) {
        window.location.href = '/admin/login'
      } else {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
