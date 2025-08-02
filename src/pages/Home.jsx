import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Shield, Clock, Search } from 'lucide-react';
import ParcelTracker from '../components/ParcelTracker';

function Home() {
  const [showTracker, setShowTracker] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 pt-16">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Fast & Reliable
              <span className="text-emerald-600"> Parcel Delivery</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Send your parcels with confidence. Track in real-time, get instant updates, 
              and enjoy seamless delivery experiences.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link
                to="/register"
                className="block w-full sm:w-auto bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="block w-full sm:w-auto border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tracking Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Track Your Parcel
            </h2>
            <p className="text-gray-600 mb-6">
              Enter your tracking number to get real-time updates on your delivery
            </p>
            <ParcelTracker />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Deliveroo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Book your delivery in just a few clicks with our intuitive interface.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Track your parcel's location and status in real-time on interactive maps.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Safe</h3>
              <p className="text-gray-600">
                Your parcels are insured and handled with the utmost care and security.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Same-day and next-day delivery options available for urgent packages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Send Your First Parcel?
          </h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Deliveroo for their delivery needs.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Start Shipping Today
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
