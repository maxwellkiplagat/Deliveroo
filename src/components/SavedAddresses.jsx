import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Home, Briefcase, Heart } from 'lucide-react';
import LiveMapView from './LiveMapView';
import AddressAutocomplete from './AddressAutocomplete'; // Make sure this import exists
import api from '../services/api';

function SavedAddresses({ onSelectAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showMapPreview, setShowMapPreview] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'home',
    coordinates: null
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/saved-addresses');
      setAddresses(response.data.map(addr => ({
        id: addr.id,
        name: addr.addressName,
        address: addr.address,
        type: addr.type || 'home',
        coordinates: { lat: addr.latitude, lng: addr.longitude }
      })));
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addressTypes = {
    home: { icon: Home, color: 'text-blue-600 bg-blue-100' },
    work: { icon: Briefcase, color: 'text-green-600 bg-green-100' },
    favorite: { icon: Heart, color: 'text-red-600 bg-red-100' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const addressData = {
        addressName: formData.name,
        address: formData.address,
        type: formData.type,
        latitude: formData.coordinates?.lat || 40.7128,
        longitude: formData.coordinates?.lng || -74.0060
      };

      if (editingAddress) {
        await api.put(`/saved-addresses/${editingAddress.id}`, addressData);
      } else {
        await api.post('/saved-addresses', addressData);
      }

      await fetchAddresses();
      setFormData({ name: '', address: '', type: 'home', coordinates: null });
      setShowAddForm(false);
      setEditingAddress(null);
      setShowMapPreview(false);
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      address: address.address,
      type: address.type,
      coordinates: address.coordinates
    });
    setShowAddForm(true);
    setShowMapPreview(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await api.delete(`/saved-addresses/${id}`);
        await fetchAddresses();
      } catch (error) {
        console.error('Failed to delete address:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', address: '', type: 'home', coordinates: null });
    setShowAddForm(false);
    setEditingAddress(null);
    setShowMapPreview(false);
  };

  const handleAddressChange = (address) => {
    setFormData(prev => ({ ...prev, address }));
  };

  const handleLocationSelect = (locationData) => {
    setFormData(prev => ({
      ...prev,
      address: locationData.address,
      coordinates: locationData.coordinates
    }));
    setShowMapPreview(true);
  };

  const handleViewOnMap = (address) => {
    setSelectedAddress(address);
    setShowMapPreview(true);
  };

  const handleUseAddress = (address, type = 'pickup') => {
    if (onSelectAddress) {
      onSelectAddress(address, type === 'pickup' ? 'pickupAddress' : 'destinationAddress');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Saved Addresses</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            <span>Add Address</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading addresses...</p>
          </div>
        ) : (
          <>
            {showAddForm && (
              <div className="mb-6 p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                <h4 className="font-medium mb-3">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g., Home, Office, Mom's House"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Address
                      </label>
                      <AddressAutocomplete
                        value={formData.address}
                        onChange={handleAddressChange}
                        onLocationSelect={handleLocationSelect}
                        placeholder="Enter complete address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="favorite">Favorite</option>
                      </select>
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                      >
                        {editingAddress ? 'Update' : 'Save'} Address
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                  
                  {/* Map Preview */}
                  {showMapPreview && formData.coordinates && (
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-700">Location Preview</h5>
                      <LiveMapView
                        pickup={formData.coordinates}
                        className="h-64 rounded-lg border border-gray-300"
                        showControls={true}
                        autoCenter={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {addresses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No saved addresses yet</p>
                  <p className="text-sm">Add your frequently used addresses for quick access</p>
                </div>
              ) : (
                addresses.map(address => {
                  const TypeIcon = addressTypes[address.type].icon;
                  const typeColor = addressTypes[address.type].color;
                  
                  return (
                    <div
                      key={address.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${typeColor}`}>
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{address.name}</h4>
                          <p className="text-sm text-gray-600">{address.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewOnMap(address)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          View Map
                        </button>
                        {onSelectAddress && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleUseAddress(address, 'pickup')}
                              className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                            >
                              Pickup
                            </button>
                            <button
                              onClick={() => handleUseAddress(address, 'destination')}
                              className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                            >
                              Destination
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => handleEdit(address)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
        
        {/* Map Preview Modal */}
        {showMapPreview && selectedAddress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedAddress.name}</h3>
                <button
                  onClick={() => {
                    setShowMapPreview(false);
                    setSelectedAddress(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">{selectedAddress.address}</p>
              <LiveMapView
                pickup={selectedAddress.coordinates}
                className="h-64 rounded-lg"
                showControls={true}
                autoCenter={true}
              />
              <div className="flex space-x-3 mt-4">
                {onSelectAddress && (
                  <>
                    <button
                      onClick={() => handleUseAddress(selectedAddress, 'pickup')}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Use as Pickup
                    </button>
                    <button
                      onClick={() => handleUseAddress(selectedAddress, 'destination')}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Use as Destination
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedAddresses;