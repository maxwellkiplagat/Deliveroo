import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Maximize2 } from 'lucide-react';

function LiveMapView({ 
  pickup, 
  destination, 
  currentLocation, 
  className = '',
  showControls = true,
  autoCenter = true,
  onLocationClick
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Clear existing markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  // Add marker to map
  const addMarker = (position, title, color, icon) => {
    if (!mapInstanceRef.current) return;

    const marker = new window.google.maps.Marker({
      position: position,
      map: mapInstanceRef.current,
      title: title,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        `)}`,
        scaledSize: new window.google.maps.Size(32, 32),
        anchor: new window.google.maps.Point(16, 32)
      }
    });

    // Add click listener if callback provided
    if (onLocationClick) {
      marker.addListener('click', () => {
        onLocationClick(position, title);
      });
    }

    markersRef.current.push(marker);
    return marker;
  };

  // Initialize map
  useEffect(() => {
    if (!apiKey) {
      console.warn('Google Maps API key not found');
      return;
    }

    const initializeMap = () => {
      if (mapRef.current && !mapInstanceRef.current) {
        // Determine map center
        let center = { lat: 0, lng: 0 }; // Default to world center
        
        if (pickup && destination) {
          center = {
            lat: (pickup.lat + destination.lat) / 2,
            lng: (pickup.lng + destination.lng) / 2
          };
        } else if (pickup) {
          center = pickup;
        } else if (destination) {
          center = destination;
        }

        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          zoom: pickup || destination ? 12 : 2,
          center: center,
          mapTypeId: 'roadmap',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setMapLoaded(true);
      }
    };

    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      // Load Google Maps API if not already loaded
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.onload = initializeMap;
      script.onerror = () => console.error('Error loading Google Maps API');
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        clearMarkers();
        mapInstanceRef.current = null;
      }
    };
  }, [apiKey]);

  // Update markers when locations change
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    clearMarkers();

    // Add pickup marker
    if (pickup) {
      addMarker(pickup, 'Pickup Location', '#10b981', 'pickup');
    }

    // Add destination marker
    if (destination) {
      addMarker(destination, 'Destination', '#ef4444', 'destination');
    }

    // Add current location marker
    if (currentLocation) {
      addMarker(currentLocation, 'Current Location', '#3b82f6', 'current');
    }

    // Auto-center map if enabled
    if (autoCenter && (pickup || destination || currentLocation)) {
      const bounds = new window.google.maps.LatLngBounds();
      
      if (pickup) bounds.extend(pickup);
      if (destination) bounds.extend(destination);
      if (currentLocation) bounds.extend(currentLocation);
      
      mapInstanceRef.current.fitBounds(bounds);
      
      // Ensure minimum zoom level
      const listener = window.google.maps.event.addListener(mapInstanceRef.current, 'bounds_changed', () => {
        if (mapInstanceRef.current.getZoom() > 15) {
          mapInstanceRef.current.setZoom(15);
        }
        window.google.maps.event.removeListener(listener);
      });
    }

    // Draw route if both pickup and destination exist
    if (pickup && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#10b981',
          strokeOpacity: 0.8,
          strokeWeight: 4
        }
      });

      directionsRenderer.setMap(mapInstanceRef.current);

      directionsService.route({
        origin: pickup,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        }
      });
    }
  }, [pickup, destination, currentLocation, mapLoaded, autoCenter]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const centerMap = () => {
    if (!mapInstanceRef.current) return;
    
    if (pickup && destination) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(pickup);
      bounds.extend(destination);
      if (currentLocation) bounds.extend(currentLocation);
      mapInstanceRef.current.fitBounds(bounds);
    } else if (pickup) {
      mapInstanceRef.current.setCenter(pickup);
      mapInstanceRef.current.setZoom(14);
    } else if (destination) {
      mapInstanceRef.current.setCenter(destination);
      mapInstanceRef.current.setZoom(14);
    }
  };

  // Show message if no API key
  if (!apiKey) {
    return (
      <div className={`w-full h-96 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Google Maps API key not configured</p>
          <p className="text-sm text-gray-500">Please set VITE_GOOGLE_MAPS_API_KEY in your .env file</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : `w-full h-96 rounded-lg overflow-hidden ${className}`}`}>
      <div ref={mapRef} className="w-full h-full" />
      
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={centerMap}
            className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            title="Center Map"
          >
            <Navigation className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <Maximize2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      )}

      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        >
          Exit Fullscreen
        </button>
      )}

      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveMapView;