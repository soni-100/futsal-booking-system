import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { FaFutbol, FaCalendarAlt, FaClock, FaDollarSign, FaCheckCircle } from 'react-icons/fa'
import { format } from 'date-fns'

const Booking = () => {
  const { courtId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [court, setCourt] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchCourtDetails()
  }, [courtId, isAuthenticated, navigate])

  const fetchCourtDetails = async () => {
    try {
      const response = await api.get(`/courts/${courtId}/`)
      const c = response.data
      const defaultSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
      const slots = c.time_slots?.length
        ? c.time_slots.map((s) => {
            const t = s.start_time
            if (typeof t === 'string') return t.slice(0, 5)
            return defaultSlots[0]
          })
        : defaultSlots
      setCourt({
        ...c,
        price_per_hour: parseFloat(c.price_per_hour) || 0,
        available_slots: [...new Set(slots)].sort(),
      })
      setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
    } catch (err) {
      console.error('Error fetching court details:', err)
      setCourt(null)
      setError('Failed to load court details')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const totalPrice = court ? court.price_per_hour * duration : 0

    try {
      const startParts = selectedTime.split(':')
      const startHour = parseInt(startParts[0], 10) || 0
      const endHour = startHour + duration
      const endTime = `${String(endHour).padStart(2, '0')}:00:00`
      const startTimeFormatted = selectedTime.length === 5 ? `${selectedTime}:00` : selectedTime

      const response = await api.post('/bookings/', {
        court_id: parseInt(courtId, 10),
        booking_date: selectedDate,
        start_time: startTimeFormatted,
        end_time: endTime,
        duration,
        total_price: totalPrice,
      })
      
      // Get the booking ID from response and initiate payment
      const bookingId = response.data.id
      const token = localStorage.getItem('token')
      
      // Redirect to payment endpoint with token in query parameter
      window.location.href = `http://localhost:8000/api/bookings/pay/${bookingId}/?token=${token}`
      
    } catch (err) {
      const errData = err.response?.data
      const msg = errData && typeof errData === 'object'
        ? (Object.values(errData).flat().find(Boolean) || 'Failed to create booking.')
        : 'Failed to create booking. Please try again.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const totalPrice = court ? court.price_per_hour * duration : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!court) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Court not found</p>
          <button
            onClick={() => navigate('/courts')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Back to Courts
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h2>
          <p className="text-gray-600">Your booking has been confirmed. Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Court</h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <FaFutbol />
              <span className="text-xl">{court.name}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="inline mr-2" />
                  Select Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Choose a time</option>
                  {court.available_slots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hours)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {[1, 2, 3, 4].map((hours) => (
                  <option key={hours} value={hours}>
                    {hours} {hours === 1 ? 'hour' : 'hours'}
                  </option>
                ))}
              </select>
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Court:</span>
                  <span className="font-medium">{court.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">
                    {selectedDate ? format(new Date(selectedDate), 'MMM dd, yyyy') : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{selectedTime || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{duration} {duration === 1 ? 'hour' : 'hours'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="font-semibold">Total Price:</span>
                  <span className="font-bold text-primary-600 text-xl">
                    Rs. {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !selectedDate || !selectedTime}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Booking
