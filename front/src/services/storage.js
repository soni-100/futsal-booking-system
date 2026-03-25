/**
 * Safe Storage Service
 * Handles localStorage with fallback to in-memory storage
 * when browser tracking prevention blocks access
 */

let memoryStorage = {}

const storage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      console.warn('⚠️ localStorage blocked (tracking prevention), using memory fallback')
      return memoryStorage[key] || null
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      console.warn('⚠️ localStorage blocked (tracking prevention), using memory fallback')
      memoryStorage[key] = value
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.warn('⚠️ localStorage blocked (tracking prevention), using memory fallback')
      delete memoryStorage[key]
    }
  },

  clear: () => {
    try {
      localStorage.clear()
    } catch (e) {
      console.warn('⚠️ localStorage blocked (tracking prevention), clearing memory fallback')
      memoryStorage = {}
    }
  },
}

export default storage
