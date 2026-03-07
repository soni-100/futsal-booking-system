import React from 'react'
import { Link } from 'react-router-dom'
import { FaFutbol, FaClock, FaMapMarkerAlt, FaStar, FaArrowRight } from 'react-icons/fa'

const Home = () => {
  const features = [
    {
      icon: FaClock,
      title: 'Easy Booking',
      description: 'Book your favorite futsal court in just a few clicks',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Multiple Locations',
      description: 'Choose from various futsal courts across the city',
    },
    {
      icon: FaStar,
      title: 'Best Facilities',
      description: 'Enjoy top-quality courts with excellent facilities',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <FaFutbol className="mx-auto text-6xl mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Book Your Futsal Court
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Find and book the best futsal courts in your area
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courts"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Browse Courts</span>
                <FaArrowRight />
              </Link>
              <Link
                to="/register"
                className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors border-2 border-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-primary-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow"
              >
                <feature.icon className="mx-auto text-4xl text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Ready to Play?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of players booking courts every day
          </p>
          <Link
            to="/register"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
