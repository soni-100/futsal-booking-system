import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AdminProvider } from './context/AdminContext'
import UserLayout from './components/UserLayout'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Courts from './pages/Courts'
import Booking from './pages/Booking'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCourts from './pages/admin/AdminCourts'
import AdminUsers from './pages/admin/AdminUsers'
import AdminBookings from './pages/admin/AdminBookings'
import AdminSettings from './pages/admin/AdminSettings'

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <Routes>
            {/* Regular User Routes */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courts" element={<Courts />} />
              <Route
                path="/booking/:courtId"
                element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin">
              <Route path="login" element={<AdminLogin />} />
              <Route element={<AdminLayout />}>
                <Route
                  index
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="courts"
                  element={
                    <AdminProtectedRoute>
                      <AdminCourts />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="users"
                  element={
                    <AdminProtectedRoute>
                      <AdminUsers />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="bookings"
                  element={
                    <AdminProtectedRoute>
                      <AdminBookings />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <AdminProtectedRoute>
                      <AdminSettings />
                    </AdminProtectedRoute>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AdminProvider>
    </AuthProvider>
  )
}

export default App
