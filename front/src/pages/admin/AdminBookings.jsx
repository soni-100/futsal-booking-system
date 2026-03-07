import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { FaCalendarAlt, FaSearch, FaCheck, FaTimes, FaEye } from 'react-icons/fa'
import { format } from 'date-fns'

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const mapBooking = (b) => ({
    id: b.id,
    user_name: `${b.user?.first_name || ''} ${b.user?.last_name || ''}`.trim() || b.user?.email || 'User',
    user_email: b.user?.email || '',
    court_name: b.court?.name || 'Court',
    court_location: b.court?.location || '',
    date: b.booking_date,
    time: typeof b.start_time === 'string' ? b.start_time.slice(0, 5) : b.start_time,
    duration: b.duration,
    total_price: parseFloat(b.total_price) || 0,
    status: b.status,
    created_at: b.created_at,
  })

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/manage/')
      setBookings((response.data || []).map(mapBooking))
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.patch(`/bookings/manage/${bookingId}/`, { status: newStatus })
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)))
      setSelectedBooking(null)
    } catch (error) {
      console.error('Error updating booking status:', error)
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

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.court_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || booking.status === filter
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-1">Manage all court bookings</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex space-x-2">
            {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-xl text-gray-600">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
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
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.user_name}
                        </div>
                        <div className="text-sm text-gray-500">{booking.user_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.court_name}</div>
                        <div className="text-sm text-gray-500">{booking.court_location}</div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                              >
                                <FaCheck />
                                <span>Confirm</span>
                              </button>
                              <button
                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                              >
                                <FaTimes />
                                <span>Cancel</span>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                          >
                            <FaEye />
                            <span>View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">User Information</h3>
                  <p className="text-gray-900">{selectedBooking.user_name}</p>
                  <p className="text-gray-600">{selectedBooking.user_email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Court Information</h3>
                  <p className="text-gray-900">{selectedBooking.court_name}</p>
                  <p className="text-gray-600">{selectedBooking.court_location}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Booking Details</h3>
                  <p className="text-gray-900">
                    {format(new Date(selectedBooking.date), 'MMMM dd, yyyy')} at {selectedBooking.time}
                  </p>
                  <p className="text-gray-600">
                    Duration: {selectedBooking.duration} {selectedBooking.duration === 1 ? 'hour' : 'hours'}
                  </p>
                  <p className="text-gray-600">Total: ${selectedBooking.total_price}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Status</h3>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      selectedBooking.status
                    )}`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {bookings.filter((b) => b.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-primary-600">
              ${bookings.filter((b) => b.status === 'confirmed').reduce((sum, b) => sum + b.total_price, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminBookings
