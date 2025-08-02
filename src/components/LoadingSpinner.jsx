
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin-slow" />
        <div className="absolute inset-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/30" />
      </div>
      <style>
        {`
          @keyframes spin-slow {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .animate-spin-slow {
            animation: spin-slow 1.8s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;


