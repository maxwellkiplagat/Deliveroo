import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

function MapView({ pickup, destination, currentLocation, className = '' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // Check if API key is available
    if (!apiKey) {
      console.error('oOOPS, map fixing in progress...');
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      if (mapRef.current && !mapInstanceRef.current) {
        // Initialize map centered between pickup and destination
        const center = {
          lat: (pickup.lat + destination.lat) / 2,
          lng: (pickup.lng + destination.lng) / 2
        };

        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          zoom: 12,
          center: center,
          mapTypeId: 'roadmap'
        });

        // Add pickup marker
        new window.google.maps.Marker({
          position: pickup,
          map: mapInstanceRef.current,
          title: 'Pickup Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" width="24" height="24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32)
          }
        });

        // Add destination marker
        new window.google.maps.Marker({
          position: destination,
          map: mapInstanceRef.current,
          title: 'Destination',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" width="24" height="24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32)
          }
        });

        // Add current location marker if available
        if (currentLocation) {
          new window.google.maps.Marker({
            position: currentLocation,
            map: mapInstanceRef.current,
            title: 'Current Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="24" height="24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 32)
            }
          });
        }

        // Draw route
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
    }).catch(error => {
      console.error('Error loading Google Maps:', error);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [pickup, destination, currentLocation, apiKey]);

  // Show message if no API key
  if (!apiKey) {
    return (
      <div className={`w-full h-96 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <p className="text-gray-600 mb-2">Google Maps API key not configured</p>
          <p className="text-sm text-gray-500">Oops map fixing in progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

export default MapView;

