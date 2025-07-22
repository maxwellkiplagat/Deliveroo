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

