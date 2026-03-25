import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'
import storage from '../services/storage'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is logged in on mount
    // Don't proceed with user auth if admin is logged in
    const adminToken = localStorage.getItem('admin_token')
    if (adminToken) {
      // Admin is logged in, skip user auth
      setLoading(false)
      console.log('👤 Admin session detected, skipping user auth')
      return
    }

    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Token ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/user/')
      setUser(response.data)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Error fetching user:', error)
      storage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login with:', { email })
      const response = await api.post('/auth/login/', { email, password })
      console.log('✅ Login successful:', response.data)
      const { token, user } = response.data
      storage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Token ${token}`
      setUser(user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      console.error('❌ Login Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        request: error.config?.url,
      })

      // Better error handling
      if (error.response?.status === 403) {
        const errorData = error.response.data
        console.error('🚫 403 Response Data:', errorData)
        return { success: false, error: `❌ 403 Forbidden: ${JSON.stringify(errorData)}` }
      } else if (error.response?.status === 400) {
        const errData = error.response.data
        const errMsg = errData?.non_field_errors?.[0] || 
                       errData?.email?.[0] || 
                       errData?.password?.[0] || 
                       errData?.message || 
                       'Invalid email or password'
        return { success: false, error: `❌ ${errMsg}` }
      } else if (error.response?.status === 401) {
        return { success: false, error: '❌ Invalid email or password' }
      } else if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
        return { success: false, error: '❌ Cannot connect to server. Make sure backend is running on http://localhost:8000' }
      } else {
        return { success: false, error: `❌ Login failed: ${error.message}` }
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData)
      const { token, user } = response.data
      storage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Token ${token}`
      setUser(user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      const errData = error.response?.data
      const firstError = errData && typeof errData === 'object' && Object.keys(errData).length > 0
        ? (errData[Object.keys(errData)[0]]?.[0] || errData[Object.keys(errData)[0]])
        : null
      const errMsg = firstError || errData?.message || 'Registration failed. Please try again.'
      return { success: false, error: errMsg }
    }
  }

  const logout = () => {
    storage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
