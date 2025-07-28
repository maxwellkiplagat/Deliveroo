import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateParcel, cancelParcel } from '../redux/parcelsSlice';
import { addNotification } from '../redux/notificationSlice';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Trash2, MapPin, Calendar, Weight, Banknote, Phone, User } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import LiveMapView from '../components/LiveMapView';

function ParcelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { parcels } = useSelector(state => state.parcels);
  const { user } = useSelector(state => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const parcel = parcels.find(p => p.id === parseInt(id));

  if (!parcel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Parcel not found.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleEdit = () => {
    // Check if parcel can still be updated
    if (!parcel.canUpdate || parcel.status === 'delivered' || parcel.status === 'cancelled') {
      alert('This parcel cannot be edited anymore');
      return;
    }
    
    setEditData({
      destinationAddress: parcel.destinationAddress,
      receiverName: parcel.receiverName,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    dispatch(updateParcel({ id: parcel.id, updates: editData })).then(() => {
      setIsEditing(false);
      dispatch(addNotification({
        type: 'success',
        message: 'Parcel updated successfully!'
      }));
      navigate('/dashboard');
    });
  };

  const handleCancel = () => {
    // Check if parcel can be cancelled
    if (parcel.status === 'delivered') {
      alert('Cannot cancel delivered parcels');
      return;
    }
    
    if (window.confirm('Are you sure you want to cancel this parcel?')) {
      dispatch(cancelParcel(parcel.id)).then(() => {
        dispatch(addNotification({
          type: 'success',
          message: 'Parcel cancelled successfully!'
        }));
        navigate('/dashboard');
      });
    }
  };
  const canEdit = parcel.canUpdate && !['delivered', 'cancelled'].includes(parcel.status.toLowerCase());

  // const canEdit = parcel.canUpdate && parcel.status.toLowerCase() === 'pending';
  console.log('canEdit:', canEdit, 'status:', parcel.status, 'canUpdate:', parcel.canUpdate);

  const canCancel = parcel.status !== 'delivered' && parcel.status !== 'cancelled';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{parcel.trackingNumber}</h1>
              <p className="text-emerald-100">
                Created on {format(new Date(parcel.createdAt), 'MMMM dd, yyyy')}
              </p>
            </div>
            <StatusBadge status={parcel.status} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Parcel Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Sender</p>
                      <p className="font-medium">{parcel.senderName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Receiver</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.receiverName}
                          onChange={(e) => setEditData({...editData, receiverName: e.target.value})}
                          className="font-medium border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        <p className="font-medium">{parcel.receiverName}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Weight className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium">{parcel.weight} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Banknote className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">Ksh {parcel.price}</p>
                    </div>
                  </div>
                  {parcel.deliveryDeadline && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Delivery Deadline</p>
                        <p className="font-medium">{format(new Date(parcel.deliveryDeadline), 'MMM dd, yyyy HH:mm')}</p>
                      </div>
                    </div>
                  )}
                  
                  {parcel.courierAssigned && (
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Assigned Courier</p>
                        <p className="font-medium">{parcel.courierAssigned.name}</p>
                        <p className="text-sm text-gray-500">{parcel.courierAssigned.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Addresses</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Pickup Address</p>
                      <p className="font-medium">{parcel.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Destination Address</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.destinationAddress}
                          onChange={(e) => setEditData({...editData, destinationAddress: e.target.value})}
                          className="font-medium border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <p className="font-medium">{parcel.destinationAddress}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {(canEdit || canCancel) && (
                <div className="flex space-x-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {canEdit && (
                      <button
                        onClick={handleEdit}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      )}
                      {canCancel && (
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Map */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Delivery Map</h2>
              <LiveMapView
                key={`${parcel.pickupCoords?.lat}-${parcel.destinationCoords?.lat}`}
                pickup={parcel.pickupCoords}
                destination={parcel.destinationCoords}
                currentLocation={parcel.currentLocation}
                className="shadow-lg h-[100px] sm:h-[200px] md:h-[300px] lg:h-[400px]"
                showControls={true}
                autoCenter={true}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Delivery Timeline</h2>
            <div className="space-y-4">
              {parcel.timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={event.status} />
                      <span className="text-sm text-gray-500">
                        {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParcelDetails;