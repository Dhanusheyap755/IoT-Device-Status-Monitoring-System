import React, { useState } from 'react';
import StatusPill from './StatusPill';
import { FsmIcon } from './Icons';

export default function FsmDiagramSection({
  devices = [],
  selectedDeviceId,
  setSelectedDeviceId,
  defaultView = 'both', // 'state' | 'transition' | 'table' | 'both'
}) {
  const [activeView, setActiveView] = useState(defaultView);
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const currentDevice =
    devices?.find((d) => d.deviceId === selectedDeviceId) || devices?.[0] || null;
  const currentState = currentDevice?.state || 'Registered';

  const transitions = [
    { current: 'Registered', event: 'ValidMessage', next: 'Active', action: 'Promote device to Active; store reading in MongoDB', alert: 'No' },
    { current: 'Registered', event: 'InvalidMessage', next: 'Registered', action: 'Reject payload (HTTP 400); state unchanged; log warning alert', alert: 'Yes (Warning)' },
    { current: 'Registered', event: 'CommunicationFailure', next: 'Disconnected', action: 'Transition to Disconnected; log communication error alert', alert: 'Yes (Error)' },
    { current: 'Registered', event: 'Timeout', next: 'Disconnected', action: 'Silence window (>45s) expired; demote to Disconnected', alert: 'Yes (Warning)' },
    { current: 'Registered', event: 'Reconnect', next: 'Active', action: 'Operator re-handshake; transition to Active', alert: 'Yes (Info)' },
    
    { current: 'Active', event: 'ValidMessage', next: 'Active', action: 'Maintain Active (self-loop); store sensor reading in MongoDB', alert: 'No' },
    { current: 'Active', event: 'InvalidMessage', next: 'Active', action: 'Maintain Active (self-loop); reject payload (HTTP 400); log alert', alert: 'Yes (Warning)' },
    { current: 'Active', event: 'CommunicationFailure', next: 'Disconnected', action: 'Demote to Disconnected; raise high-priority network alert', alert: 'Yes (Error)' },
    { current: 'Active', event: 'Timeout', next: 'Disconnected', action: 'Silence threshold (>45s) expired; demote to Disconnected', alert: 'Yes (Warning)' },
    { current: 'Active', event: 'Reconnect', next: 'Active', action: 'Reaffirm operational status; maintain Active state', alert: 'Yes (Info)' },

    { current: 'Disconnected', event: 'ValidMessage', next: 'Active', action: 'Automatic recovery: promote to Active; record telemetry', alert: 'Yes (Info)' },
    { current: 'Disconnected', event: 'Reconnect', next: 'Active', action: 'Manual restoration: promote to Active; log reconnection alert', alert: 'Yes (Info)' },
    { current: 'Disconnected', event: 'CommunicationFailure', next: 'Disconnected', action: 'Maintain Disconnected (self-loop); log recurrent network outage', alert: 'Yes (Error)' },
    { current: 'Disconnected', event: 'Timeout', next: 'Disconnected', action: 'Maintain Disconnected (self-loop); log recurrent timeout alert', alert: 'Yes (Warning)' },
    { current: 'Disconnected', event: 'InvalidMessage', next: 'Disconnected', action: 'Maintain Disconnected (self-loop); reject payload (HTTP 400)', alert: 'Yes (Warning)' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 lg:p-6 space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <FsmIcon size={18} />
            </span>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">
              FLAT Automata Architecture: State & Transition Diagrams
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Deterministic Finite Automaton M = (Q, Σ, δ, q0, F) with Live Device Highlighting
          </p>
        </div>

        {/* View Switcher & Device Target */}
        <div className="flex flex-wrap items-center gap-2">
          {devices && devices.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-gray-200 px-2.5 py-1 rounded-lg">
              <span className="text-[11px] font-semibold text-gray-500">Device:</span>
              <select
                value={currentDevice?.deviceId || ''}
                onChange={(e) => setSelectedDeviceId && setSelectedDeviceId(e.target.value)}
                className="text-xs font-mono font-bold bg-transparent text-blue-900 focus:outline-none cursor-pointer"
              >
                {devices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.deviceId} ({d.state})
                  </option>
                ))}
              </select>
              <StatusPill state={currentState} size="sm" />
            </div>
          )}

          <div className="inline-flex rounded-lg border border-gray-200 bg-slate-50 p-0.5 text-xs font-medium">
            <button
              onClick={() => setActiveView('both')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeView === 'both' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Both Diagrams
            </button>
            <button
              onClick={() => setActiveView('state')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeView === 'state' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              State Diagram
            </button>
            <button
              onClick={() => setActiveView('transition')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeView === 'transition' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Transition Diagram
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeView === 'table' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Transition Table (δ)
            </button>
          </div>
        </div>
      </div>

      {/* DIAGRAMS CONTAINER */}
      <div className="grid grid-cols-1 gap-6">
        {/* VIEW 1: STATE DIAGRAM */}
        {(activeView === 'state' || activeView === 'both') && (
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                1. DFA State Diagram (Circles & Directed Edges)
              </span>
              <span className="text-[11px] text-gray-500 font-mono">
                Active Node: <strong className={currentState === 'Active' ? 'text-emerald-600' : currentState === 'Registered' ? 'text-amber-600' : 'text-rose-600'}>{currentState}</strong>
              </span>
            </div>

            {/* SVG Canvas for State Diagram */}
            <div className="w-full overflow-x-auto">
              <svg
                viewBox="0 0 820 310"
                className="w-full min-w-[700px] h-auto select-none font-sans"
              >
                <defs>
                  {/* Arrow markers */}
                  <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#15803d" />
                  </marker>
                  <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#b91c1c" />
                  </marker>
                  <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#1d4ed8" />
                  </marker>
                  <marker id="arrow-gray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
                  </marker>
                  <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#10b981" floodOpacity="0.6" />
                  </filter>
                  <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.6" />
                  </filter>
                  <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.6" />
                  </filter>
                </defs>

                {/* Start Arrow pointing to q0 */}
                <line x1="40" y1="140" x2="135" y2="140" stroke="#0f172a" strokeWidth="2.5" markerEnd="url(#arrow-gray)" />
                <text x="65" y="130" fill="#0f172a" fontSize="12" fontWeight="bold">Start</text>

                {/* TRANSITIONS BETWEEN NODES */}
                {/* q0 -> q1 (ValidMessage) */}
                <path
                  d="M 230 115 Q 380 40 520 70"
                  fill="none"
                  stroke="#15803d"
                  strokeWidth="2.2"
                  markerEnd="url(#arrow-green)"
                  strokeDasharray={hoveredEvent === 'ValidMessage' ? '4 2' : 'none'}
                />
                <rect x="330" y="45" width="105" height="20" rx="4" fill="#dcfce7" stroke="#86efac" />
                <text x="382" y="59" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="bold">ValidMessage</text>

                {/* q0 -> q2 (CommFailure / Timeout) */}
                <path
                  d="M 230 165 Q 360 230 520 220"
                  fill="none"
                  stroke="#b91c1c"
                  strokeWidth="2.2"
                  markerEnd="url(#arrow-red)"
                />
                <rect x="315" y="195" width="135" height="20" rx="4" fill="#fee2e2" stroke="#fca5a5" />
                <text x="382" y="209" textAnchor="middle" fill="#991b1b" fontSize="10.5" fontWeight="bold">Failure / Timeout</text>

                {/* q1 -> q2 (CommFailure / Timeout) */}
                <line x1="610" y1="125" x2="610" y2="165" stroke="#b91c1c" strokeWidth="2.2" markerEnd="url(#arrow-red)" />
                <rect x="620" y="135" width="130" height="19" rx="4" fill="#fee2e2" stroke="#fca5a5" />
                <text x="685" y="149" textAnchor="middle" fill="#991b1b" fontSize="10">CommFailure / Timeout</text>

                {/* q2 -> q1 (ValidMessage / Reconnect) */}
                <line x1="560" y1="165" x2="560" y2="125" stroke="#1d4ed8" strokeWidth="2.2" markerEnd="url(#arrow-blue)" />
                <rect x="420" y="135" width="130" height="19" rx="4" fill="#dbeafe" stroke="#93c5fd" />
                <text x="485" y="149" textAnchor="middle" fill="#1e40af" fontSize="10">Valid / Reconnect</text>

                {/* Self Loop on q0 (InvalidMessage) */}
                <path d="M 160 90 C 130 10, 220 10, 190 90" fill="none" stroke="#d97706" strokeWidth="2" markerEnd="url(#arrow-gray)" />
                <text x="175" y="25" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="bold">InvalidMessage (q0)</text>

                {/* Self Loop on q1 (ValidMessage & InvalidMessage) */}
                <path d="M 570 30 C 530 -30, 640 -30, 600 30" fill="none" stroke="#15803d" strokeWidth="2" markerEnd="url(#arrow-green)" />
                <text x="585" y="-5" textAnchor="middle" fill="#15803d" fontSize="10" fontWeight="bold">Valid (Self) / Invalid</text>

                {/* Self Loop on q2 (CommFailure & InvalidMessage) */}
                <path d="M 575 270 C 535 340, 645 340, 605 270" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-gray)" />
                <text x="590" y="325" textAnchor="middle" fill="#475569" fontSize="10">Failure / Invalid (Self)</text>

                {/* NODE 1: q0 (Registered) */}
                <g filter={currentState === 'Registered' ? 'url(#glow-amber)' : 'none'}>
                  <circle
                    cx="175"
                    y="140"
                    r="48"
                    fill={currentState === 'Registered' ? '#fef3c7' : '#ffffff'}
                    stroke={currentState === 'Registered' ? '#f59e0b' : '#64748b'}
                    strokeWidth={currentState === 'Registered' ? '4' : '2.5'}
                  />
                  <text x="175" y="134" textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="bold">q0</text>
                  <text x="175" y="152" textAnchor="middle" fill="#64748b" fontSize="10.5" fontWeight="bold">Registered</text>
                </g>

                {/* NODE 2: q1 (Active - Accepting Double Circle) */}
                <g filter={currentState === 'Active' ? 'url(#glow-green)' : 'none'}>
                  {/* Outer circle */}
                  <circle
                    cx="585"
                    y="75"
                    r="52"
                    fill={currentState === 'Active' ? '#dcfce7' : '#ffffff'}
                    stroke={currentState === 'Active' ? '#10b981' : '#15803d'}
                    strokeWidth={currentState === 'Active' ? '4' : '3'}
                  />
                  {/* Inner circle (Accepting state standard) */}
                  <circle
                    cx="585"
                    y="75"
                    r="44"
                    fill="none"
                    stroke={currentState === 'Active' ? '#10b981' : '#15803d'}
                    strokeWidth="1.8"
                  />
                  <text x="585" y="69" textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="bold">q1</text>
                  <text x="585" y="86" textAnchor="middle" fill="#15803d" fontSize="10.5" fontWeight="bold">Active (F)</text>
                </g>

                {/* NODE 3: q2 (Disconnected) */}
                <g filter={currentState === 'Disconnected' ? 'url(#glow-red)' : 'none'}>
                  <circle
                    cx="585"
                    y="220"
                    r="48"
                    fill={currentState === 'Disconnected' ? '#fee2e2' : '#ffffff'}
                    stroke={currentState === 'Disconnected' ? '#ef4444' : '#64748b'}
                    strokeWidth={currentState === 'Disconnected' ? '4' : '2.5'}
                  />
                  <text x="585" y="214" textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="bold">q2</text>
                  <text x="585" y="232" textAnchor="middle" fill="#b91c1c" fontSize="10" fontWeight="bold">Disconnected</text>
                </g>
              </svg>
            </div>

            {/* State Diagram Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200/70 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-600 inline-block" />
                <span><strong>q0: Registered</strong> (Start state)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-emerald-700 double inline-block" />
                <span><strong>q1: Active (F)</strong> (Operational accepting)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-400 border border-rose-600 inline-block" />
                <span><strong>q2: Disconnected</strong> (Fault / Outage)</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TRANSITION DIAGRAM */}
        {(activeView === 'transition' || activeView === 'both') && (
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                2. DFA Transition Diagram (Event Flow & State Movement)
              </span>
              <span className="text-[11px] text-gray-500 italic">
                Each incoming event deterministically drives the next state
              </span>
            </div>

            {/* SVG Canvas for Transition Diagram */}
            <div className="w-full overflow-x-auto">
              <svg
                viewBox="0 0 820 220"
                className="w-full min-w-[700px] h-auto select-none font-sans"
              >
                <defs>
                  <marker id="t-arr-black" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#0f172a" />
                  </marker>
                  <marker id="t-arr-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#15803d" />
                  </marker>
                  <marker id="t-arr-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#b91c1c" />
                  </marker>
                </defs>

                {/* Start Arrow */}
                <line x1="30" y1="100" x2="95" y2="100" stroke="#0f172a" strokeWidth="2.5" markerEnd="url(#t-arr-black)" />
                <text x="50" y="90" fill="#0f172a" fontSize="11" fontWeight="bold">Start</text>

                {/* Box 1: q0 Registered */}
                <rect
                  x="100"
                  y="65"
                  width="150"
                  height="70"
                  rx="10"
                  fill={currentState === 'Registered' ? '#fef3c7' : '#ffffff'}
                  stroke={currentState === 'Registered' ? '#f59e0b' : '#64748b'}
                  strokeWidth={currentState === 'Registered' ? '3' : '2'}
                />
                <text x="175" y="95" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="bold">q0</text>
                <text x="175" y="115" textAnchor="middle" fill="#64748b" fontSize="11">Registered</text>

                {/* Transition Arrow q0 -> q1 */}
                <path d="M 250 85 L 430 45" stroke="#15803d" strokeWidth="2" markerEnd="url(#t-arr-green)" />
                <rect x="290" y="42" width="105" height="18" rx="3" fill="#dcfce7" stroke="#86efac" />
                <text x="342" y="55" textAnchor="middle" fill="#166534" fontSize="10" fontWeight="bold">ValidMessage</text>

                {/* Transition Arrow q0 -> q2 */}
                <path d="M 250 115 L 430 155" stroke="#b91c1c" strokeWidth="2" markerEnd="url(#t-arr-red)" />
                <rect x="285" y="145" width="115" height="18" rx="3" fill="#fee2e2" stroke="#fca5a5" />
                <text x="342" y="158" textAnchor="middle" fill="#991b1b" fontSize="9.5" fontWeight="bold">Failure / Timeout</text>

                {/* Box 2: q1 Active (Double Border) */}
                <rect
                  x="440"
                  y="15"
                  width="160"
                  height="65"
                  rx="10"
                  fill={currentState === 'Active' ? '#dcfce7' : '#ffffff'}
                  stroke={currentState === 'Active' ? '#10b981' : '#15803d'}
                  strokeWidth="3.5"
                />
                <rect x="444" y="19" width="152" height="57" rx="7" fill="none" stroke="#15803d" strokeWidth="1.2" />
                <text x="520" y="45" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="bold">q1 (Active)</text>
                <text x="520" y="63" textAnchor="middle" fill="#15803d" fontSize="10" fontWeight="bold">[Accepting State]</text>

                {/* Transition Arrow q1 -> q2 (CommFailure) */}
                <line x1="560" y1="80" x2="560" y2="120" stroke="#b91c1c" strokeWidth="2" markerEnd="url(#t-arr-red)" />
                <text x="570" y="105" fill="#991b1b" fontSize="9.5" fontWeight="bold">CommFailure</text>

                {/* Transition Arrow q2 -> q1 (Reconnect) */}
                <line x1="480" y1="120" x2="480" y2="80" stroke="#1d4ed8" strokeWidth="2" markerEnd="url(#t-arr-black)" />
                <text x="425" y="105" fill="#1e40af" fontSize="9.5" fontWeight="bold">Reconnect</text>

                {/* Box 3: q2 Disconnected */}
                <rect
                  x="440"
                  y="125"
                  width="160"
                  height="65"
                  rx="10"
                  fill={currentState === 'Disconnected' ? '#fee2e2' : '#ffffff'}
                  stroke={currentState === 'Disconnected' ? '#ef4444' : '#64748b'}
                  strokeWidth={currentState === 'Disconnected' ? '3' : '2'}
                />
                <text x="520" y="155" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="bold">q2</text>
                <text x="520" y="173" textAnchor="middle" fill="#b91c1c" fontSize="11">Disconnected</text>

                {/* Right side rules note */}
                <rect x="640" y="40" width="160" height="120" rx="8" fill="#f8fafc" stroke="#cbd5e1" />
                <text x="720" y="60" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Special Rules:</text>
                <text x="648" y="80" fill="#475569" fontSize="9.5">• Repeated Valid: q1 self</text>
                <text x="648" y="100" fill="#b45309" fontSize="9.5">• Invalid Msg: state unchanged</text>
                <text x="648" y="120" fill="#b91c1c" fontSize="9.5">• &gt;45s Silence: move to q2</text>
                <text x="648" y="140" fill="#15803d" fontSize="9.5">• Valid Msg recovers to q1</text>
              </svg>
            </div>
          </div>
        )}

        {/* VIEW 3: TRANSITION TABLE (δ: Q × Σ → Q) */}
        {(activeView === 'table' || activeView === 'both') && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                3. Complete State Transition Table (δ: Q × Σ → Q)
              </span>
              <span className="text-[11px] font-mono text-gray-500">15 Total Permutations (|Q × Σ| = 3 × 5 = 15)</span>
            </div>

            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-xs border-b border-gray-200 z-10">
                  <tr className="text-gray-700 font-semibold">
                    <th className="py-2.5 px-3">Current State (q)</th>
                    <th className="py-2.5 px-3">Input Condition (Σ)</th>
                    <th className="py-2.5 px-3">Next State δ(q, σ)</th>
                    <th className="py-2.5 px-3">Action & Database Persistence</th>
                    <th className="py-2.5 px-3 text-right">Alert Generated?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                  {transitions.map((t, idx) => {
                    const isCurrentStateMatch = t.current === currentState;
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          isCurrentStateMatch ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2 px-3 font-bold text-gray-900">{t.current}</td>
                        <td className="py-2 px-3 text-blue-700 font-semibold">{t.event}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              t.next === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : t.next === 'Registered'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {t.next}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-sans text-gray-600 text-xs">{t.action}</td>
                        <td className="py-2 px-3 text-right font-sans text-xs">
                          <span
                            className={`font-semibold ${
                              t.alert.includes('Error')
                                ? 'text-rose-600'
                                : t.alert.includes('Warning')
                                ? 'text-amber-600'
                                : t.alert.includes('Info')
                                ? 'text-blue-600'
                                : 'text-gray-400'
                            }`}
                          >
                            {t.alert}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
