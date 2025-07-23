import React, { useState, useEffect } from 'react';
import { Mail, Send, Check, AlertCircle, Settings } from 'lucide-react';

function EmailNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [emailSettings, setEmailSettings] = useState({
    statusUpdates: true,
    locationUpdates: true,
    deliveryConfirmation: true,
    promotionalEmails: false
  });

  const mockNotifications = [
    {
      id: 1,
      type: 'status_update',
      recipient: 'john@example.com',
      subject: 'Parcel Status Update - DEL123456',
      content: 'Your parcel is now in transit',
      sentAt: new Date(Date.now() - 30 * 60 * 1000),
      status: 'sent'
    },
    {
      id: 2,
      type: 'delivery_confirmation',
      recipient: 'jane@example.com',
      subject: 'Delivery Completed - DEL789012',
      content: 'Your parcel has been delivered successfully',
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'sent'
    },
    {
      id: 3,
      type: 'location_update',
      recipient: 'bob@example.com',
      subject: 'Location Update - DEL345678',
      content: 'Your parcel is now at Distribution Center, Brooklyn',
      sentAt: new Date(Date.now() - 5 * 60 * 1000),
      status: 'pending'
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const sendTestEmail = async (type) => {
    const testEmail = {
      id: Date.now(),
      type: type,
      recipient: 'test@example.com',
      subject: `Test ${type.replace('_', ' ')} Email`,
      content: 'This is a test email notification',
      sentAt: new Date(),
      status: 'sending'
    };

    setNotifications(prev => [testEmail, ...prev]);

    // Simulate email sending
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === testEmail.id 
            ? { ...notif, status: 'sent' }
            : notif
        )
      );
    }, 2000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <Check className="h-4 w-4 text-green-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'sending': return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />;
      default: return <Mail className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'status_update': return 'bg-blue-100 text-blue-800';
      case 'delivery_confirmation': return 'bg-green-100 text-green-800';
      case 'location_update': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Email Notification Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(emailSettings).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setEmailSettings(prev => ({
                  ...prev,
                  [key]: e.target.checked
                }))}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Test Email Buttons */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Test Email Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => sendTestEmail('status_update')}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Status Update</span>
          </button>
          <button
            onClick={() => sendTestEmail('location_update')}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Location Update</span>
          </button>
          <button
            onClick={() => sendTestEmail('delivery_confirmation')}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Delivery Confirmation</span>
          </button>
        </div>
      </div>

      {/* Email History */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Email Notifications</h3>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No email notifications sent yet</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(notification.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                      {notification.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{notification.subject}</p>
                    <p className="text-sm text-gray-600">To: {notification.recipient}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {notification.sentAt.toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {notification.sentAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailNotifications;