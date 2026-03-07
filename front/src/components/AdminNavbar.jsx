import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import { FaBars, FaTimes, FaSignOutAlt, FaHome, FaFutbol, FaUsers, FaCalendarAlt, FaChartBar, FaCog } from 'react-icons/fa'

const AdminNavbar = () => {
  const { isAuthenticated, admin, logout } = useAdmin()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
    setMobileMenuOpen(false)
  }

  const navLinks = [
    { path: '/admin', label: 'Dashboard', icon: FaChartBar },
    { path: '/admin/courts', label: 'Courts', icon: FaFutbol },
    { path: '/admin/users', label: 'Users', icon: FaUsers },
    { path: '/admin/bookings', label: 'Bookings', icon: FaCalendarAlt },
    { path: '/admin/settings', label: 'Settings', icon: FaCog },
  ]

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/admin" className="flex items-center space-x-2">
            <FaFutbol className="text-primary-400 text-2xl" />
            <span className="text-xl font-bold">Admin Panel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors flex items-center space-x-1"
              >
                <link.icon />
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="ml-4 flex items-center space-x-3 border-l border-gray-700 pl-4">
              <span className="text-sm text-gray-300">
                {admin?.email || 'Admin'}
              </span>
              <Link
                to="/"
                className="px-3 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors flex items-center space-x-1"
              >
                <FaHome />
                <span>Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-md transition-colors flex items-center space-x-1"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors flex items-center space-x-2"
                >
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="px-4 py-2 border-t border-gray-700 mt-2 pt-2">
                <div className="text-sm text-gray-300 mb-2">{admin?.email || 'Admin'}</div>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors flex items-center space-x-2"
                >
                  <FaHome />
                  <span>Go to Site</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-md transition-colors flex items-center space-x-2"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default AdminNavbar
