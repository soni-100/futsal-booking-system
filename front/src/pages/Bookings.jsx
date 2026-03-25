import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import storage from '../services/storage'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaDollarSign, FaTimes, FaPaypal } from 'react-icons/fa'
import { format } from 'date-fns'

const Bookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const mapBooking = (b) => ({
    id: b.id,
    court_name: b.court?.name || 'Court',
    court_location: b.court?.location || '',
    date: b.booking_date,
    time: typeof b.start_time === 'string' ? b.start_time.slice(0, 5) : b.start_time,
    duration: b.duration,
    total_price: parseFloat(b.total_price) || 0,
    status: b.status,
    payment_status: b.payment_status,
  })

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/')
      setBookings((response.data || []).map(mapBooking))
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    try {
      await api.put(`/bookings/${bookingId}/`, { status: 'cancelled' })
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b)))
    } catch (error) {
      console.error('Error cancelling booking:', error)
    }
  }

  const handlePayment = (bookingId) => {
    const token = storage.getItem('token')
    if (!token) {
      alert('Please log in to make a payment.')
      return
    }
    // Redirect to backend payment endpoint
    const paymentUrl = `http://localhost:8000/api/bookings/pay/${bookingId}/?token=${token}`
    window.location.href = paymentUrl
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      case 'refunded':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter)

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage all your futsal court bookings</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex space-x-4">
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

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaCalendarAlt className="mx-auto text-5xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-600 mb-2">No bookings found</p>
            <p className="text-gray-500">
              {filter === 'all' 
                ? "You don't have any bookings yet."
                : `You don't have any ${filter} bookings.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {booking.court_name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <FaMapMarkerAlt className="mr-1" />
                      {booking.court_location}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-700">
                    <FaCalendarAlt className="mr-2 text-primary-600" />
                    <span>{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaClock className="mr-2 text-primary-600" />
                    <span>{booking.time} ({booking.duration} {booking.duration === 1 ? 'hour' : 'hours'})</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaDollarSign className="mr-2 text-primary-600" />
                    <span className="font-semibold">Rs. {booking.total_price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Payment Status:</span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                        booking.payment_status
                      )}`}
                    >
                      {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {booking.payment_status === 'pending' && booking.status !== 'cancelled' && (
                    <button
                      onClick={() => handlePayment(booking.id)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-semibold"
                    >
                      <FaPaypal />
                      <span>Pay Now (eSewa)</span>
                    </button>
                  )}

                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="w-full mt-2 px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <FaTimes />
                      <span>Cancel Booking</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings

