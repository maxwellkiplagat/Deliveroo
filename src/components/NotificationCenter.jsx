import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNotification } from '../redux/notificationSlice';
import { Bell, X, Check, AlertCircle, Info, Package } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';

function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Set up periodic refresh for notifications
      const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      if (!loading) setLoading(true);
      
      // Mock notifications for demo - in real app this would be API call
      const mockNotifications = [
        {
          id: 1,
          type: 'parcel_created',
          title: 'Parcel Created',
          message: 'Your parcel has been created successfully',
          createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: 2,
          type: 'status_update',
          title: 'Status Update',
          message: 'Your parcel is now in transit',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: 3,
          type: 'delivery',
          title: 'Delivery Complete',
          message: 'Your parcel has been delivered',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: true
        }
      ];
      
      const notificationsWithDates = mockNotifications.map(notification => ({
        ...notification,
        timestamp: new Date(notification.createdAt)
      }));
      
      setNotifications(notificationsWithDates);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Add error notification
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to load notifications'
      }));
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'status_update': return <Package className="h-4 w-4 text-blue-600" />;
      case 'delivery': return <Check className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'info': return <Info className="h-4 w-4 text-gray-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const markAsRead = (id) => {
    try {
      // Update local state immediately for better UX
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      
      // In a real app, you would make an API call here
      // api.put(`/notifications/${id}`, { read: true });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      
      // In a real app, you would make an API call here
      // api.put('/notifications/mark-all-read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const removeNotification = (id) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      // In a real app, you would make an API call here
      // api.delete(`/notifications/${id}`);
    } catch (error) {
      console.error('Failed to remove notification:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors hover:bg-gray-100 rounded-lg"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto mb-2 border-t-2"></div>
                  <p className="text-gray-500 text-sm">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                  <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-gradient-to-r from-blue-50 to-emerald-50 border-l-4 border-l-emerald-500' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded p-1 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {format(notification.timestamp, 'MMM dd, HH:mm')}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mt-2 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationCenter;