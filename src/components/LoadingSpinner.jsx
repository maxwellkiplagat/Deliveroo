
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full animate-[blob_5s_infinite] blur-sm mix-blend-multiply opacity-80">
        <style>
          {`
            @keyframes blob {
              0%, 100% {
                border-radius: 42% 58% 31% 69% / 58% 42% 58% 42%;
              }
              50% {
                border-radius: 70% 30% 52% 48% / 30% 69% 31% 70%;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default LoadingSpinner;
