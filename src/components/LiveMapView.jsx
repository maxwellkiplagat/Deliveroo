import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Navigation, Maximize2 } from 'lucide-react';

function LiveMapView({
  pickup,
  destination,
  currentLocation,
  className = '',
  showControls = true,
  autoCenter = true,
  onLocationClick,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  const addMarker = (position, title, color, type) => {
    if (!mapInstanceRef.current) return;

    let marker;

    if (type === 'current') {
      marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: '#3300ff',
          fillOpacity: 1,
          strokeColor: '#00bfff',
          strokeWeight: 2,
        },
        label: {
          text: 'C',
          color: '#ffff00',
          fontWeight: 'bold',
        },
      });

      // Animate pulse
      let scale = 6;
      let growing = true;
      const heartbeat = setInterval(() => {
        if (!marker.getMap()) return clearInterval(heartbeat);
        scale += growing ? 0.3 : -0.3;
        if (scale >= 14) growing = false;
        if (scale <= 6) growing = true;
        marker.setIcon({ ...marker.getIcon(), scale });
      }, 10);

    } else {
      const svgIcon = {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5
              c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5
              2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        `)}`,
        scaledSize: new window.google.maps.Size(32, 32),
        anchor: new window.google.maps.Point(16, 32),
      };

      marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title,
        icon: svgIcon,
      });
    }

    if (onLocationClick) {
      marker.addListener('click', () => onLocationClick(position, title));
    }

    markersRef.current.push(marker);
    return marker;
  };

  const updateMap = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    clearMarkers();

    if (pickup) addMarker(pickup, 'Pickup Location', '#10b981', 'pickup');
    if (destination) addMarker(destination, 'Destination', '#ef4444', 'destination');
    if (currentLocation) addMarker(currentLocation, 'Current Location', '#3b82f6', 'current');

    // Auto-center
    if (autoCenter) {
      const bounds = new window.google.maps.LatLngBounds();
      [pickup, destination, currentLocation].forEach(pos => {
        if (pos) bounds.extend(pos);
      });
      if (!bounds.isEmpty()) map.fitBounds(bounds);
    }

    // Draw route
    if (pickup && destination) {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: '#10b981',
          strokeOpacity: 0.8,
          strokeWeight: 4,
        },
      });

      directionsRenderer.setMap(map);
      directionsRendererRef.current = directionsRenderer;

      directionsService.route(
        {
          origin: pickup,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(result);
          } else {
            console.error('Failed to get directions:', status);
          }
        }
      );
    }
  };

  const initializeMap = () => {
    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center: currentLocation || pickup || destination || { lat: 0, lng: 0 },
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: showControls,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      mapInstanceRef.current = map;
      setMapLoaded(true);
      updateMap();
    });
  };

  useEffect(() => {
    if (!apiKey) return;
    initializeMap();
    return () => {
      if (directionsRendererRef.current) directionsRendererRef.current.setMap(null);
      clearMarkers();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapLoaded) updateMap();
  }, [pickup, destination, currentLocation]);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const centerMap = () => {
    if (!mapInstanceRef.current) return;
    const bounds = new window.google.maps.LatLngBounds();
    [pickup, destination, currentLocation].forEach(pos => {
      if (pos) bounds.extend(pos);
    });
    if (!bounds.isEmpty()) mapInstanceRef.current.fitBounds(bounds);
  };

  if (!apiKey) {
    return (
      <div className={`w-full h-96 bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Google Maps API key not configured</p>
          <p className="text-sm text-gray-500">Please set VITE_GOOGLE_MAPS_API_KEY in your .env file</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : `w-full h-96 rounded-xl shadow-md overflow-hidden ${className}`} relative`}>
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
