import React, { useState, useEffect } from 'react';
import {
  ThermometerIcon,
  DropletsIcon,
  RefreshCwIcon,
  ClockIcon,
} from '../components/Icons';
import { api } from '../services/api';

export default function SensorMonitoringPage({
  devices,
  selectedDeviceFilter,
  onRefresh,
}) {
  const [filterDeviceId, setFilterDeviceId] = useState(selectedDeviceFilter || 'ALL');
  const [readings, setReadings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTelemetryHistory = async () => {
    setIsLoading(true);
    try {
      if (filterDeviceId === 'ALL') {
        const response = await api.getAllRecentReadings(100);
        setReadings(response.data || []);
      } else {
        const response = await api.getReadings(filterDeviceId, 100);
        setReadings(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load readings:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetryHistory();
  }, [filterDeviceId]);

  // Aggregate metrics for selected filter
  const currentReadings = readings || [];
  const latestReading = currentReadings[0] || null;

  const avgTemp = currentReadings.length
    ? (
        currentReadings.reduce((acc, cur) => acc + (cur.temperature || 0), 0) /
        currentReadings.length
      ).toFixed(1)
    : '—';

  const avgHumidity = currentReadings.length
    ? (
        currentReadings.reduce((acc, cur) => acc + (cur.humidity || 0), 0) /
        currentReadings.length
      ).toFixed(1)
    : '—';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Sensor Telemetry Monitoring
          </h2>
          <p className="text-xs text-gray-500">
            Real-time environmental sensor data streams, metric aggregation, and historical logs
          </p>
        </div>

        {/* Filter by device */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-600">Filter Device:</label>
          <select
            value={filterDeviceId}
            onChange={(e) => setFilterDeviceId(e.target.value)}
            className="text-xs font-mono font-medium bg-white border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Registered Devices</option>
            {devices &&
              devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.deviceId} - {d.deviceName}
                </option>
              ))}
          </select>

          <button
            onClick={() => {
              fetchTelemetryHistory();
              onRefresh();
            }}
            disabled={isLoading}
            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCwIcon size={14} className={isLoading ? 'animate-spin text-blue-600' : ''} />
          </button>
        </div>
      </div>

      {/* Sensor Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Latest Temperature */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Latest Temperature
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-rose-600">
                {latestReading ? `${latestReading.temperature}°C` : '—'}
              </span>
              <span className="text-xs text-gray-400">Celsius</span>
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              Avg: {avgTemp !== '—' ? `${avgTemp}°C` : 'N/A'} (Range: -40°C to 125°C)
            </p>
          </div>
          <div className="p-3 rounded-lg bg-rose-50 text-rose-600">
            <ThermometerIcon size={24} />
          </div>
        </div>

        {/* Latest Humidity */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Latest Relative Humidity
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-blue-600">
                {latestReading ? `${latestReading.humidity}%` : '—'}
              </span>
              <span className="text-xs text-gray-400">% RH</span>
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              Avg: {avgHumidity !== '—' ? `${avgHumidity}%` : 'N/A'} (Range: 0% to 100%)
            </p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <DropletsIcon size={24} />
          </div>
        </div>

        {/* Ingested Records Count */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Telemetry Records
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-gray-900">
                {currentReadings.length}
              </span>
              <span className="text-xs text-gray-400">Sample Messages</span>
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              Filter: {filterDeviceId === 'ALL' ? 'All Devices' : filterDeviceId}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <ClockIcon size={24} />
          </div>
        </div>
      </div>

      {/* Telemetry History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Telemetry Log History ({currentReadings.length})
            </h3>
            <p className="text-xs text-gray-500">
              All persisted readings with timestamps, temperatures, and relative humidity
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-gray-600 font-semibold">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Device ID</th>
                <th className="py-3 px-4">Temperature (°C)</th>
                <th className="py-3 px-4">Humidity (% RH)</th>
                <th className="py-3 px-4">Reported Status</th>
                <th className="py-3 px-4">Timestamp (UTC/Local)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono">
              {currentReadings.length > 0 ? (
                currentReadings.map((reading, index) => (
                  <tr key={reading._id || index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-gray-400 font-sans">{index + 1}</td>
                    <td className="py-3 px-4 font-bold text-blue-700">
                      {reading.deviceId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-rose-600">
                      {reading.temperature}°C
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-600">
                      {reading.humidity}%
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {reading.status || 'online'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-[11px]">
                      {new Date(reading.receivedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400 font-sans text-xs">
                    No sensor readings stored for {filterDeviceId}. Trigger sample messages in the Simulation tab!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
