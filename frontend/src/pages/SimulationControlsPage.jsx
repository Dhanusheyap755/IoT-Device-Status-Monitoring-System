import React, { useState } from 'react';
import StatusPill from '../components/StatusPill';
import {
  SimulationIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  WifiIcon,
  WifiOffIcon,
} from '../components/Icons';
import { api } from '../services/api';

export default function SimulationControlsPage({
  devices,
  selectedDeviceId,
  setSelectedDeviceId,
  onRefresh,
}) {
  const currentDevice =
    devices?.find((d) => d.deviceId === selectedDeviceId) || devices?.[0] || null;

  // Custom simulation payload states
  const [temperature, setTemperature] = useState('28.5');
  const [humidity, setHumidity] = useState('65.0');
  const [statusValue, setStatusValue] = useState('online');
  const [failureReason, setFailureReason] = useState('Gateway socket timeout / packet loss');
  const [timeoutSeconds, setTimeoutSeconds] = useState('45');

  // Execution feedback states
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);

  // Helper to execute API call with formatted result
  const executeApiCall = async (actionName, apiPromise) => {
    setIsExecuting(true);
    setLastResponse(null);
    try {
      const data = await apiPromise;
      setLastResponse({
        success: true,
        action: actionName,
        status: 200,
        timestamp: new Date().toLocaleTimeString(),
        data,
      });
      onRefresh();
    } catch (err) {
      setLastResponse({
        success: false,
        action: actionName,
        status: err.status || 400,
        timestamp: new Date().toLocaleTimeString(),
        error: err.message,
        details: err.data,
      });
      onRefresh();
    } finally {
      setIsExecuting(false);
    }
  };

  // 1. Send Valid Sensor Message
  const handleSendValidMessage = () => {
    if (!currentDevice) return;
    executeApiCall(
      `Send Valid Message to ${currentDevice.deviceId}`,
      api.sendMessage({
        deviceId: currentDevice.deviceId,
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        status: statusValue,
      })
    );
  };

  // 2. Send Invalid Message: Temperature out of range (200°C)
  const handleSendInvalidTemp = () => {
    if (!currentDevice) return;
    executeApiCall(
      `Send Invalid Temperature (200°C) to ${currentDevice.deviceId}`,
      api.sendMessage({
        deviceId: currentDevice.deviceId,
        temperature: 200,
        humidity: 65,
        status: 'online',
      })
    );
  };

  // 3. Send Invalid Message: Humidity out of range (150%)
  const handleSendInvalidHumidity = () => {
    if (!currentDevice) return;
    executeApiCall(
      `Send Invalid Humidity (150%) to ${currentDevice.deviceId}`,
      api.sendMessage({
        deviceId: currentDevice.deviceId,
        temperature: 28,
        humidity: 150,
        status: 'online',
      })
    );
  };

  // 4. Send Invalid Message: Missing deviceId
  const handleSendMissingDeviceId = () => {
    executeApiCall(
      'Send Payload with Missing Device ID',
      api.sendMessage({
        temperature: 27,
        humidity: 60,
        status: 'online',
      })
    );
  };

  // 5. Send Invalid Message: Unknown Device ID
  const handleSendUnknownDevice = () => {
    executeApiCall(
      'Send Payload for Unknown Device (IOT999)',
      api.sendMessage({
        deviceId: 'IOT999',
        temperature: 24,
        humidity: 55,
        status: 'online',
      })
    );
  };

  // 6. Simulate Communication Failure
  const handleSimulateFailure = () => {
    if (!currentDevice) return;
    executeApiCall(
      `Simulate Communication Failure on ${currentDevice.deviceId}`,
      api.simulateFailure({
        deviceId: currentDevice.deviceId,
        reason: failureReason,
      })
    );
  };

  // 7. Simulate Heartbeat Timeout
  const handleSimulateTimeout = () => {
    if (!currentDevice) return;
    executeApiCall(
      `Simulate Timeout on ${currentDevice.deviceId}`,
      api.simulateTimeout({
        deviceId: currentDevice.deviceId,
        durationSeconds: parseInt(timeoutSeconds, 10) || 30,
      })
    );
  };

  // 8. Reconnect Device
  const handleReconnect = () => {
    if (!currentDevice) return;
    executeApiCall(
      `Reconnect Device ${currentDevice.deviceId}`,
      api.reconnectDevice(currentDevice.deviceId)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Target Device Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            IoT Simulation Control Deck
          </h2>
          <p className="text-xs text-gray-500">
            Execute real HTTP requests to simulate hardware sensor telemetry, communication faults, and timeout interrupts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-700">Target Device:</label>
          <select
            value={currentDevice?.deviceId || ''}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="text-xs font-mono font-bold bg-white border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {devices &&
              devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.deviceId} - {d.deviceName} [{d.state}]
                </option>
              ))}
          </select>

          {currentDevice && <StatusPill state={currentDevice.state} size="sm" />}
        </div>
      </div>

      {/* Main Grid: Simulation Operations & Live Response Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Simulation Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Custom Telemetry Ingestion */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              1. Valid Telemetry Ingestion
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Sends an authenticated HTTP POST payload adhering to all server validation constraints.
              Transitions Registered &rarr; Active, Disconnected &rarr; Active, or keeps Active (Self-Loop).
            </p>

            <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full px-2.5 py-1.5 font-mono text-xs border rounded-lg border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-[10px] text-gray-400">Range: -40 to 125</span>
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Humidity (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                  className="w-full px-2.5 py-1.5 font-mono text-xs border rounded-lg border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-[10px] text-gray-400">Range: 0 to 100</span>
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Status</label>
                <select
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border rounded-lg border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="online">online</option>
                  <option value="offline">offline</option>
                </select>
                <span className="text-[10px] text-gray-400">online / offline</span>
              </div>
            </div>

            <button
              onClick={handleSendValidMessage}
              disabled={isExecuting || !currentDevice}
              className="w-full py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <CheckCircleIcon size={16} />
              Send Valid Message (POST /api/devices/message)
            </button>
          </div>

          {/* Card 2: Invalid Message Injection (Strict Validation Test) */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              2. Invalid Message Testing (FLAT FSM Rule: State Unchanged)
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Server returns <strong>HTTP 400</strong>, preserves existing FSM state, and generates a structured alert.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={handleSendInvalidTemp}
                disabled={isExecuting || !currentDevice}
                className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 font-medium text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="block font-semibold">Invalid Temperature</span>
                  <span className="text-[11px] text-amber-700 font-mono">200°C (Limit: 125°C)</span>
                </div>
                <AlertTriangleIcon size={16} className="text-amber-600 shrink-0" />
              </button>

              <button
                onClick={handleSendInvalidHumidity}
                disabled={isExecuting || !currentDevice}
                className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 font-medium text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="block font-semibold">Invalid Humidity</span>
                  <span className="text-[11px] text-amber-700 font-mono">150% (Limit: 100%)</span>
                </div>
                <AlertTriangleIcon size={16} className="text-amber-600 shrink-0" />
              </button>

              <button
                onClick={handleSendMissingDeviceId}
                disabled={isExecuting}
                className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 font-medium text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="block font-semibold">Missing Device ID</span>
                  <span className="text-[11px] text-amber-700 font-mono">Empty deviceId key</span>
                </div>
                <AlertTriangleIcon size={16} className="text-amber-600 shrink-0" />
              </button>

              <button
                onClick={handleSendUnknownDevice}
                disabled={isExecuting}
                className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 font-medium text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="block font-semibold">Unknown Device ID</span>
                  <span className="text-[11px] text-amber-700 font-mono">IOT999 (Unregistered)</span>
                </div>
                <AlertTriangleIcon size={16} className="text-amber-600 shrink-0" />
              </button>
            </div>
          </div>

          {/* Card 3: Network Failure, Timeout & Reconnect Simulations */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              3. Communication Failure, Timeout & Reconnect
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Simulates real-world hardware disconnects, network packet drops, heartbeat keepalive timeouts, and manual reconnects.
            </p>

            <div className="space-y-3">
              {/* Failure Simulation */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  placeholder="Failure reason..."
                  className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleSimulateFailure}
                  disabled={isExecuting || !currentDevice}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <WifiOffIcon size={14} />
                  Simulate Failure
                </button>
              </div>

              {/* Timeout Simulation */}
              <div className="flex gap-2">
                <input
                  type="number"
                  value={timeoutSeconds}
                  onChange={(e) => setTimeoutSeconds(e.target.value)}
                  placeholder="Silence duration (s)"
                  className="w-40 px-3 py-1.5 text-xs font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleSimulateTimeout}
                  disabled={isExecuting || !currentDevice}
                  className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <AlertTriangleIcon size={14} />
                  Simulate Timeout ({timeoutSeconds}s)
                </button>
              </div>

              {/* Reconnect Device */}
              <div>
                <button
                  onClick={handleReconnect}
                  disabled={isExecuting || !currentDevice}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <WifiIcon size={16} />
                  Reconnect Device (State &rarr; Active)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live HTTP API Response Console */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 flex-1 flex flex-col shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  HTTP API Response Inspector
                </h4>
              </div>
              {lastResponse && (
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    lastResponse.success
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  HTTP {lastResponse.status}
                </span>
              )}
            </div>

            {/* Console Output */}
            <div className="flex-1 overflow-y-auto max-h-[520px] font-mono text-xs text-slate-300">
              {lastResponse ? (
                <div className="space-y-3">
                  <div className="text-[11px] text-slate-400">
                    <span className="text-blue-400">Action:</span> {lastResponse.action}
                    <br />
                    <span className="text-blue-400">Timestamp:</span> {lastResponse.timestamp}
                  </div>

                  {lastResponse.success ? (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg">
                      <p className="text-emerald-400 font-semibold mb-1">
                        ✔ {lastResponse.data?.message || 'Operation Succeeded'}
                      </p>
                      <pre className="text-[11px] text-emerald-200/90 whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(lastResponse.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg">
                      <p className="text-rose-400 font-semibold mb-1">
                        ✖ {lastResponse.error || 'Request Rejected'}
                      </p>
                      <pre className="text-[11px] text-rose-200/90 whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(lastResponse.details || lastResponse.error, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-16">
                  <SimulationIcon size={32} className="mb-2 text-slate-600" />
                  <p className="text-xs">Click any simulation control on the left.</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Live JSON response and HTTP status codes will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
