import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../redux/notificationSlice';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

function ToastNotification() {
  const { notifications } = useSelector(state => state.notifications);
  const dispatch = useDispatch();

  useEffect(() => {
    notifications.forEach(notification => {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [notifications, dispatch]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => {
        const Icon = iconMap[notification.type] || Info;
        const colorClass = colorMap[notification.type] || colorMap.info;

        return (
          <div
            key={notification.id}
            className={`max-w-sm w-full border rounded-lg p-4 shadow-lg ${colorClass}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon className="h-5 w-5" />
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => dispatch(removeNotification(notification.id))}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ToastNotification;