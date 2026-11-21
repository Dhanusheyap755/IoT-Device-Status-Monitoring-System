import React, { useState, useEffect } from 'react';
import StatusPill from '../components/StatusPill';
import { FsmIcon, RefreshCwIcon, ClockIcon } from '../components/Icons';
import FsmDiagramSection from '../components/FsmDiagramSection';
import { api } from '../services/api';

export default function FsmVisualizerPage({
  devices,
  selectedDeviceId,
  setSelectedDeviceId,
  onRefresh,
}) {
  const currentDevice =
    devices?.find((d) => d.deviceId === selectedDeviceId) || devices?.[0] || null;

  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (currentDevice?.deviceId) {
      loadHistory(currentDevice.deviceId);
    }
  }, [currentDevice?.deviceId]);

  const loadHistory = async (devId) => {
    setIsLoadingHistory(true);
    try {
      const response = await api.getDeviceHistory(devId);
      setHistory(response.data || []);
    } catch (err) {
      console.error('Failed to load FSM transition history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const currentState = currentDevice?.state || 'Registered';

  return (
    <div className="space-y-6">
      {/* Header and Device Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Finite State Machine (FSM) Visualizer
          </h2>
          <p className="text-xs text-gray-500">
            Interactive representation of Deterministic Finite Automaton M = (Q, Σ, δ, q0, F)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-700">Target Device:</label>
          <select
            value={currentDevice?.deviceId || ''}
            onChange={(e) => {
              if (setSelectedDeviceId) setSelectedDeviceId(e.target.value);
            }}
            className="text-xs font-mono font-bold bg-white border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {devices &&
              devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.deviceId} - {d.deviceName} [{d.state}]
                </option>
              ))}
          </select>

          <button
            onClick={() => {
              if (currentDevice?.deviceId) loadHistory(currentDevice.deviceId);
              onRefresh();
            }}
            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            <RefreshCwIcon size={14} className={isLoadingHistory ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Full State & Transition Diagrams */}
      <FsmDiagramSection
        devices={devices}
        selectedDeviceId={currentDevice?.deviceId}
        setSelectedDeviceId={setSelectedDeviceId}
        defaultView="both"
      />

      {/* State Breakdown Detail Cards */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <FsmIcon size={18} className="text-blue-600" />
              Automaton Node Status for Device: <span className="text-blue-700 font-mono">{currentDevice?.deviceId || 'N/A'}</span>
            </h3>
            <p className="text-xs text-gray-500">
              Active operational status and incoming transition triggers
            </p>
          </div>
          <div>
            <StatusPill state={currentState} size="md" />
          </div>
        </div>

        {/* Visual Graph Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-2 relative">
          {/* State 1: Registered (q0) */}
          <div
            className={`p-6 rounded-2xl border-2 transition-all duration-300 relative ${
              currentState === 'Registered'
                ? 'border-amber-500 bg-amber-50/50 shadow-lg shadow-amber-500/10 scale-102 ring-4 ring-amber-200'
                : 'border-dashed border-gray-300 bg-gray-50/60 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                q0: Initial State
              </span>
              {currentState === 'Registered' && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>
            <h4 className="text-lg font-bold text-gray-900">Registered</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Device provisioned in database. Telemetry stream not yet received.
            </p>

            <div className="mt-4 pt-3 border-t border-amber-200/60 text-[11px] text-gray-600 space-y-1">
              <div>
                &bull; <strong className="text-emerald-700">+ ValidMessage</strong> &rarr; Active
              </div>
              <div>
                &bull; <strong className="text-rose-700">+ Failure/Timeout</strong> &rarr; Disconnected
              </div>
              <div>
                &bull; <strong className="text-amber-700">+ InvalidMessage</strong> &rarr; Registered (Self)
              </div>
            </div>
          </div>

          {/* State 2: Active (Operational / Accepting) */}
          <div
            className={`p-6 rounded-2xl border-2 transition-all duration-300 relative ${
              currentState === 'Active'
                ? 'border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/10 scale-102 ring-4 ring-emerald-200'
                : 'border-dashed border-gray-300 bg-gray-50/60 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                F: Operational
              </span>
              {currentState === 'Active' && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              )}
            </div>
            <h4 className="text-lg font-bold text-gray-900">Active</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Authenticated device sending regular valid sensor telemetry within timeout limits.
            </p>

            <div className="mt-4 pt-3 border-t border-emerald-200/60 text-[11px] text-gray-600 space-y-1">
              <div>
                &bull; <strong className="text-emerald-700">+ ValidMessage</strong> &rarr; Active (Self Loop)
              </div>
              <div>
                &bull; <strong className="text-rose-700">+ Failure/Timeout</strong> &rarr; Disconnected
              </div>
              <div>
                &bull; <strong className="text-amber-700">+ InvalidMessage</strong> &rarr; Active (Self)
              </div>
            </div>
          </div>

          {/* State 3: Disconnected */}
          <div
            className={`p-6 rounded-2xl border-2 transition-all duration-300 relative ${
              currentState === 'Disconnected'
                ? 'border-rose-500 bg-rose-50/50 shadow-lg shadow-rose-500/10 scale-102 ring-4 ring-rose-200'
                : 'border-dashed border-gray-300 bg-gray-50/60 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                Outage / Idle
              </span>
              {currentState === 'Disconnected' && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <h4 className="text-lg font-bold text-gray-900">Disconnected</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Device unreachable due to packet loss, timeout expiration, or hardware fault.
            </p>

            <div className="mt-4 pt-3 border-t border-rose-200/60 text-[11px] text-gray-600 space-y-1">
              <div>
                &bull; <strong className="text-emerald-700">+ Valid / Reconnect</strong> &rarr; Active
              </div>
              <div>
                &bull; <strong className="text-rose-700">+ Failure/Timeout</strong> &rarr; Disconnected (Self)
              </div>
              <div>
                &bull; <strong className="text-amber-700">+ InvalidMessage</strong> &rarr; Disconnected (Self)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* State Transition History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Audit Trail: State Transition History ({history.length})
            </h3>
            <p className="text-xs text-gray-500">
              Chronological ledger of every FSM event (δ: Q × Σ → Q) recorded for {currentDevice?.deviceId}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-gray-600 font-semibold">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Previous State</th>
                <th className="py-3 px-4">Triggering Event (Σ)</th>
                <th className="py-3 px-4">Resulting State (Q)</th>
                <th className="py-3 px-4">Transition Action & Description</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.length > 0 ? (
                history.map((evt, idx) => (
                  <tr key={evt._id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-gray-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                        {evt.previousState}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 text-xs">
                      {evt.event}
                    </td>
                    <td className="py-3 px-4">
                      <StatusPill state={evt.currentState} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs max-w-sm">
                      {evt.details?.action || evt.details?.reason || 'State Transition Logged'}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-500 text-[11px]">
                      {new Date(evt.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400 text-xs">
                    No state transitions logged yet for this device.
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
