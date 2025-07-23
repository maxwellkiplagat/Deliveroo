import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParcels, updateParcel } from '../redux/parcelsSlice';
import { addNotification } from '../redux/notificationSlice';
import { Search, Filter, Edit, BarChart3, Package, Users, TrendingUp, User } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import DeliveryAnalytics from '../components/DeliveryAnalytics';
import CourierAssignment from '../components/CourierAssignment';
import CourierManagement from '../components/CourierManagement';
import EmailNotifications from '../components/EmailNotifications';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('parcels');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingParcel, setEditingParcel] = useState(null);
  const [editData, setEditData] = useState({});

  const { parcels, loading } = useSelector(state => state.parcels);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchParcels());
  }, [dispatch]);

  const handleStatusUpdate = (parcelId, newStatus) => {
    dispatch(updateParcel({ 
      id: parcelId, 
      updates: { 
        status: newStatus,
        timeline: [
          ...parcels.find(p => p.id === parcelId).timeline,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            location: 'Updated by Admin'
          }
        ]
      } 
    })).then(() => {
      dispatch(addNotification({
        type: 'success',
        message: 'Parcel status updated successfully!'
      }));
    });
  };

  const handleLocationUpdate = (parcelId, newLocation) => {
    const parcel = parcels.find(p => p.id === parcelId);
    dispatch(updateParcel({ 
      id: parcelId, 
      updates: { 
        currentLocation: newLocation,
        timeline: [
          ...parcel.timeline,
          {
            status: parcel.status,
            timestamp: new Date().toISOString(),
            location: 'Location updated by Admin'
          }
        ]
      } 
    })).then(() => {
      dispatch(addNotification({
        type: 'success',
        message: 'Parcel location updated successfully!'
      }));
    });
  };

  const handleCourierAssign = (parcelId, courier) => {
    dispatch(addNotification({
      type: 'success',
      message: `Courier ${courier.name} assigned to parcel successfully!`
    }));
  };

  const filteredParcels = parcels.filter(parcel => {
    const matchesSearch = parcel.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parcel.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parcel.receiverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || parcel.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: parcels.length,
    pending: parcels.filter(p => p.status === 'pending').length,
    inTransit: parcels.filter(p => p.status === 'in_transit').length,
    delivered: parcels.filter(p => p.status === 'delivered').length,
    cancelled: parcels.filter(p => p.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage all parcel deliveries and track performance</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('parcels')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'parcels'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Parcel Management
            </button>
            <button
              onClick={() => setActiveTab('couriers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'couriers'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Courier Management
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Email Notifications
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Parcels</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Package className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inTransit}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search parcels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender/Receiver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParcels.map((parcel) => (
                <tr key={parcel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{parcel.trackingNumber}</div>
                    <div className="text-sm text-gray-500">${parcel.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{parcel.senderName}</div>
                    <div className="text-sm text-gray-500">→ {parcel.receiverName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{parcel.pickupAddress}</div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">→ {parcel.destinationAddress}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={parcel.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <select
                      value={parcel.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        // Check if status change is allowed
                        if (parcel.status === 'delivered' && newStatus !== 'delivered') {
                          alert('Cannot change status of delivered parcels');
                          return;
                        }
                        handleStatusUpdate(parcel.id, newStatus);
                      }}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="picked_up">Picked Up</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => setEditingParcel(parcel.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <CourierAssignment 
                      parcel={parcel}
                      onAssign={handleCourierAssign}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Parcel Location</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={editData.lat || ''}
                  onChange={(e) => setEditData({...editData, lat: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={editData.lng || ''}
                  onChange={(e) => setEditData({...editData, lng: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setEditingParcel(null);
                    setEditData({});
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleLocationUpdate(editingParcel, { 
                      ...editData, 
                      adminUpdate: true 
                    });
                    setEditingParcel(null);
                    setEditData({});
                  }}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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
