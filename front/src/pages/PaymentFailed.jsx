import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTimesCircle } from 'react-icons/fa'

const PaymentFailed = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center py-8">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        <FaTimesCircle className="mx-auto text-6xl text-red-500 mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
        
        <p className="text-gray-600 mb-8">
          Unfortunately, your payment could not be processed. Please check your payment details and try again.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-red-800">
            <strong>What to do next:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Check your payment method details</li>
              <li>Verify your account balance</li>
              <li>Try again or use a different payment method</li>
            </ul>
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/bookings')}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors font-semibold"
          >
            Back to Bookings
          </button>
          <button
            onClick={() => navigate('/courts')}
            className="w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-semibold"
          >
            Back to Courts
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailed
