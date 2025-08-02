import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParcels, createParcel } from '../redux/parcelsSlice';
import { addNotification } from '../redux/notificationSlice';
import { Plus, Package, Search, Filter, MapPin, Calendar, Weight, DollarSign, User, Phone, MailCheck, Send, Handshake } from 'lucide-react';
import ParcelCard from '../components/ParcelCard';
import SearchFilter from '../components/SearchFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import AddressAutocomplete from '../components/AddressAutocomplete';
import PricingCalculator from '../components/PricingCalculator';
import PaymentMockup from '../components/PaymentMockup';
import SavedAddresses from '../components/SavedAddresses';
import LiveMapView from '../components/LiveMapView';
import { sortParcels, filterParcels } from '../utils/helpers';

function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentStep, setCurrentStep] = useState(1);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  // Map state
  const [showMap, setShowMap] = useState(false);
  const [mapLocations, setMapLocations] = useState({
    pickup: null,
    destination: null
  });

  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    receiverName: '',
    receiverPhone: '',
    pickupAddress: '',
    destinationAddress: '',
    weight: '',
    specialInstructions: '',
    pickupCoords: null,
    destinationCoords: null,
  });

  const { parcels, loading, error } = useSelector(state => state.parcels);
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchParcels());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSelect = (address, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: address.address || address,
      [`${type.replace('Address', '')}Coords`]: address.coordinates || {
        lat: 40.7128 + Math.random() * 0.1,
        lng: -74.0060 + Math.random() * 0.1
      }
    }));

    // Update map locations
    const locationType = type.replace('Address', '');
    setMapLocations(prev => ({
      ...prev,
      [locationType]: address.coordinates || {
        lat: 40.7128 + Math.random() * 0.1,
        lng: -74.0060 + Math.random() * 0.1
      }
    }));

    // Show map when both locations are set
    if (locationType === 'pickup' && formData.destinationAddress) {
      setShowMap(true);
    } else if (locationType === 'destination' && formData.pickupAddress) {
      setShowMap(true);
    }
  };

  const handleSavedAddressSelect = (savedAddress, type) => {
    const addressType = type || 'pickupAddress';
    setFormData(prev => ({
      ...prev,
      [addressType]: savedAddress.address,
      [`${addressType.replace('Address', '')}Coords`]: savedAddress.coordinates
    }));

    // Update map locations
    const locationType = addressType.replace('Address', '');
    setMapLocations(prev => ({
      ...prev,
      [locationType]: savedAddress.coordinates
    }));

    setShowMap(true);
    setShowAddressModal(false);
  };
  const handleLocationSelect = (locationData, type) => {
    const locationType = type || (formData.pickupAddress && !formData.destinationAddress ? 'destination' : 'pickup');
    
    setMapLocations(prev => ({
      ...prev,
      [locationType]: locationData.coordinates
    }));

    // Update form data with the address
    const addressField = locationType === 'pickup' ? 'pickupAddress' : 'destinationAddress';
    const coordsField = locationType === 'pickup' ? 'pickupCoords' : 'destinationCoords';
    
    setFormData(prev => ({
      ...prev,
      [addressField]: locationData.address,
      [coordsField]: locationData.coordinates
    }));

    // Show map when location is selected
    setShowMap(true);
  };

  const handlePriceCalculated = (price) => {
    setCalculatedPrice(price);
  };

  const validateStep1 = () => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    
    if (!formData.senderName || !nameRegex.test(formData.senderName)) {
      dispatch(addNotification({
        type: 'error',
        message: 'Sender name must be 2-50 characters, letters only'
      }));
      return false;
    }
    
    if (!formData.receiverName || !nameRegex.test(formData.receiverName)) {
      dispatch(addNotification({
        type: 'error',
        message: 'Receiver name must be 2-50 characters, letters only'
      }));
      return false;
    }
    
    if (!formData.senderPhone || !phoneRegex.test(formData.senderPhone)) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please enter a valid sender phone number'
      }));
      return false;
    }
    
    if (!formData.receiverPhone || !phoneRegex.test(formData.receiverPhone)) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please enter a valid receiver phone number'
      }));
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!formData.pickupAddress || formData.pickupAddress.length < 10) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please enter a complete pickup address (minimum 10 characters)'
      }));
      return false;
    }
    
    if (!formData.destinationAddress || formData.destinationAddress.length < 10) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please enter a complete destination address (minimum 10 characters)'
      }));
      return false;
    }
    
    if (formData.pickupAddress === formData.destinationAddress) {
      dispatch(addNotification({
        type: 'error',
        message: 'Pickup and destination addresses cannot be the same'
      }));
      return false;
    }
    
    return true;
  };

  const validateStep3 = () => {
    const weight = parseFloat(formData.weight);
    
    if (!formData.weight || isNaN(weight)) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please enter a valid weight'
      }));
      return false;
    }
    
    if (weight <= 0) {
      dispatch(addNotification({
        type: 'error',
        message: 'Weight must be greater than 0'
      }));
      return false;
    }
    
    if (weight > 100) {
      dispatch(addNotification({
        type: 'error',
        message: 'Weight cannot exceed 100kg. Please contact support for heavier items.'
      }));
      return false;
    }
    
    if (calculatedPrice <= 0) {
      dispatch(addNotification({
        type: 'error',
        message: 'Unable to calculate price. Please check weight and try again.'
      }));
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    if (currentStep === 3 && !validateStep3()) {
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCreateModal(false);
      
      setShowPaymentModal(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentComplete = (paymentData) => {
    const parcelData = {
      ...formData,
      price: calculatedPrice,
      paymentInfo: paymentData,
      pickupCoords: mapLocations.pickup || formData.pickupCoords,
      destinationCoords: mapLocations.destination || formData.destinationCoords
    };

    dispatch(createParcel(parcelData)).then((result) => {
      if (result.type === 'parcels/createParcel/fulfilled') {
        // Refresh parcels list
        dispatch(fetchParcels());
        
        dispatch(addNotification({
          type: 'success',
          message: 'Parcel created successfully!'
        }));
        
        // Send email notification
        sendParcelCreatedEmail(parcelData);
        
        // Auto-close the form after successful creation
        handleCloseModal();
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to create parcel. Please try again.'
        }));
      }
    }).catch((error) => {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to create parcel. Please try again.'
      }));
    });
    
    // Close payment modal immediately after processing
    setShowPaymentModal(false);
  };

  const sendParcelCreatedEmail = (parcelData) => {
    const locationType = type || (mapLocations.pickup && !mapLocations.destination ? 'destination' : 'pickup');
    setTimeout(() => {
      dispatch(addNotification({
        type: 'info',
        message: `Confirmation email sent to ${user?.email}`
      }));
    }, 1000);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowPaymentModal(false);
    setCurrentStep(1);
    setFormData({
      senderName: '',
      senderPhone: '',
      receiverName: '',
      receiverPhone: '',
      pickupAddress: '',
      destinationAddress: '',
      weight: '',
      specialInstructions: '',
      pickupCoords: null,
      destinationCoords: null,
    });
    setCalculatedPrice(0);
    setShowMap(false);
    setMapLocations({ pickup: null, destination: null });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setSortBy('newest');
  };

  // Filter and sort parcels
  const filteredParcels = filterParcels(parcels, {
    search: searchTerm,
    status: filterStatus
  });
  const sortedParcels = sortParcels(filteredParcels, sortBy);

  const stats = {
    total: parcels.length,
    pending: parcels.filter(p => p.status === 'pending').length,
    inTransit: parcels.filter(p => p.status === 'in_transit').length,
    delivered: parcels.filter(p => p.status === 'delivered').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            onClick={() => setShowAddressModal(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            <MapPin className="h-4 w-4" />
            <span>Saved Addresses</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Parcel</span>
          </button>
        </div>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Parcels</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MailCheck className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inTransit}</p>
            </div>
            <Send className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <Handshake className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onClear={handleClearFilters}
      />

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Parcels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedParcels.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No parcels found</h3>
            <p className="text-gray-500 mb-6">
              {parcels.length === 0 
                ? "You haven't created any parcels yet. Create your first parcel to get started!"
                : "No parcels match your current filters. Try adjusting your search criteria."
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Parcel</span>
            </button>
          </div>
        ) : (
          sortedParcels.map(parcel => (
            <ParcelCard key={parcel.id} parcel={parcel} />
          ))
        )}
      </div>

      {/* Create Parcel Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        title={`Create New Parcel - Step ${currentStep} of 4`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-1 ${
                    step < currentStep ? 'bg-emerald-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Sender & Receiver Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sender & Receiver Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sender Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="senderName"
                      required
                      value={formData.senderName}
                      onChange={handleInputChange}
                      pattern="[a-zA-Z\s]{2,50}"
                      title="Name must be 2-50 characters, letters only"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter sender name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sender Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="senderPhone"
                      required
                      value={formData.senderPhone}
                      onChange={handleInputChange}
                      pattern="[\+]?[\d\s\-\(\)]{10,}"
                      title="Please enter a valid phone number"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter sender phone"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receiver Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="receiverName"
                      required
                      value={formData.receiverName}
                      onChange={handleInputChange}
                      pattern="[a-zA-Z\s]{2,50}"
                      title="Name must be 2-50 characters, letters only"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter receiver name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receiver Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="receiverPhone"
                      required
                      value={formData.receiverPhone}
                      onChange={handleInputChange}
                      pattern="[\+]?[\d\s\-\(\)]{10,}"
                      title="Please enter a valid phone number"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter receiver phone"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Addresses */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pickup & Delivery Addresses</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Address *
                  </label>
                  <AddressAutocomplete
                    value={formData.pickupAddress}
                    onChange={(value) => handleAddressSelect({ address: value }, 'pickupAddress')}
                    onLocationSelect={(locationData) => handleLocationSelect(locationData, 'pickup')}
                    placeholder="Enter pickup address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination Address *
                  </label>
                  <AddressAutocomplete
                    value={formData.destinationAddress}
                    onChange={(value) => handleAddressSelect({ address: value }, 'destinationAddress')}
                    onLocationSelect={(locationData) => handleLocationSelect(locationData, 'destination')}
                    placeholder="Enter destination address"
                  />
                </div>
                
                {/* Live Map Preview */}
                {showMap && (mapLocations.pickup || mapLocations.destination) && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Route Preview
                    </label>
                    <LiveMapView
                      pickup={mapLocations.pickup}
                      destination={mapLocations.destination}
                      className="h-64 border border-gray-300 rounded-lg"
                      showControls={true}
                      autoCenter={true}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Weight & Pricing */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Package Details & Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg) *
                    </label>
                    <div className="relative">
                      <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        name="weight"
                        step="0.1"
                        min="0.1"
                        max="100"
                        required
                        value={formData.weight}
                        onChange={handleInputChange}
                        title="Weight must be between 0.1 and 100 kg"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter weight in kg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions
                    </label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      rows={3}
                      maxLength="500"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Any special handling instructions..."
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.specialInstructions.length}/500 characters
                    </div>
                  </div>
                </div>
                <div>
                  <PricingCalculator
                    weight={parseFloat(formData.weight) || 0}
                    onPriceCalculated={handlePriceCalculated}
                  />
                </div>
              </div>
              
              {/* Show map with route in step 3 if locations are available */}
              {showMap && mapLocations.pickup && mapLocations.destination && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Route
                  </label>
                  <LiveMapView
                    pickup={mapLocations.pickup}
                    destination={mapLocations.destination}
                    className="h-48 border border-gray-300 rounded-lg"
                    showControls={false}
                    autoCenter={true}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Review Your Order</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">From:</span> {formData.senderName}
                  </div>
                  <div>
                    <span className="font-medium">To:</span> {formData.receiverName}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Route:</span> {formData.pickupAddress} → {formData.destinationAddress}
                  </div>
                  <div>
                    <span className="font-medium">Weight:</span> {formData.weight} kg
                  </div>
                  <div>
                    <span className="font-medium">Total Price:</span> 
                    <span className="text-lg font-bold text-emerald-600 ml-2">
                      Ksh {calculatedPrice}
                    </span>
                  </div>
                </div>
                
                {/* Final route confirmation map */}
                {showMap && mapLocations.pickup && mapLocations.destination && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Delivery Route Confirmation</h4>
                    <LiveMapView
                      pickup={mapLocations.pickup}
                      destination={mapLocations.destination}
                      className="h-48 border border-gray-300 rounded-lg"
                      showControls={false}
                      autoCenter={true}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <button
              onClick={currentStep === 1 ? handleCloseModal : handlePrevStep}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {currentStep === 4 ? 'Proceed to Payment' : 'Next'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Complete Payment"
        size="md"
      >
        <PaymentMockup
          amount={calculatedPrice}
          onPaymentComplete={handlePaymentComplete}
          onCancel={() => setShowPaymentModal(false)}
        />
      </Modal>

      {/* Saved Addresses Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="Saved Addresses"
        size="lg"
      >
        <SavedAddresses onSelectAddress={handleSavedAddressSelect} />
      </Modal>
    </div>
  );
}

export default Dashboard;


                    
