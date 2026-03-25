import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { FaFutbol, FaMapMarkerAlt, FaClock, FaUsers, FaStar, FaSearch } from 'react-icons/fa'
import eliteImage from '../images/elite.png'
import proImage from '../images/profutsal.png'
import champainImage from '../images/champain.png'

// Image mapping for courts
const courtImageMap = {
  'Elite Futsal Arena': eliteImage,
  'Pro Futsal Center': proImage,
  'Champions Futsal': champainImage,
}

const Courts = () => {
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourts()
  }, [])

  const fetchCourts = async () => {
    try {
      const response = await api.get('/courts/')
      const courtsData = response.data.map((court) => {
        // Use local images for known courts, otherwise use API image or placeholder
        const imageUrl = courtImageMap[court.name] || court.image_src || court.image_url || `https://via.placeholder.com/400x300?text=${encodeURIComponent(court.name)}`
        
        return {
          ...court,
          price_per_hour: parseFloat(court.price_per_hour) || 0,
          image: imageUrl,
          available_slots: court.available_slots || ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
          rating: court.rating || 4.5,
        }
      })
      setCourts(courtsData)
    } catch (error) {
      console.error('Error fetching courts:', error)
      setCourts([])
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = (courtId) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate(`/booking/${courtId}`)
  }

  const filteredCourts = courts.filter((court) =>
    court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    court.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Courts</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courts by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {filteredCourts.length === 0 ? (
          <div className="text-center py-12">
            <FaFutbol className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-600">No courts found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts.map((court) => (
              <div
                key={court.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={court.image}
                  alt={court.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(court.name)}`
                  }}
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{court.name}</h3>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <FaStar />
                      <span className="text-sm font-medium text-gray-700">{court.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{court.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2" />
                      <span>Capacity: {court.capacity} players</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2" />
                      <span>Rs. {court.price_per_hour}/hour</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Available slots:</p>
                    <div className="flex flex-wrap gap-2">
                      {court.available_slots.slice(0, 4).map((slot, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded"
                        >
                          {slot}
                        </span>
                      ))}
                      {court.available_slots.length > 4 && (
                        <span className="px-2 py-1 text-gray-500 text-xs">
                          +{court.available_slots.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookNow(court.id)}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors font-medium"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Courts
