import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { FaFutbol, FaPlus, FaEdit, FaTrash, FaSearch, FaMapMarkerAlt, FaDollarSign, FaUsers, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa'

const AdminCourts = () => {
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCourt, setEditingCourt] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price_per_hour: '',
    capacity: '',
    description: '',
    image: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourts()
  }, [])

  const fetchCourts = async () => {
    try {
      const response = await api.get('/courts/manage/')
      setCourts(response.data || [])
      setError(null)
    } catch (error) {
      console.error('Error fetching courts:', error)
      if (error.response?.status === 403) {
        setError('❌ Admin access denied. You are not authorized to view this page.')
      } else if (error.response?.status === 401) {
        setError('❌ Your session has expired. Please log in again.')
      }
      setCourts([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (court) => {
    setEditingCourt(court)
    setFormData({
      name: court.name,
      location: court.location,
      price_per_hour: court.price_per_hour,
      capacity: court.capacity,
      description: court.description || '',
      image: court.image_url || court.image || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (courtId) => {
    if (!window.confirm('Are you sure you want to delete this court?')) return
    setError(null)
    try {
      await api.delete(`/courts/manage/${courtId}/`)
      setCourts((prev) => prev.filter((court) => court.id !== courtId))
      setSuccess('Court deleted successfully!')
      setTimeout(() => setSuccess(null), 2000)
    } catch (error) {
      console.error('Error deleting court:', error)
      if (error.response?.status === 403) {
        setError('❌ Admin access denied. Please log out and log back in.')
      } else if (error.response?.status === 401) {
        setError('❌ Your session has expired. Please log in again.')
      } else {
        setError('❌ Failed to delete court. Please try again.')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    try {
      const payload = {
        name: formData.name,
        location: formData.location,
        price_per_hour: parseFloat(formData.price_per_hour) || 0,
        capacity: parseInt(formData.capacity, 10) || 10,
        description: formData.description || '',
        is_active: true,
      }

      if (editingCourt) {
        const response = await api.put(`/courts/manage/${editingCourt.id}/`, payload)
        setCourts((prev) => prev.map((c) => (c.id === editingCourt.id ? response.data : c)))
        setSuccess('Court updated successfully!')
      } else {
        const response = await api.post('/courts/manage/', payload)
        setCourts((prev) => [...prev, response.data])
        setSuccess('Court added successfully!')
      }

      setTimeout(() => {
        setShowModal(false)
        setEditingCourt(null)
        setFormData({ name: '', location: '', price_per_hour: '', capacity: '', description: '', image: '' })
        setSuccess(null)
      }, 1500)
    } catch (error) {
      console.error('Error saving court:', error)
      
      // Better error handling
      if (error.response?.status === 403) {
        setError('❌ Admin access denied. Please log out and log back in with your admin account.')
      } else if (error.response?.status === 401) {
        setError('❌ Your session has expired. Please log in again.')
        setTimeout(() => navigate('/admin/login'), 2000)
      } else if (error.response?.data?.detail) {
        setError(`❌ Error: ${error.response.data.detail}`)
      } else if (error.response?.data) {
        const errorMsg = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value[0] : value}`)
          .join(', ')
        setError(`❌ Error: ${errorMsg}`)
      } else if (error.message) {
        setError(`❌ Error: ${error.message}`)
      } else {
        setError('❌ Failed to save court. Please try again.')
      }
    }
  }

  const filteredCourts = courts.filter(
    (court) =>
      court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      court.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Error Notification */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <FaExclamationCircle className="text-xl" />
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <FaCheckCircle className="text-xl" />
            <span className="font-semibold">{success}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Court Management</h1>
            <p className="text-gray-600 mt-1">Manage all futsal courts</p>
          </div>
          <button
            onClick={() => {
              setEditingCourt(null)
              setFormData({
                name: '',
                location: '',
                price_per_hour: '',
                capacity: '',
                description: '',
                image: '',
              })
              setShowModal(true)
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Court</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Courts Grid */}
        {filteredCourts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <FaFutbol className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-600">No courts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts.map((court) => (
              <div
                key={court.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={court.image_url || court.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(court.name)}`}
                  alt={court.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{court.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        court.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {court.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{court.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2 text-base font-bold">₨</span>
                      <span>Rs. {court.price_per_hour}/hour</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2" />
                      <span>Capacity: {court.capacity} players</span>
                    </div>
                    {court.description && (
                      <p className="text-sm text-gray-600 mt-2">{court.description}</p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(court)}
                      className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(court.id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {editingCourt ? 'Edit Court' : 'Add New Court'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Court Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price per Hour (Rs.)
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.price_per_hour}
                        onChange={(e) =>
                          setFormData({ ...formData, price_per_hour: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.capacity}
                        onChange={(e) =>
                          setFormData({ ...formData, capacity: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                    >
                      {editingCourt ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false)
                        setEditingCourt(null)
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCourts
