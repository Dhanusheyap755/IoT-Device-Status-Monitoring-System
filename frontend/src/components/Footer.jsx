import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 text-xs text-gray-500 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">
            IoT Device Status Monitoring System
          </span>
          <span className="text-gray-300">|</span>
          <span>Register No: <strong className="text-blue-600 font-semibold">24ITR018</strong></span>
        </div>
        <div className="text-center sm:text-right text-gray-500 text-[11px]">
          Department of Information Technology • Velalar College of Engineering and Technology, Erode
        </div>
      </div>
    </footer>
  );
}
