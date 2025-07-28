import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

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
  const directionsRendererRef = useRef(null);
  const markersRef = useRef([]);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center: currentLocation || { lat: 0, lng: 0 },
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: showControls,
      });

      mapInstanceRef.current = map;
      updateMap();
    });

    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) updateMap();
  }, [pickup, destination, currentLocation]);

  const updateMap = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Place pickup marker
    if (pickup) {
      const pickupMarker = new window.google.maps.Marker({
        position: pickup,
        map,
        label: 'P',
        title: 'Pickup',
      });
      markersRef.current.push(pickupMarker);
    }

    // Place destination marker
    if (destination) {
      const destMarker = new window.google.maps.Marker({
        position: destination,
        map,
        label: 'D',
        title: 'Destination',
      });
      markersRef.current.push(destMarker);
    }

    // Place current location marker
    if (currentLocation) {
      const currentMarker = new window.google.maps.Marker({
        position: currentLocation,
        map,
        label: 'C',
        title: 'Current Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      });
      markersRef.current.push(currentMarker);
    }

    // Adjust viewport
    if (autoCenter) {
      const bounds = new window.google.maps.LatLngBounds();
      [pickup, destination, currentLocation].forEach(pos => {
        if (pos) bounds.extend(pos);
      });
      if (!bounds.isEmpty()) map.fitBounds(bounds);
    }

    // Remove old polyline
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }

    // Draw new polyline if both points are present
    if (pickup && destination) {
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
          destination: destination,
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

  return (
    <div
      ref={mapRef}
      className={`w-full h-full rounded-xl shadow-md overflow-hidden ${className}`}
    />
  );
}

export default LiveMapView;
