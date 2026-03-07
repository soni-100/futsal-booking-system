import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome, FaFutbol, FaCalendarAlt, FaUserCircle } from 'react-icons/fa'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const navLinks = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/courts', label: 'Courts', icon: FaFutbol },
  ]

  const authLinks = isAuthenticated
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: FaUserCircle },
        { path: '/bookings', label: 'My Bookings', icon: FaCalendarAlt },
      ]
    : [
        { path: '/login', label: 'Login', icon: FaUser },
        { path: '/register', label: 'Register', icon: FaUser },
      ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaFutbol className="text-primary-600 text-2xl" />
            <span className="text-xl font-bold text-gray-800">Futsal Booking</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors flex items-center space-x-1"
              >
                <link.icon />
                <span>{link.label}</span>
              </Link>
            ))}

            {isAuthenticated && (
              <>
                {authLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors flex items-center space-x-1"
                  >
                    <link.icon />
                    <span>{link.label}</span>
                  </Link>
                ))}
                <div className="ml-4 flex items-center space-x-3 border-l pl-4">
                  <span className="text-sm text-gray-600">
                    {user?.first_name || user?.email || 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center space-x-1"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <>
                {authLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors flex items-center space-x-1"
                  >
                    <link.icon />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-primary-50"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors flex items-center space-x-2"
                >
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  {authLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors flex items-center space-x-2"
                    >
                      <link.icon />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                  <div className="px-4 py-2 border-t mt-2 pt-2">
                    <div className="text-sm text-gray-600 mb-2">
                      {user?.first_name || user?.email || 'User'}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center space-x-2"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <>
                  {authLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors flex items-center space-x-2"
                    >
                      <link.icon />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
