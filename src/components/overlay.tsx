import React from "react";

export const Overlay: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center backdrop-blur-lg overflow-hidden z-20 h-full justify-center">
      <div className="bg-white/80 p-8 rounded-lg shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          This feature is scheduled for our upcoming release. Stay tuned for
          real-time analytics and insights!
        </p>
      </div>
    </div>
  );
};
 