import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Clock } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';

function AddressAutocomplete({ 
  value, 
  onChange, 
  placeholder, 
  savedAddresses = [],
  onSaveAddress,
  onLocationSelect,
  className = '' 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [placesService, setPlacesService] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const inputRef = useRef(null);
  const debouncedValue = useDebounce(value, 500);

  // Initialize Google Maps services
  useEffect(() => {
    const initializeGoogleMaps = async () => {
      if (window.google && window.google.maps) {
        const geocoderInstance = new window.google.maps.Geocoder();
        setGeocoder(geocoderInstance);
        
        // Create a dummy map for places service
        const map = new window.google.maps.Map(document.createElement('div'));
        const placesServiceInstance = new window.google.maps.places.PlacesService(map);
        setPlacesService(placesServiceInstance);
      }
    };

    if (window.google) {
      initializeGoogleMaps();
    } else {
      // Load Google Maps API if not already loaded
      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.onload = initializeGoogleMaps;
      document.head.appendChild(script);
    }
  }, []);

  // Get place predictions from Google Places API
  const getPlacePredictions = (input) => {
    if (!placesService || !input || input.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: input,
        types: ['address', 'establishment', 'geocode'],
        componentRestrictions: {} // Remove to allow worldwide search
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.map(p => ({
            description: p.description,
            placeId: p.place_id
          })));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    );
  };

  // Geocode address to get coordinates
  const geocodeAddress = (address, placeId = null) => {
    if (!geocoder) return;

    setIsGeocoding(true);
    
    const request = placeId 
      ? { placeId: placeId }
      : { address: address };

    geocoder.geocode(request, (results, status) => {
      setIsGeocoding(false);
      
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const coordinates = {
          lat: location.lat(),
          lng: location.lng()
        };
        
        if (onLocationSelect) {
          onLocationSelect({
            address: results[0].formatted_address,
            coordinates: coordinates,
            placeId: results[0].place_id
          });
        }
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  };
  useEffect(() => {
    getPlacePredictions(debouncedValue);
  }, [debouncedValue, placesService]);

  useEffect(() => {
    if (debouncedValue.length > 10 && !showSuggestions) {
      // Geocode the current value if no suggestions are shown
      geocodeAddress(debouncedValue);
    }
  }, [debouncedValue, showSuggestions, geocoder]);

  const handleSelectAddress = (suggestion) => {
    if (typeof suggestion === 'string') {
      // Handle saved address selection
      onChange(suggestion);
      geocodeAddress(suggestion);
    } else if (suggestion.placeId) {
      // Handle Google Places suggestion
      onChange(suggestion.description);
      geocodeAddress(suggestion.description, suggestion.placeId);
    } else {
      // Handle manual address object
      const addressString = suggestion.address || suggestion;
      onChange(addressString);
      
      if (suggestion.coordinates && onLocationSelect) {
        onLocationSelect(suggestion);
      }
    }
    
    setShowSuggestions(false);
    setShowSaved(false);
  };

  const handleSaveCurrentAddress = () => {
    if (value && onSaveAddress) {
      onSaveAddress(value);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (savedAddresses.length > 0) setShowSaved(true);
          }}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 hover:border-gray-400 ${className}`}
        />
        {isGeocoding && (
          <div className="absolute right-2 top-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600 border-t-2"></div>
          </div>
        )}
        {value && onSaveAddress && (
          <button
            type="button"
            onClick={handleSaveCurrentAddress}
            className={`absolute ${isGeocoding ? 'right-10' : 'right-2'} top-2 text-xs text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded hover:bg-emerald-50 transition-colors`}
          >
            Save
          </button>
        )}
      </div>

      {/* Saved Addresses */}
      {showSaved && savedAddresses.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-xl max-h-48 overflow-y-auto animate-fadeInUp">
          <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Recent Addresses</span>
            </div>
          </div>
          {savedAddresses.map((address, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectAddress(address)}
              className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 text-sm border-b border-gray-100 last:border-b-0 transition-all duration-200"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span>{address}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Address Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-xl max-h-48 overflow-y-auto animate-fadeInUp">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectAddress(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 text-sm border-b border-gray-100 last:border-b-0 transition-all duration-200"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span>{suggestion.description || suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressAutocomplete;
