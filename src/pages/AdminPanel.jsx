
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateParcel, fetchAllParcelsForAdmin, updateParcelLocation } from '../redux/parcelsSlice';
import { addNotification } from '../redux/notificationSlice';
import { Search, Filter, Edit, BarChart3, Package, Users, TrendingUp } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import DeliveryAnalytics from '../components/DeliveryAnalytics';
import CourierAssignment from '../components/CourierAssignment';
import CourierManagement from '../components/CourierManagement';
import EmailNotifications from '../components/EmailNotifications';
import AddressAutocomplete from '../components/AddressAutocomplete';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('parcels');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingParcel, setEditingParcel] = useState(null);
  const [editData, setEditData] = useState({
    address: '',
    coordinates: null
  });

  const isMounted = useRef(true);
  const { parcels, loading } = useSelector(state => state.parcels);
  const safeParcels = Array.isArray(parcels) ? parcels : [];

  const dispatch = useDispatch();

  useEffect(() => {
    isMounted.current = true;
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try {
        await dispatch(fetchAllParcelsForAdmin({ signal: abortController.signal }))
          .unwrap();
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted.current) {
          console.error('Admin fetch failed:', err);
          safeAddNotification({
            type: 'error',
            message: 'Failed to load parcels. Please try again.'
          });
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted.current = false;
      abortController.abort();
    };
  }, [dispatch]);

  // Safe notification function
  const safeAddNotification = (notification) => {
    if (isMounted.current) {
      dispatch(addNotification(notification));
    }
  };

  const handleStatusUpdate = (parcelId, newStatus) => {
    // Validate status value
    const validStatuses = ['pending', 'picked_up', 'in_transit', 'delivered', 'cancelled'];
    
    if (!newStatus || !validStatuses.includes(newStatus)) {
      safeAddNotification({
        type: 'error',
        message: 'Please select a valid status'
      });
      return;
    }
    
    dispatch(updateParcel({ 
      id: parcelId, 
      updates: { 
        status: newStatus,
        location: 'Status updated by admin'
      }
    })).then(() => {
      safeAddNotification({
        type: 'success',
        message: 'Parcel status updated successfully!'
      });
      dispatch(fetchAllParcelsForAdmin());
    }).catch(error => {
      safeAddNotification({
        type: 'error',
        message: error.payload || 'Failed to update parcel status'
      });
    });
  };

  const handleLocationUpdate = (parcelId, newLocation) => {
    const parcel = parcels.find(p => p.id === parcelId);
    if (parcel.status === 'cancelled') {
      safeAddNotification({
        type: 'error',
        message: 'Cannot update location of a cancelled parcel'
      });
      return;
    }    
    if (!parcel || !newLocation || typeof newLocation.lat !== 'number' || typeof newLocation.lng !== 'number') {
      safeAddNotification({
        type: 'error',
        message: 'Invalid location data'
      });
      return;
    }
    
    dispatch(updateParcelLocation({
      id: parcelId,
      location: newLocation,
      timeline: [
        ...(parcel.timeline || []),
        {
          status: parcel.status,
          timestamp: new Date().toISOString(),
          location: 'Location updated by Admin'
        }
      ]

    })).then(() => {
      safeAddNotification({
        type: 'success',
        message: 'Parcel location updated successfully!'
      });
      dispatch(fetchAllParcelsForAdmin());
    }).catch(error => {
      safeAddNotification({
        type: 'error',
        message: error.payload || 'Failed to update location'
      });
    });
  };

  const handleAddressSelect = (locationData) => {
    if (locationData && locationData.coordinates) {
      setEditData({
        address: locationData.address,
        coordinates: locationData.coordinates
      });
    }
  };

  const handleCourierAssign = (parcelId, courier) => {
    safeAddNotification({
      type: 'success',
      message: `Courier ${courier.name} assigned to parcel successfully!`
    });
  };

  const filteredParcels = (Array.isArray(parcels) ? parcels : []).filter(parcel => {
    const matchesSearch = parcel.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          parcel.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          parcel.receiverName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || parcel.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: safeParcels.length,
    pending: safeParcels.filter(p => p.status === 'pending').length,
    inTransit: safeParcels.filter(p => p.status === 'in_transit').length,
    delivered: safeParcels.filter(p => p.status === 'delivered').length,
    cancelled: safeParcels.filter(p => p.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-16">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Admin Panel</h1>
        <p className="text-xs sm:text-base text-gray-600">Manage all parcel deliveries and track performance</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-4 sm:mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
            <button
              onClick={() => setActiveTab('parcels')}
              className={`py-2 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'parcels'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Parcel Management
            </button>
            <button
              onClick={() => setActiveTab('couriers')}
              className={`py-2 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'couriers'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Courier Management
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-2 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'notifications'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Email Notifications
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <DeliveryAnalytics />
      ) : activeTab === 'couriers' ? (
        <CourierManagement />
      ) : activeTab === 'notifications' ? (
        <EmailNotifications />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-600">Total Parcels</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
              </div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-600">Pending</p>
                  <p className="text-lg sm:text-xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-600">In Transit</p>
                  <p className="text-lg sm:text-xl font-bold text-blue-600">{stats.inTransit}</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-600">Delivered</p>
                  <p className="text-lg sm:text-xl font-bold text-green-600">{stats.delivered}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-3 sm:mb-4">
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search parcels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-7 sm:pl-9 pr-2 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 text-xs sm:text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="picked_up">Picked Up</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Parcels Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] sm:min-w-0">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking #
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sender/Receiver
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParcels.map((parcel) => (
                    <tr key={parcel.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">{parcel.trackingNumber}</div>
                        <div className="text-xs text-gray-500">ksh {parcel.price}</div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900">{parcel.senderName}</div>
                        <div className="text-xs text-gray-500">→ {parcel.receiverName}</div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 max-w-[100px] sm:max-w-xs">
                        <div className="text-xs sm:text-sm text-gray-900 truncate">{parcel.pickupAddress}</div>
                        <div className="text-xs text-gray-500 truncate">→ {parcel.destinationAddress}</div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={parcel.status} />
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-1.5">
                          <select
                            value={parcel.status || ''}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              if (!newStatus) return;
                              
                              if ((parcel.status === 'delivered' && newStatus !== 'delivered')||
                                  (parcel.status === 'cancelled' && newStatus !== 'cancelled')){
                                alert('Cannot change status of delivered parcels');
                                return;
                              }
                              handleStatusUpdate(parcel.id, newStatus);
                            }}
                            className="text-xs border border-gray-300 rounded px-1 py-0.5 sm:px-2 sm:py-1"
                          >
                            <option value="">Select Status</option>
                            <option value="pending">Pending</option>
                            <option value="picked_up">Picked Up</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                setEditingParcel(parcel.id);
                                setEditData({
                                  address: '',
                                  coordinates: null
                                });
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                            <CourierAssignment 
                              parcel={parcel}
                              onAssign={handleCourierAssign}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Modal */}
          {editingParcel && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white rounded-lg p-4 w-full max-w-md mx-2">
                <h2 className="text-lg sm:text-xl font-bold mb-3">Update Location</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Location Address
                    </label>
                    <AddressAutocomplete
                      value={editData.address}
                      onChange={(value) => setEditData(prev => ({...prev, address: value}))}
                      onLocationSelect={handleAddressSelect}
                      placeholder="Enter location address"
                      types={['address']}
                      componentRestrictions={{ country: 'us' }}
                    />
                  </div>
                  
                  <div className="flex space-x-2 sm:space-x-3">
                    <button
                      onClick={() => {
                        setEditingParcel(null);
                        setEditData({
                          address: '',
                          coordinates: null
                        });
                      }}
                      className="flex-1 px-3 py-1.5 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!editData.coordinates || 
                            typeof editData.coordinates.lat !== 'number' || 
                            typeof editData.coordinates.lng !== 'number') {
                          safeAddNotification({
                            type: 'error',
                            message: 'Please select a valid location'
                          });
                          return;
                        }
                        
                        handleLocationUpdate(editingParcel, editData.coordinates);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPanel;
