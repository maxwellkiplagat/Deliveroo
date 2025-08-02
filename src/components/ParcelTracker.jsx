import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Clock, Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

function ParcelTracker({ trackingNumber, onTrackingResult }) {
  const [tracking, setTracking] = useState(trackingNumber || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationCache, setLocationCache] = useState({});

  // Memoized function to fetch location names
  const fetchLocationName = useCallback(async (lat, lng) => {
    const cacheKey = `${lat},${lng}`;
    
    // Return cached value if available
    if (locationCache[cacheKey]) {
      return locationCache[cacheKey];
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      const displayName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
      // Update cache
      setLocationCache(prev => ({ ...prev, [cacheKey]: displayName }));
      
      return displayName;
    } catch (error) {
      console.error('Geocoding error:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`; // Fallback to coordinates
    }
  }, [locationCache]);

  // Format location for display
  const getDisplayLocation = useCallback((location) => {
    if (!location) return 'Unknown location';
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location.lat && location.lng) {
      const cacheKey = `${location.lat},${location.lng}`;
      return locationCache[cacheKey] || 'Fetching location...';
    }
    return 'Unknown location';
  }, [locationCache]);

  // Safe date formatting
  const safeFormatDate = (date) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Unknown date';
    }
  };

  // Process and enhance tracking data
  const processTrackingData = useCallback(async (data) => {
    const baseData = {
      trackingNumber: data.trackingNumber,
      status: data.status,
      currentLocation: data.currentLocation,
      estimatedDelivery: data.estimatedDelivery 
        ? new Date(data.estimatedDelivery)
        : new Date(Date.now() + 24 * 60 * 60 * 1000),
      timeline: data.timeline.map(event => ({
        ...event,
        timestamp: new Date(event.timestamp)
      }))
    };

    // Set initial result
    setResult(baseData);
    if (onTrackingResult) onTrackingResult(baseData);

    // Enhance with location names
    const enhancedData = { ...baseData };
    const newCache = { ...locationCache };

    // Process current location
    if (enhancedData.currentLocation && typeof enhancedData.currentLocation === 'object') {
      const { lat, lng } = enhancedData.currentLocation;
      const cacheKey = `${lat},${lng}`;
      if (!newCache[cacheKey]) {
        newCache[cacheKey] = await fetchLocationName(lat, lng);
      }
    }

    // Process timeline locations
    for (const event of enhancedData.timeline) {
      if (event.location && typeof event.location === 'object') {
        const { lat, lng } = event.location;
        const cacheKey = `${lat},${lng}`;
        if (!newCache[cacheKey]) {
          newCache[cacheKey] = await fetchLocationName(lat, lng);
        }
      }
    }

    // Update cache and result
    setLocationCache(newCache);
    setResult({
      ...enhancedData,
      currentLocation: enhancedData.currentLocation,
      timeline: enhancedData.timeline.map(event => ({
        ...event,
        description: `Status changed to ${event.status} at ${
          getDisplayLocation(event.location)
        }`
      }))
    });
  }, [fetchLocationName, getDisplayLocation, locationCache, onTrackingResult]);

  // Track parcel function
  const handleTrack = useCallback(async () => {
    if (!tracking.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`https://deliveroo-f2ec.onrender.com/api/parcels/track/${tracking}`);
      if (!res.ok) throw new Error('Parcel not found');
      
      const data = await res.json();
      await processTrackingData(data);
    } catch (err) {
      console.error('Tracking error:', err);
      setError(err.message || 'Tracking failed');
    } finally {
      setLoading(false);
    }
  }, [tracking, processTrackingData]);

  // Status display helpers
  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      picked_up: <Package className="h-4 w-4" />,
      in_transit: <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
    };
    return icons[status] || <AlertCircle className="h-4 w-4" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      picked_up: 'text-blue-600 bg-blue-100',
      in_transit: 'text-indigo-600 bg-indigo-100',
      delivered: 'text-green-600 bg-green-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  // Auto-track if trackingNumber prop changes
  useEffect(() => {
    if (trackingNumber && trackingNumber !== tracking) {
      setTracking(trackingNumber);
      handleTrack();
    }
  }, [trackingNumber, tracking, handleTrack]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Track Your Parcel</h3>    

      <div className="w-full flex flex-col md:flex-row md:items-center md:space-x-2 space-y-2 md:space-y-0 mb-4">
        <input
          type="text"
          placeholder="Enter tracking number (e.g., DEL123456)"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
          data-testid="tracking-input"
        />
        <button
          onClick={handleTrack}
          disabled={loading}
          className="w-full md:w-auto px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          data-testid="track-button"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Tracking...
            </span>
          ) : 'Track'}
        </button>
      </div>


      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="inline mr-2 h-4 w-4" />
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
                <p className="font-medium flex items-center">
                  <MapPin className="h-12 w-4 mr-1 text-emerald-600" />
                  {getDisplayLocation(result.currentLocation)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-emerald-600" />
                  {safeFormatDate(result.estimatedDelivery)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-medium">Tracking Timeline</h5>
              <div className="relative">
                <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200"></div>
                {result.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3 relative pl-8">
                    <div className={`absolute left-0 p-2 rounded-full ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium capitalize">{event.status.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-500">
                          {safeFormatDate(event.timestamp)}
                        </p>
                      </div>                    
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-emerald-600" />
                        {getDisplayLocation(event.location)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParcelTracker;
