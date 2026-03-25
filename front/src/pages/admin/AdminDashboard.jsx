import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import api from '../../services/api'
import { FaUsers, FaFutbol, FaCalendarAlt, FaDollarSign, FaArrowUp, FaArrowDown, FaChartLine } from 'react-icons/fa'

const AdminDashboard = () => {
  const { admin } = useAdmin()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourts: 0,
    totalBookings: 0,
    totalRevenue: 0,
    todayBookings: 0,
    pendingBookings: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/auth/admin/stats/'),
        api.get('/bookings/manage/'),
      ])
      setStats(statsRes.data || { totalUsers: 0, totalCourts: 0, totalBookings: 0, totalRevenue: 0, todayBookings: 0, pendingBookings: 0 })
      const mapped = (bookingsRes.data || []).slice(0, 5).map((b) => ({
        id: b.id,
        user_name: `${b.user?.first_name || ''} ${b.user?.last_name || ''}`.trim() || b.user?.email || 'User',
        court_name: b.court?.name || 'Court',
        date: b.booking_date,
        time: typeof b.start_time === 'string' ? b.start_time.slice(0, 5) : b.start_time,
        amount: parseFloat(b.total_price) || 0,
        status: b.status,
      }))
      setRecentBookings(mapped)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FaUsers,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Total Courts',
      value: stats.totalCourts,
      icon: FaFutbol,
      color: 'bg-green-500',
      change: '+2',
      trend: 'up',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: FaCalendarAlt,
      color: 'bg-purple-500',
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Total Revenue',
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
      icon: FaDollarSign,
      color: 'bg-yellow-500',
      change: '+15%',
      trend: 'up',
    },
  ]

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {admin?.email || 'Admin'}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <FaArrowUp className="text-green-500 text-xs mr-1" />
                    ) : (
                      <FaArrowDown className="text-red-500 text-xs mr-1" />
                    )}
                    <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Bookings</h3>
            <div className="flex items-center">
              <FaCalendarAlt className="text-primary-600 text-3xl mr-4" />
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.todayBookings}</p>
                <p className="text-sm text-gray-600">Bookings scheduled for today</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Bookings</h3>
            <div className="flex items-center">
              <FaCalendarAlt className="text-yellow-500 text-3xl mr-4" />
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</p>
                <p className="text-sm text-gray-600">Require attention</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
            <Link
              to="/admin/bookings"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-600">No recent bookings</p>
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
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.user_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.court_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.date} at {booking.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Rs. {booking.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
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

export default AdminDashboard
