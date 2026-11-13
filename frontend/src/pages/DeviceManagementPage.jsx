import React, { useState } from 'react';
import StatusPill from '../components/StatusPill';
import { PlusIcon, WifiIcon, WifiOffIcon, RefreshCwIcon, ClockIcon } from '../components/Icons';
import { api } from '../services/api';

export default function DeviceManagementPage({
  devices,
  onRefresh,
  onSelectDeviceForSimulation,
  onNavigate,
}) {
  const [deviceIdInput, setDeviceIdInput] = useState('');
  const [deviceNameInput, setDeviceNameInput] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState({});
  const [actionMessage, setActionMessage] = useState(null);
  const [selectedDeviceDetails, setSelectedDeviceDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Validate register form on client side
  const validateForm = () => {
    const errors = {};
    const idTrimmed = deviceIdInput.trim().toUpperCase();
    const nameTrimmed = deviceNameInput.trim();

    if (!idTrimmed) {
      errors.deviceId = 'Device ID is required.';
    } else if (!/^IOT\d{3,}$/.test(idTrimmed)) {
      errors.deviceId = 'Must follow format "IOT" followed by 3+ digits (e.g. IOT004).';
    } else if (devices.some((d) => d.deviceId === idTrimmed)) {
      errors.deviceId = `Device ID "${idTrimmed}" already exists in the system.`;
    }

    if (!nameTrimmed) {
      errors.deviceName = 'Device Name is required.';
    } else if (nameTrimmed.length < 2) {
      errors.deviceName = 'Device Name must be at least 2 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting((prev) => ({ ...prev, register: true }));
    setActionMessage(null);

    try {
      const response = await api.registerDevice({
        deviceId: deviceIdInput.trim().toUpperCase(),
        deviceName: deviceNameInput.trim(),
      });

      setActionMessage({
        type: 'success',
        text: response.message || `Device ${deviceIdInput.toUpperCase()} registered successfully!`,
      });
      setDeviceIdInput('');
      setDeviceNameInput('');
      setFormErrors({});
      onRefresh();
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to register device. Please try again.',
      });
    } finally {
      setIsSubmitting((prev) => ({ ...prev, register: false }));
    }
  };

  const handleQuickReconnect = async (deviceId) => {
    setIsSubmitting((prev) => ({ ...prev, [deviceId]: true }));
    try {
      await api.reconnectDevice(deviceId);
      setActionMessage({
        type: 'success',
        text: `Device ${deviceId} reconnected successfully! FSM State updated to [Active].`,
      });
      onRefresh();
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.message || `Failed to reconnect ${deviceId}`,
      });
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [deviceId]: false }));
    }
  };

  const handleViewDetails = async (deviceId) => {
    setIsLoadingDetails(true);
    try {
      const result = await api.getDeviceById(deviceId);
      setSelectedDeviceDetails(result.data);
    } catch (err) {
      alert(`Error fetching details: ${err.message}`);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Device Management
          </h2>
          <p className="text-xs text-gray-500">
            Register, configure, and inspect IoT nodes managed by the Finite State Machine
          </p>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="font-bold text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Grid: Registration Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
          <PlusIcon size={16} className="text-blue-600" />
          Register New IoT Device
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          All newly registered devices are placed into the FSM initial state{' '}
          <strong className="text-amber-700 font-mono">q0 = Registered</strong>.
        </p>

        <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Device ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. IOT004"
              value={deviceIdInput}
              onChange={(e) => {
                setDeviceIdInput(e.target.value.toUpperCase());
                if (formErrors.deviceId) setFormErrors((prev) => ({ ...prev, deviceId: null }));
              }}
              className={`w-full px-3 py-2 text-xs font-mono rounded-lg border ${
                formErrors.deviceId
                  ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:ring-rose-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } focus:outline-none focus:ring-1`}
            />
            {formErrors.deviceId && (
              <p className="text-[11px] text-rose-600 mt-1">{formErrors.deviceId}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Device Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Server Room Climate Sensor"
              value={deviceNameInput}
              onChange={(e) => {
                setDeviceNameInput(e.target.value);
                if (formErrors.deviceName) setFormErrors((prev) => ({ ...prev, deviceName: null }));
              }}
              className={`w-full px-3 py-2 text-xs rounded-lg border ${
                formErrors.deviceName
                  ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:ring-rose-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } focus:outline-none focus:ring-1`}
            />
            {formErrors.deviceName && (
              <p className="text-[11px] text-rose-600 mt-1">{formErrors.deviceName}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting.register}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting.register ? (
                <>
                  <RefreshCwIcon size={14} className="animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <PlusIcon size={16} />
                  Register Device
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Registered Devices Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Registered Devices Roster ({devices?.length || 0})
            </h3>
            <p className="text-xs text-gray-500">
              Live states updated synchronously via MongoDB and Express REST APIs
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-1.5"
          >
            <RefreshCwIcon size={13} />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-gray-600 font-semibold">
                <th className="py-3 px-4">Device ID</th>
                <th className="py-3 px-4">Device Name</th>
                <th className="py-3 px-4">Current FSM State</th>
                <th className="py-3 px-4">Latest Sensor Values</th>
                <th className="py-3 px-4">Last Telemetry Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {devices && devices.length > 0 ? (
                devices.map((device) => (
                  <tr key={device.deviceId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {device.deviceId}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{device.deviceName}</td>
                    <td className="py-3 px-4">
                      <StatusPill state={device.state} />
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-700">
                      {device.temperature !== null ? (
                        <div className="flex items-center gap-2">
                          <span className="text-rose-600 font-semibold">
                            {device.temperature}°C
                          </span>
                          <span className="text-gray-300">|</span>
                          <span className="text-blue-600 font-semibold">
                            {device.humidity}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No readings received</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                      {device.lastSeen
                        ? new Date(device.lastSeen).toLocaleString()
                        : 'Never'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleViewDetails(device.deviceId)}
                        className="px-2.5 py-1 rounded border border-gray-200 text-[11px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Inspect
                      </button>

                      {device.state === 'Disconnected' && (
                        <button
                          onClick={() => handleQuickReconnect(device.deviceId)}
                          disabled={isSubmitting[device.deviceId]}
                          className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-semibold transition-colors"
                        >
                          Reconnect
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (onSelectDeviceForSimulation) onSelectDeviceForSimulation(device.deviceId);
                          onNavigate('simulation');
                        }}
                        className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-[11px] font-semibold transition-colors"
                      >
                        Simulate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400 text-xs">
                    No registered devices found. Use the form above to add a device.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Device Inspector Modal */}
      {selectedDeviceDetails && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 font-mono">
                  {selectedDeviceDetails.device.deviceId} - {selectedDeviceDetails.device.deviceName}
                </h3>
                <p className="text-xs text-gray-500">Device Telemetry & FSM Audit Profile</p>
              </div>
              <button
                onClick={() => setSelectedDeviceDetails(null)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-gray-500 block mb-1">Current State</span>
                <StatusPill state={selectedDeviceDetails.device.state} />
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-gray-500 block mb-1">Last Telemetry</span>
                <span className="font-mono font-semibold text-gray-800">
                  {new Date(selectedDeviceDetails.device.lastSeen).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-gray-500 block mb-1">Temperature</span>
                <span className="font-mono text-sm font-bold text-rose-600">
                  {selectedDeviceDetails.device.temperature !== null
                    ? `${selectedDeviceDetails.device.temperature}°C`
                    : 'None'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-gray-500 block mb-1">Humidity</span>
                <span className="font-mono text-sm font-bold text-blue-600">
                  {selectedDeviceDetails.device.humidity !== null
                    ? `${selectedDeviceDetails.device.humidity}%`
                    : 'None'}
                </span>
              </div>
            </div>

            {/* Recent FSM Events */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                Recent FSM State Transitions
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {selectedDeviceDetails.recentEvents && selectedDeviceDetails.recentEvents.length > 0 ? (
                  selectedDeviceDetails.recentEvents.map((evt, idx) => (
                    <div
                      key={evt._id || idx}
                      className="p-2 rounded bg-slate-50 border border-gray-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700">{evt.event}</span>
                        <span className="text-gray-400">&rarr;</span>
                        <StatusPill state={evt.currentState} size="sm" />
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">No state transitions recorded yet.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => {
                  if (onSelectDeviceForSimulation) {
                    onSelectDeviceForSimulation(selectedDeviceDetails.device.deviceId);
                  }
                  setSelectedDeviceDetails(null);
                  onNavigate('simulation');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                Open Simulation Controls &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
