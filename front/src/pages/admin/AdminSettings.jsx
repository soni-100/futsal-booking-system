import React, { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { FaCog, FaSave, FaUser, FaLock, FaBell } from 'react-icons/fa'

const AdminSettings = () => {
  const { admin } = useAdmin()
  const [settings, setSettings] = useState({
    site_name: 'Futsal Booking',
    site_email: 'admin@futsalbooking.com',
    booking_advance_days: 30,
    cancellation_hours: 24,
    maintenance_mode: false,
  })
  const [profile, setProfile] = useState({
    email: admin?.email || '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile({
      ...profile,
      [name]: value,
    })
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      // Mock save - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage('Settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    if (profile.new_password !== profile.confirm_password) {
      setMessage('New passwords do not match')
      setSaving(false)
      return
    }

    try {
      // Mock save - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage('Profile updated successfully!')
      setProfile({
        ...profile,
        current_password: '',
        new_password: '',
        confirm_password: '',
      })
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General Settings', icon: FaCog },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your admin settings</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
                >
                  <tab.icon />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-md ${
              message.includes('successfully')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  name="site_name"
                  value={settings.site_name}
                  onChange={handleSettingsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Email
                </label>
                <input
                  type="email"
                  name="site_email"
                  value={settings.site_email}
                  onChange={handleSettingsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Advance Days
                </label>
                <input
                  type="number"
                  name="booking_advance_days"
                  value={settings.booking_advance_days}
                  onChange={handleSettingsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  How many days in advance users can book
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cancellation Hours
                </label>
                <input
                  type="number"
                  name="cancellation_hours"
                  value={settings.cancellation_hours}
                  onChange={handleSettingsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Minimum hours before booking time for cancellation
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="maintenance_mode"
                  checked={settings.maintenance_mode}
                  onChange={handleSettingsChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Maintenance Mode
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <FaSave />
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="current_password"
                  value={profile.current_password}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={profile.new_password}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={profile.confirm_password}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <FaLock />
                  <span>{saving ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                <div>
                  <h3 className="font-medium text-gray-900">New Booking Notifications</h3>
                  <p className="text-sm text-gray-600">Get notified when a new booking is created</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                <div>
                  <h3 className="font-medium text-gray-900">Cancellation Notifications</h3>
                  <p className="text-sm text-gray-600">Get notified when a booking is cancelled</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                <div>
                  <h3 className="font-medium text-gray-900">Daily Reports</h3>
                  <p className="text-sm text-gray-600">Receive daily booking reports via email</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminSettings
