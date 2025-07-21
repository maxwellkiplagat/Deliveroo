import React, { useState } from 'react';
import { User, MapPin, Phone, Star, Truck } from 'lucide-react';

function CourierAssignment({ parcel, onAssign }) {
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const mockCouriers = [
    {
      id: 1,
      name: 'Mike Johnson',
      phone: '+1234567890',
      rating: 4.8,
      completedDeliveries: 245,
      currentLocation: 'Manhattan, NY',
      vehicleType: 'Motorcycle',
      status: 'available',
      estimatedArrival: '15 mins'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      phone: '+1987654321',
      rating: 4.9,
      completedDeliveries: 189,
      currentLocation: 'Brooklyn, NY',
      vehicleType: 'Van',
      status: 'available',
      estimatedArrival: '25 mins'
    },
    {
      id: 3,
      name: 'David Chen',
      phone: '+1555123456',
      rating: 4.7,
      completedDeliveries: 312,
      currentLocation: 'Queens, NY',
      vehicleType: 'Car',
      status: 'busy',
      estimatedArrival: '45 mins'
    }
  ];

  const handleAssign = () => {
    if (selectedCourier && onAssign) {
      onAssign(parcel.id, selectedCourier);
      setShowModal(false);
      setSelectedCourier(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <User className="h-4 w-4" />
        <span>Assign Courier</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Assign Courier</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Parcel Details</h3>
              <p className="text-sm text-gray-600">
                <strong>Tracking:</strong> {parcel.trackingNumber}
              </p>
              <p className="text-sm text-gray-600">
                <strong>From:</strong> {parcel.pickupAddress}
              </p>
              <p className="text-sm text-gray-600">
                <strong>To:</strong> {parcel.destinationAddress}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Available Couriers</h3>
              {mockCouriers.map(courier => (
                <div
                  key={courier.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedCourier?.id === courier.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCourier(courier)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{courier.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{courier.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{courier.rating}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(courier.status)}`}>
                        {courier.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Deliveries</p>
                      <p className="font-medium">{courier.completedDeliveries}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Vehicle</p>
                      <div className="flex items-center space-x-1">
                        <Truck className="h-3 w-3" />
                        <span className="font-medium">{courier.vehicleType}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Location</p>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span className="font-medium">{courier.currentLocation}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">ETA</p>
                      <p className="font-medium">{courier.estimatedArrival}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedCourier}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                Assign Courier
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CourierAssignment;