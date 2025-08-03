
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Home, Briefcase, Heart } from 'lucide-react';
import LiveMapView from './LiveMapView';
import AddressAutocomplete from './AddressAutocomplete';
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
      const res = await api.get('/saved-addresses');
      setAddresses(res.data.map(addr => ({
        id: addr.id,
        name: addr.addressName,
        address: addr.address,
        type: addr.type || 'home',
        coordinates: { lat: addr.latitude, lng: addr.longitude }
      })));
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.coordinates) return alert('Select an address');

    const payload = {
      addressName: formData.name,
      address: formData.address,
      type: formData.type,
      latitude: formData.coordinates.lat,
      longitude: formData.coordinates.lng,
    };

    try {
      if (editingAddress) {
        await api.put(`/saved-addresses/${editingAddress.id}`, payload);
      } else {
        await api.post('/saved-addresses', payload);
      }
      await fetchAddresses();
      setFormData({ name: '', address: '', type: 'home', coordinates: null });
      setShowAddForm(false);
      setEditingAddress(null);
      setShowMapPreview(false);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const addressTypes = {
    home: { icon: Home, color: 'text-blue-600 bg-blue-100' },
    work: { icon: Briefcase, color: 'text-green-600 bg-green-100' },
    favorite: { icon: Heart, color: 'text-red-600 bg-red-100' }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold">Saved Addresses</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Address
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading addresses...</div>
      ) : (
        <>
          {showAddForm && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Address Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Full Address</label>
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={(address) => setFormData((prev) => ({ ...prev, address }))}
                    onLocationSelect={(loc) => {
                      setFormData((prev) => ({
                        ...prev,
                        address: loc.address,
                        coordinates: loc.coordinates,
                      }));
                      setShowMapPreview(true);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="favorite">Favorite</option>
                  </select>
                </div>
                {showMapPreview && formData.coordinates && (
                  <LiveMapView
                    pickup={formData.coordinates}
                    className="h-48 rounded border"
                    showControls
                    autoCenter
                  />
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button type="submit" className="flex-1 bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700">
                    {editingAddress ? 'Update' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setFormData({ name: '', address: '', type: 'home', coordinates: null });
                      setEditingAddress(null);
                      setShowMapPreview(false);
                    }}
                    className="flex-1 border py-2 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="text-center text-gray-500">No saved addresses yet</div>
            ) : (
              addresses.map((addr) => {
                const Icon = addressTypes[addr.type]?.icon || Home;
                const color = addressTypes[addr.type]?.color || 'text-gray-600 bg-gray-100';
                return (
                  <div key={addr.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-4 rounded">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${color}`}><Icon className="w-4 h-4" /></div>
                      <div>
                        <div className="font-medium">{addr.name}</div>
                        <div className="text-sm text-gray-600">{addr.address}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
                      <button onClick={() => setSelectedAddress(addr) || setShowMapPreview(true)} className="text-sm text-blue-600 hover:underline">
                        View Map
                      </button>
                      {onSelectAddress && (
                        <>
                          <button onClick={() => onSelectAddress(addr, 'pickupAddress')} className="text-sm text-emerald-600 hover:underline">
                            Pickup
                          </button>
                          <button onClick={() => onSelectAddress(addr, 'destinationAddress')} className="text-sm text-orange-600 hover:underline">
                            Destination
                          </button>
                        </>
                      )}
                      <button onClick={() => {
                        setEditingAddress(addr);
                        setFormData({ name: addr.name, address: addr.address, type: addr.type, coordinates: addr.coordinates });
                        setShowAddForm(true);
                        setShowMapPreview(true);
                      }} className="text-sm text-blue-500 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(addr.id)} className="text-sm text-red-500 hover:underline">
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SavedAddresses;
