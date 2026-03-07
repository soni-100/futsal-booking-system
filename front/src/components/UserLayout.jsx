import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default UserLayout
