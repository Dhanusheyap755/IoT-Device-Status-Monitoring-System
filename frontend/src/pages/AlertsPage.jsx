import React, { useState } from 'react';
import AlertBadge from '../components/AlertBadge';
import { AlertIcon, RefreshCwIcon, AlertTriangleIcon } from '../components/Icons';
import { api } from '../services/api';

export default function AlertsPage({ alerts, devices, onRefresh }) {
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [deviceFilter, setDeviceFilter] = useState('ALL');
  const [isDeleting, setIsDeleting] = useState({});

  const handleDelete = async (id) => {
    setIsDeleting((prev) => ({ ...prev, [id]: true }));
    try {
      await api.deleteAlert(id);
      onRefresh();
    } catch (err) {
      alert(`Failed to delete alert: ${err.message}`);
    } finally {
      setIsDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredAlerts = (alerts || []).filter((alert) => {
    const matchesSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
    const matchesDevice = deviceFilter === 'ALL' || alert.deviceId === deviceFilter;
    return matchesSeverity && matchesDevice;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            System Alerts & Exception Audit Log
          </h2>
          <p className="text-xs text-gray-500">
            Automated alerts triggered by validation failures, network timeouts, and FSM transition anomalies
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Device filter */}
          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            className="text-xs font-mono bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Devices</option>
            {devices &&
              devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.deviceId}
                </option>
              ))}
          </select>

          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Severities</option>
            <option value="Warning">Warning</option>
            <option value="Error">Error</option>
            <option value="Info">Info</option>
          </select>

          <button
            onClick={onRefresh}
            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            title="Refresh alerts"
          >
            <RefreshCwIcon size={14} />
          </button>
        </div>
      </div>

      {/* Alerts Summary Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between text-rose-900">
          <div>
            <span className="font-semibold block">Communication Outages</span>
            <span className="text-2xl font-bold font-mono">
              {alerts.filter((a) => a.alertType === 'COMMUNICATION_FAILURE').length}
            </span>
          </div>
          <span className="text-rose-500 font-mono text-sm font-bold">DISCONNECTED</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-amber-900">
          <div>
            <span className="font-semibold block">Invalid Message Rejections</span>
            <span className="text-2xl font-bold font-mono">
              {alerts.filter((a) => a.alertType === 'INVALID_MESSAGE').length}
            </span>
          </div>
          <span className="text-amber-600 font-mono text-sm font-bold">FSM UNCHANGED</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between text-blue-900">
          <div>
            <span className="font-semibold block">Heartbeat Timeouts</span>
            <span className="text-2xl font-bold font-mono">
              {alerts.filter((a) => a.alertType === 'TIMEOUT').length}
            </span>
          </div>
          <span className="text-blue-600 font-mono text-sm font-bold">KEEPALIVE</span>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Alert Records ({filteredAlerts.length})
            </h3>
            <p className="text-xs text-gray-500">
              Persisted in MongoDB Alert collection with timestamps and failure descriptions
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-gray-600 font-semibold">
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Alert Type</th>
                <th className="py-3 px-4">Device ID</th>
                <th className="py-3 px-4">Description / Failure Reason</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <tr key={alert._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <AlertBadge severity={alert.severity} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-800 text-[11px]">
                      {alert.alertType}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {alert.deviceId}
                    </td>
                    <td className="py-3 px-4 text-gray-700 max-w-md">
                      <p className="line-clamp-2 leading-relaxed">{alert.message}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-500 text-[11px]">
                      {new Date(alert.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(alert._id)}
                        disabled={isDeleting[alert._id]}
                        className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded border border-rose-200 transition-colors"
                      >
                        {isDeleting[alert._id] ? 'Dismissing...' : 'Dismiss'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400 text-xs">
                    No alerts matching the selected filter criteria.
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
