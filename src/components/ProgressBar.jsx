import React from 'react';

function ProgressBar({ progress, status, className = '' }) {
  const getProgressColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'picked_up':
        return 'bg-blue-500';
      case 'in_transit':
        return 'bg-indigo-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(status)}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;