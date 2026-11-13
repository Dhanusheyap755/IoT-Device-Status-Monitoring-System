import React from 'react';
import MetricCard from '../components/MetricCard';
import StatusPill from '../components/StatusPill';
import AlertBadge from '../components/AlertBadge';
import {
  DevicesIcon,
  WifiIcon,
  WifiOffIcon,
  SensorIcon,
  AlertIcon,
  AlertTriangleIcon,
} from '../components/Icons';

export default function OverviewDashboard({
  stats,
  devices,
  alerts,
  readings,
  onNavigate,
  onSelectDeviceForSimulation,
}) {
  const summary = stats?.summary || {
    totalDevices: devices?.length || 0,
    activeDevices: devices?.filter((d) => d.state === 'Active').length || 0,
    disconnectedDevices: devices?.filter((d) => d.state === 'Disconnected').length || 0,
    registeredDevices: devices?.filter((d) => d.state === 'Registered').length || 0,
    totalReadings: readings?.length || 0,
    totalAlerts: alerts?.length || 0,
    invalidMessagesAlerts: alerts?.filter((a) => a.alertType === 'INVALID_MESSAGE').length || 0,
  };

  const total = summary.totalDevices || 1;
  const activePct = Math.round((summary.activeDevices / total) * 100);
  const disconnectedPct = Math.round((summary.disconnectedDevices / total) * 100);
  const registeredPct = Math.round((summary.registeredDevices / total) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30 mb-3">
            FLAT Automata Controlled Dashboard
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Real-Time IoT Device Telemetry & State Machine
          </h2>
          <p className="mt-2 text-sm text-blue-100 leading-relaxed">
            Deterministic state control (Q = &#123;Registered, Active, Disconnected&#125;) driven by HTTP telemetry ingestion, strict schema validation, and real-time failure simulation.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-400/10 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Devices"
          value={summary.totalDevices}
          subtext="Registered in MongoDB"
          icon={<DevicesIcon size={20} />}
          colorScheme="blue"
          onClick={() => onNavigate('devices')}
        />
        <MetricCard
          title="Active Devices"
          value={summary.activeDevices}
          subtext={`${activePct}% operational`}
          icon={<WifiIcon size={20} />}
          colorScheme="green"
          onClick={() => onNavigate('devices')}
        />
        <MetricCard
          title="Disconnected"
          value={summary.disconnectedDevices}
          subtext={`${disconnectedPct}% offline/timeout`}
          icon={<WifiOffIcon size={20} />}
          colorScheme="rose"
          onClick={() => onNavigate('devices')}
        />
        <MetricCard
          title="Total Alerts"
          value={summary.totalAlerts}
          subtext={`${summary.invalidMessagesAlerts} invalid payloads`}
          icon={<AlertIcon size={20} />}
          colorScheme="amber"
          onClick={() => onNavigate('alerts')}
        />
      </div>

      {/* State Distribution & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State Machine Distribution */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
              FSM State Distribution
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Finite automata state breakdown across all registered nodes
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-emerald-700 font-semibold">Active State</span>
                  <span className="text-gray-600">{summary.activeDevices} ({activePct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${activePct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-amber-700 font-semibold">Registered (q0)</span>
                  <span className="text-gray-600">{summary.registeredDevices} ({registeredPct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${registeredPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-rose-700 font-semibold">Disconnected State</span>
                  <span className="text-gray-600">{summary.disconnectedDevices} ({disconnectedPct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${disconnectedPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Total Valid Telemetry Ingested:</span>
            <span className="font-bold text-blue-700 font-mono text-sm">{summary.totalReadings} messages</span>
          </div>
        </div>

        {/* Device Quick Status List */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Registered IoT Devices
              </h3>
              <p className="text-xs text-gray-500">Live operational status and latest sensor values</p>
            </div>
            <button
              onClick={() => onNavigate('devices')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              View All Devices &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium">
                  <th className="pb-2.5 pl-1">Device ID</th>
                  <th className="pb-2.5">Name</th>
                  <th className="pb-2.5">FSM State</th>
                  <th className="pb-2.5">Latest Temp</th>
                  <th className="pb-2.5">Latest Humidity</th>
                  <th className="pb-2.5 text-right pr-1">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {devices && devices.length > 0 ? (
                  devices.slice(0, 5).map((device) => (
                    <tr key={device.deviceId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 pl-1 font-mono font-bold text-blue-800">
                        {device.deviceId}
                      </td>
                      <td className="py-2.5 font-medium text-gray-800">{device.deviceName}</td>
                      <td className="py-2.5">
                        <StatusPill state={device.state} size="sm" />
                      </td>
                      <td className="py-2.5 font-mono">
                        {device.temperature !== null ? `${device.temperature}°C` : '—'}
                      </td>
                      <td className="py-2.5 font-mono">
                        {device.humidity !== null ? `${device.humidity}%` : '—'}
                      </td>
                      <td className="py-2.5 text-right pr-1">
                        <button
                          onClick={() => {
                            if (onSelectDeviceForSimulation) onSelectDeviceForSimulation(device.deviceId);
                            onNavigate('simulation');
                          }}
                          className="px-2 py-1 rounded text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          Simulate
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-400">
                      No devices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activity & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sensor Telemetry */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Recent Telemetry Stream
            </h3>
            <button
              onClick={() => onNavigate('sensors')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Full History &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {readings && readings.length > 0 ? (
              readings.slice(0, 5).map((r, idx) => (
                <div
                  key={r._id || idx}
                  className="p-3 bg-slate-50 rounded-lg flex items-center justify-between border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-mono text-xs font-bold">
                      {r.deviceId?.substring(3) || '01'}
                    </span>
                    <div>
                      <span className="font-mono font-bold text-xs text-gray-900 mr-2">
                        {r.deviceId}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {new Date(r.receivedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-rose-600 font-semibold">{r.temperature}°C</span>
                    <span className="text-blue-600 font-semibold">{r.humidity}% RH</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-6">
                No telemetry messages ingested yet. Use Simulation Controls to send sensor messages.
              </p>
            )}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Recent System Alerts
            </h3>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              All Alerts &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {alerts && alerts.length > 0 ? (
              alerts.slice(0, 5).map((a, idx) => (
                <div
                  key={a._id || idx}
                  className="p-3 bg-slate-50 rounded-lg border border-gray-100 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertBadge severity={a.severity} size="sm" />
                      <span className="font-mono text-xs font-bold text-gray-800">
                        {a.deviceId}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(a.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">{a.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-6">
                No system alerts recorded. System operating normally.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
