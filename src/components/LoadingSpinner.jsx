// import React from 'react';

// function LoadingSpinner({ size = 'md', color = 'emerald' }) {
//   const sizeClasses = {
//     sm: 'w-4 h-4',
//     md: 'w-8 h-8',
//     lg: 'w-12 h-12',
//     xl: 'w-16 h-16'
//   };

//   const colorClasses = {
//     emerald: 'border-emerald-600',
//     blue: 'border-blue-600',
//     gray: 'border-gray-600'
//   };

//   return (
//     <div className={`animate-spin rounded-full border-2 border-gray-200 ${sizeClasses[size]} ${colorClasses[color]} border-t-current`}></div>
//   );
// }

// export default LoadingSpinner;
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-32 space-x-2">
      <div className="w-6 h-6 bg-emerald-500 animate-[flip_1.2s_infinite] origin-bottom-left rounded" />
      <div className="w-6 h-6 bg-blue-500 animate-[flip_1.2s_infinite_0.2s] origin-bottom-left rounded" />
      <div className="w-6 h-6 bg-purple-500 animate-[flip_1.2s_infinite_0.4s] origin-bottom-left rounded" />
      <div className="w-6 h-6 bg-pink-500 animate-[flip_1.2s_infinite_0.6s] origin-bottom-left rounded" />
      <style>
        {`
          @keyframes flip {
            0% {
              transform: rotateY(0deg) scale(1);
              opacity: 1;
            }
            50% {
              transform: rotateY(180deg) scale(1.3);
              opacity: 0.7;
            }
            100% {
              transform: rotateY(360deg) scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
