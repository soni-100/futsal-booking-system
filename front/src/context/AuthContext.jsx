import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

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
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login/', { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Token ${token}`
      setUser(user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      const errData = error.response?.data
      const errMsg = errData?.non_field_errors?.[0] || errData?.email?.[0] || errData?.password?.[0] || errData?.message || 'Login failed. Please try again.'
      return { success: false, error: errMsg }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData)
      const { token, user } = response.data
      localStorage.setItem('token', token)
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
    localStorage.removeItem('token')
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
