import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

function ParcelTracker({ trackingNumber, onTrackingResult }) {
  const [tracking, setTracking] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!tracking.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock tracking lookup
      setTimeout(() => {
        const mockResult = {
          trackingNumber: tracking,
          status: 'in_transit',
          currentLocation: 'Distribution Center, Brooklyn',
          estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000),
          timeline: [
            {
              status: 'pending',
              location: 'Order Placed',
              timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
              description: 'Your order has been received and is being processed'
            },
            {
              status: 'picked_up',
              location: 'Pickup Location',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
              description: 'Package picked up from sender'
            },
            {
              status: 'in_transit',
              location: 'Distribution Center, Brooklyn',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              description: 'Package is on its way to destination'
            }
          ]
        };
        
        setResult(mockResult);
        setLoading(false);
        if (onTrackingResult) onTrackingResult(mockResult);
      }, 1000);
    } catch (err) {
      setError('Failed to track parcel. Please try again.');
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'picked_up': return <Package className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'picked_up': return 'text-blue-600 bg-blue-100';
      case 'in_transit': return 'text-indigo-600 bg-indigo-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Track Your Parcel</h3>
      
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Enter tracking number (e.g., DEL123456)"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
        />
        <button
          onClick={handleTrack}
          disabled={loading}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Tracking: {result.trackingNumber}</h4>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                {getStatusIcon(result.status)}
                <span className="ml-1 capitalize">{result.status.replace('_', ' ')}</span>
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Current Location</p>
                <p className="font-medium">{result.currentLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-medium">{format(result.estimatedDelivery, 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-medium">Tracking Timeline</h5>
              {result.timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getStatusColor(event.status)}`}>
                    {getStatusIcon(event.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium capitalize">{event.status.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500">
                        {format(event.timestamp, 'MMM dd, HH:mm')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParcelTracker;