
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateParcelDestination, cancelParcel, updateParcelReceiver } from '../redux/parcelsSlice';
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
      <div className="text-center py-12 px-2">
        <p className="text-gray-500 text-base">Parcel not found.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleEdit = () => {
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

  const handleSaveEdit = async () => {
    try {
      if (editData.destinationAddress !== parcel.destinationAddress) {
        await dispatch(updateParcelDestination({
          id: parcel.id,
          destination: editData.destinationAddress
        })).unwrap();

        dispatch(addNotification({
          type: 'success',
          message: 'Destination updated!',
        }));
      }

      if (editData.receiverName !== parcel.receiverName) {
        await dispatch(updateParcelReceiver({
          id: parcel.id,
          receiverName: editData.receiverName
        })).unwrap();

        dispatch(addNotification({
          type: 'success',
          message: 'Receiver info updated!',
        }));
      }

      setIsEditing(false);
      navigate('/dashboard');
    } catch (err) {
      dispatch(addNotification({
        type: 'error',
        message: err?.message || 'Update failed. Try again!',
      }));
    }
  };

  const handleCancel = () => {
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
  const canCancel = parcel.status !== 'delivered' && parcel.status !== 'cancelled';

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 pt-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors text-xs sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-3 sm:p-4 md:p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-1">{parcel.trackingNumber}</h1>
              <p className="text-emerald-100 text-xs sm:text-sm">
                Created on {format(new Date(parcel.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
            <StatusBadge status={parcel.status} className="mt-1 sm:mt-0" />
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Parcel Information</h2>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 sm:mt-1" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Sender</p>
                      <p className="text-sm sm:text-base font-medium">{parcel.senderName}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 sm:mt-1" />
                    <div className="w-full">
                      <p className="text-xs sm:text-sm text-gray-500">Receiver</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.receiverName}
                          onChange={(e) => setEditData({ ...editData, receiverName: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 mt-1 text-xs sm:text-sm"
                        />
                      ) : (
                        <p className="text-sm sm:text-base font-medium">{parcel.receiverName}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Weight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 sm:mt-1" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Weight</p>
                      <p className="text-sm sm:text-base font-medium">{parcel.weight} kg</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Banknote className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 sm:mt-1" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Price</p>
                      <p className="text-sm sm:text-base font-medium">Ksh {parcel.price}</p>
                    </div>
                  </div>
                  {parcel.deliveryDeadline && (
                    <div className="flex items-start space-x-2">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 sm:mt-1" />
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Delivery Deadline</p>
                        <p className="text-sm sm:text-base font-medium">
                          {format(new Date(parcel.deliveryDeadline), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  )}
                  {parcel.courierAssigned && (
                    <div className="flex items-start space-x-2">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 sm:mt-1" />
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Assigned Courier</p>
                        <p className="text-sm sm:text-base font-medium">{parcel.courierAssigned.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{parcel.courierAssigned.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Addresses</h2>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 sm:mt-1" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Pickup Address</p>
                      <p className="text-sm sm:text-base font-medium">{parcel.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5 sm:mt-1" />
                    <div className="w-full">
                      <p className="text-xs sm:text-sm text-gray-500">Destination Address</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.destinationAddress}
                          onChange={(e) => setEditData({ ...editData, destinationAddress: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 mt-1 text-xs sm:text-sm"
                        />
                      ) : (
                        <p className="text-sm sm:text-base font-medium">{parcel.destinationAddress}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {(canEdit || canCancel) && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="w-full sm:w-auto bg-emerald-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-emerald-700 text-xs sm:text-sm"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="w-full sm:w-auto bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-700 text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {canEdit && (
                        <button
                          onClick={handleEdit}
                          className="flex items-center justify-center gap-1 w-full sm:w-auto bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 text-xs sm:text-sm"
                        >
                          <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>Edit</span>
                        </button>
                      )}
                      {canCancel && (
                        <button
                          onClick={handleCancel}
                          className="flex items-center justify-center gap-1 w-full sm:w-auto bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 text-xs sm:text-sm"
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-base sm:text-lg font-semibold">Delivery Map</h2>
              <LiveMapView
                key={`${parcel.pickupCoords?.lat}-${parcel.destinationCoords?.lat}`}
                pickup={parcel.pickupCoords}
                destination={parcel.destinationCoords}
                currentLocation={parcel.currentLocation}
                className="w-full rounded shadow-md h-[180px] sm:h-[220px] md:h-[280px] lg:h-[340px]"
                showControls={true}
                autoCenter={true}
              />
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Delivery Timeline</h2>
            <div className="space-y-3">
              {parcel.timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <StatusBadge status={event.status} className="text-xs" />
                      <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                        {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{event.location}</p>
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
