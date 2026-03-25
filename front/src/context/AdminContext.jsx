import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

const AdminContext = createContext()

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if admin is logged in on mount
    const adminToken = localStorage.getItem('admin_token')
    if (adminToken) {
      api.defaults.headers.common['Authorization'] = `Token ${adminToken}`
      fetchAdmin()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchAdmin = async () => {
    try {
      const response = await api.get('/auth/admin/user/')
      setAdmin(response.data)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Error fetching admin:', error)
      localStorage.removeItem('admin_token')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/admin/login/', { email, password })
      const { token, admin } = response.data
      
      // Clear any existing user token before setting admin token
      localStorage.removeItem('token')
      
      // Set admin token
      localStorage.setItem('admin_token', token)
      api.defaults.headers.common['Authorization'] = `Token ${token}`
      setAdmin(admin)
      setIsAuthenticated(true)
      console.log('✅ Admin login successful')
      return { success: true }
    } catch (error) {
      const errData = error.response?.data
      const errMsg = errData?.non_field_errors?.[0] || errData?.email?.[0] || errData?.password?.[0] || errData?.message || 'Admin login failed. Please try again.'
      return { success: false, error: errMsg }
    }
  }

  const logout = () => {
    // Clear both user and admin tokens
    localStorage.removeItem('token')
    localStorage.removeItem('admin_token')
    delete api.defaults.headers.common['Authorization']
    setAdmin(null)
    setIsAuthenticated(false)
  }

  const value = {
    admin,
    loading,
    isAuthenticated,
    login,
    logout,
    fetchAdmin
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
