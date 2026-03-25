import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaCheckCircle, FaFutbol } from 'react-icons/fa'
import api from '../services/api'

const PaymentSuccess = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    fetchBookingDetails()
  }, [bookingId])

  // Auto-redirect to home after 5 seconds
  useEffect(() => {
    if (!loading) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            navigate('/')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [loading, navigate])

  const fetchBookingDetails = async () => {
    try {
      const response = await api.get(`/bookings/${bookingId}/`)
      setBooking(response.data)
    } catch (error) {
      console.error('Error fetching booking details:', error)
      // If not authenticated, just show success message
      if (error.response?.status === 401) {
        setBooking({ id: bookingId, status: 'confirmed' })
      }
    } finally {
      setLoading(false)
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
    <>
      {/* Success Toast Notification */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
        <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <FaCheckCircle className="text-xl" />
          <span className="font-semibold">Payment successful! Redirecting to home...</span>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-8">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        <FaCheckCircle className="mx-auto text-6xl text-green-500 mb-6 animate-bounce" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully. Your booking is now confirmed.
        </p>

        {booking && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FaFutbol className="mr-2 text-primary-600" />
              Booking Details
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between border-b pb-2">
                <span>Court:</span>
                <span className="font-medium text-gray-900">{booking.court?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Date:</span>
                <span className="font-medium text-gray-900">{booking.booking_date}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Time:</span>
                <span className="font-medium text-gray-900">
                  {typeof booking.start_time === 'string' ? booking.start_time.slice(0, 5) : booking.start_time}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Duration:</span>
                <span className="font-medium text-gray-900">{booking.duration} hours</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-semibold">Total Paid:</span>
                <span className="font-bold text-green-600">Rs. {parseFloat(booking.total_price).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2"
          >
            <span>Back to Home</span>
            <span className="text-sm bg-green-700 rounded-full px-2 py-0.5">{countdown}s</span>
          </button>
          <button
            onClick={() => navigate('/bookings')}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors font-semibold"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate('/courts')}
            className="w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-semibold"
          >
            Book Another Court
          </button>
        </div>
      </div>
      </div>
    </>
  )
}

export default PaymentSuccess
