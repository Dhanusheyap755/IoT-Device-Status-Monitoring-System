import React from 'react';
import { RefreshCwIcon, WifiIcon, WifiOffIcon } from './Icons';

export default function Header({
  health,
  isRefreshing,
  onRefresh,
}) {
  const isConnected = health && health.database && health.database.connected;

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 px-6 flex items-center justify-between shadow-xs">
      {/* Title & Metadata */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              IoT Device Status Monitoring System
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-100 text-blue-800 rounded-md">
              Project #18
            </span>
          </div>
          <p className="text-xs text-gray-500 hidden sm:block">
            Velalar College of Engineering & Technology | Department of Information Technology | Reg: <strong className="text-blue-700">24ITR018</strong>
          </p>
        </div>
      </div>

      {/* Right side status indicators & controls */}
      <div className="flex items-center gap-3">
        {/* Connection status indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            isConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
          title={
            isConnected
              ? `Connected to MongoDB (${health.database.databaseName || 'iot_monitoring'}) on ${health.database.host || 'localhost'}`
              : 'Backend online but MongoDB is disconnected or degraded'
          }
        >
          {isConnected ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden md:inline font-semibold">MongoDB Connected</span>
              <span className="md:hidden">Connected</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="hidden md:inline font-semibold">DB Offline</span>
              <span className="md:hidden">Offline</span>
            </>
          )}
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
          title="Refresh dashboard data"
        >
          <RefreshCwIcon
            size={16}
            className={isRefreshing ? 'animate-spin text-blue-600' : ''}
          />
        </button>
      </div>
    </header>
  );
}
