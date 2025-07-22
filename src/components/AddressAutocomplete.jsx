import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Clock } from 'lucide-react';

function AddressAutocomplete({ 
  value, 
  onChange, 
  placeholder, 
  savedAddresses = [],
  onSaveAddress,
  className = '' 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const inputRef = useRef(null);

  // Mock address suggestions (in real app, use Google Places API)
  const mockSuggestions = [
    '123 Main Street, New York, NY 10001',
    '456 Broadway, New York, NY 10013',
    '789 Fifth Avenue, New York, NY 10022',
    '321 Park Avenue, New York, NY 10010',
    '654 Wall Street, New York, NY 10005',
  ];

  useEffect(() => {
    if (value.length > 2) {
      const filtered = mockSuggestions.filter(addr => 
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  const handleSelectAddress = (address) => {
    onChange(address);
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
          className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${className}`}
        />
        {value && onSaveAddress && (
          <button
            type="button"
            onClick={handleSaveCurrentAddress}
            className="absolute right-2 top-2 text-xs text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded"
          >
            Save
          </button>
        )}
      </div>

      {/* Saved Addresses */}
      {showSaved && savedAddresses.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Recent Addresses</span>
            </div>
          </div>
          {savedAddresses.map((address, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectAddress(address)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
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
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectAddress(suggestion)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span>{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressAutocomplete;