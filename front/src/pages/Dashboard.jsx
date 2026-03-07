import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { FaFutbol, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserCircle, FaEdit } from 'react-icons/fa'
import { format } from 'date-fns'

const Dashboard = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/')
      const mapped = (response.data || []).map((b) => ({
        id: b.id,
        court_name: b.court?.name || 'Court',
        court_location: b.court?.location || '',
        date: b.booking_date,
        time: typeof b.start_time === 'string' ? b.start_time.slice(0, 5) : b.start_time,
        duration: b.duration,
        total_price: parseFloat(b.total_price) || 0,
        status: b.status,
      }))
      setBookings(mapped)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.first_name || user?.email}!</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-4 rounded-full">
              <FaUserCircle className="text-primary-600 text-3xl" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              {user?.phone && <p className="text-gray-600">{user?.phone}</p>}
            </div>
            <button className="px-4 py-2 text-primary-600 hover:text-primary-700 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors flex items-center space-x-2">
              <FaEdit />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/courts"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <FaFutbol className="text-primary-600 text-3xl mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Browse Courts</h3>
            <p className="text-gray-600 text-sm">Find and book a court</p>
          </Link>
          <Link
            to="/bookings"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <FaCalendarAlt className="text-primary-600 text-3xl mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">My Bookings</h3>
            <p className="text-gray-600 text-sm">View all your bookings</p>
          </Link>
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaClock className="text-primary-600 text-3xl mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Upcoming</h3>
            <p className="text-gray-600 text-sm">
              {bookings.filter((b) => b.status === 'confirmed').length} confirmed bookings
            </p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
            <Link
              to="/bookings"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
              <Link
                to="/courts"
                className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Book a Court
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Court
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.court_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {booking.court_location}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(booking.date), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">{booking.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.duration} {booking.duration === 1 ? 'hour' : 'hours'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${booking.total_price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
