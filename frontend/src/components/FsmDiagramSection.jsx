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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 lg:p-6 space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs">
              <FsmIcon size={20} />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                FLAT Automata Architecture: State & Transition Diagrams
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Deterministic Finite Automaton M = (Q, Σ, δ, q0, F) with Live Runtime State Highlighting
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher & Target Device */}
        <div className="flex flex-wrap items-center gap-2.5">
          {devices && devices.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-50 border border-gray-200/80 px-3 py-1.5 rounded-xl shadow-2xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Device:</span>
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

          <div className="inline-flex rounded-xl border border-gray-200 bg-slate-100/80 p-1 text-xs font-semibold shadow-2xs">
            <button
              onClick={() => setActiveView('both')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'both'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              Both Diagrams
            </button>
            <button
              onClick={() => setActiveView('state')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'state'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              State Diagram
            </button>
            <button
              onClick={() => setActiveView('transition')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'transition'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              Transition Diagram
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'table'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              Transition Table (δ)
            </button>
          </div>
        </div>
      </div>

      {/* DIAGRAMS CONTAINER */}
      <div className="space-y-6">
        {/* VIEW 1: STATE DIAGRAM */}
        {(activeView === 'state' || activeView === 'both') && (
          <div className="bg-slate-50/60 border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                1. DFA State Diagram (Circles & Directed Edges)
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Live Device State:</span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                    currentState === 'Active'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : currentState === 'Registered'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {currentDevice?.deviceId || 'Node'}: {currentState}
                </span>
              </div>
            </div>

            {/* SVG Canvas for State Diagram with abundant padding on all 4 borders */}
            <div className="w-full overflow-x-auto bg-white rounded-xl border border-slate-200/70 p-4 shadow-inner">
              <svg
                viewBox="0 0 920 460"
                className="w-full min-w-[760px] h-auto select-none font-sans"
              >
                <defs>
                  {/* Arrow markers */}
                  <marker id="arr-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#15803d" />
                  </marker>
                  <marker id="arr-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#b91c1c" />
                  </marker>
                  <marker id="arr-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#1d4ed8" />
                  </marker>
                  <marker id="arr-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#d97706" />
                  </marker>
                  <marker id="arr-dark" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#0f172a" />
                  </marker>

                  {/* Glow Filters */}
                  <filter id="fsm-glow-green" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#10b981" floodOpacity="0.8" />
                  </filter>
                  <filter id="fsm-glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.8" />
                  </filter>
                  <filter id="fsm-glow-red" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.8" />
                  </filter>
                </defs>

                {/* 1. START ARROW */}
                <line x1="50" y1="230" x2="132" y2="230" stroke="#0f172a" strokeWidth="2.5" markerEnd="url(#arr-dark)" />
                <rect x="55" y="202" width="48" height="20" rx="4" fill="#0f172a" />
                <text x="79" y="216" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Start</text>

                {/* 2. TRANSITIONS & DIRECTED EDGES */}
                {/* q0 -> q1 (ValidMessage) */}
                <path
                  d="M 224 210 Q 380 120 572 135"
                  fill="none"
                  stroke="#15803d"
                  strokeWidth="2.4"
                  markerEnd="url(#arr-green)"
                />
                <rect x="330" y="115" width="120" height="24" rx="6" fill="#dcfce7" stroke="#15803d" strokeWidth="1.2" />
                <text x="390" y="131" textAnchor="middle" fill="#14532d" fontSize="11" fontWeight="bold">ValidMessage</text>

                {/* q0 -> q2 (CommFailure / Timeout) */}
                <path
                  d="M 224 250 Q 380 340 572 325"
                  fill="none"
                  stroke="#b91c1c"
                  strokeWidth="2.4"
                  markerEnd="url(#arr-red)"
                />
                <rect x="305" y="320" width="165" height="24" rx="6" fill="#fee2e2" stroke="#b91c1c" strokeWidth="1.2" />
                <text x="387" y="336" textAnchor="middle" fill="#7f1d1d" fontSize="11" fontWeight="bold">CommFailure / Timeout</text>

                {/* q1 -> q2 (CommFailure / Timeout) Downward */}
                <line x1="655" y1="188" x2="655" y2="272" stroke="#b91c1c" strokeWidth="2.4" markerEnd="url(#arr-red)" />
                <rect x="668" y="218" width="160" height="24" rx="6" fill="#fee2e2" stroke="#b91c1c" strokeWidth="1.2" />
                <text x="748" y="234" textAnchor="middle" fill="#7f1d1d" fontSize="10.5" fontWeight="bold">CommFailure / Timeout</text>

                {/* q2 -> q1 (Valid / Reconnect) Upward */}
                <line x1="585" y1="272" x2="585" y2="190" stroke="#1d4ed8" strokeWidth="2.4" markerEnd="url(#arr-blue)" />
                <rect x="420" y="218" width="150" height="24" rx="6" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="1.2" />
                <text x="495" y="234" textAnchor="middle" fill="#1e3a8a" fontSize="10.5" fontWeight="bold">Valid / Reconnect</text>

                {/* Self-Loop on q0 (InvalidMessage) */}
                <path
                  d="M 155 186 C 115 110, 245 110, 205 186"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2.2"
                  markerEnd="url(#arr-amber)"
                />
                <rect x="105" y="95" width="150" height="22" rx="5" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" />
                <text x="180" y="110" textAnchor="middle" fill="#78350f" fontSize="10.5" fontWeight="bold">
                  InvalidMessage (Self)
                </text>

                {/* Self-Loop on q1 (ValidMessage & InvalidMessage) - Comfortably inside canvas */}
                <path
                  d="M 595 94 C 560 30, 680 30, 645 94"
                  fill="none"
                  stroke="#15803d"
                  strokeWidth="2.2"
                  markerEnd="url(#arr-green)"
                />
                <rect x="545" y="22" width="150" height="22" rx="5" fill="#dcfce7" stroke="#15803d" strokeWidth="1.2" />
                <text x="620" y="37" textAnchor="middle" fill="#14532d" fontSize="10.5" fontWeight="bold">
                  Valid (Self) / Invalid
                </text>

                {/* Self-Loop on q2 (CommFailure & InvalidMessage) - Comfortably inside canvas */}
                <path
                  d="M 595 364 C 560 428, 680 428, 645 364"
                  fill="none"
                  stroke="#b91c1c"
                  strokeWidth="2.2"
                  markerEnd="url(#arr-red)"
                />
                <rect x="545" y="415" width="150" height="22" rx="5" fill="#fee2e2" stroke="#b91c1c" strokeWidth="1.2" />
                <text x="620" y="430" textAnchor="middle" fill="#7f1d1d" fontSize="10.5" fontWeight="bold">
                  Failure / Invalid (Self)
                </text>

                {/* 3. NODES */}
                {/* NODE q0: Registered */}
                <g filter={currentState === 'Registered' ? 'url(#fsm-glow-amber)' : 'none'} className="transition-all duration-300">
                  <circle
                    cx="180"
                    cy="230"
                    r="46"
                    fill={currentState === 'Registered' ? '#fef3c7' : '#ffffff'}
                    stroke={currentState === 'Registered' ? '#d97706' : '#64748b'}
                    strokeWidth={currentState === 'Registered' ? '4.5' : '3'}
                  />
                  <text x="180" y="223" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="bold">q0</text>
                  <text x="180" y="243" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">Registered</text>
                </g>

                {/* NODE q1: Active (Accepting Double Circle) */}
                <g filter={currentState === 'Active' ? 'url(#fsm-glow-green)' : 'none'} className="transition-all duration-300">
                  {/* Outer circle */}
                  <circle
                    cx="620"
                    cy="140"
                    r="48"
                    fill={currentState === 'Active' ? '#dcfce7' : '#ffffff'}
                    stroke={currentState === 'Active' ? '#15803d' : '#15803d'}
                    strokeWidth={currentState === 'Active' ? '4.5' : '3'}
                  />
                  {/* Inner circle (Accepting state standard) */}
                  <circle
                    cx="620"
                    cy="140"
                    r="40"
                    fill="none"
                    stroke={currentState === 'Active' ? '#15803d' : '#15803d'}
                    strokeWidth="2"
                  />
                  <text x="620" y="133" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="bold">q1</text>
                  <text x="620" y="153" textAnchor="middle" fill="#15803d" fontSize="11" fontWeight="bold">Active (F)</text>
                </g>

                {/* NODE q2: Disconnected */}
                <g filter={currentState === 'Disconnected' ? 'url(#fsm-glow-red)' : 'none'} className="transition-all duration-300">
                  <circle
                    cx="620"
                    cy="320"
                    r="46"
                    fill={currentState === 'Disconnected' ? '#fee2e2' : '#ffffff'}
                    stroke={currentState === 'Disconnected' ? '#b91c1c' : '#64748b'}
                    strokeWidth={currentState === 'Disconnected' ? '4.5' : '3'}
                  />
                  <text x="620" y="313" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="bold">q2</text>
                  <text x="620" y="333" textAnchor="middle" fill="#b91c1c" fontSize="11" fontWeight="bold">Disconnected</text>
                </g>
              </svg>
            </div>

            {/* State Diagram Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-200/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-600 inline-block shadow-xs" />
                <span><strong>q0: Registered</strong> (Start / Initial State)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-emerald-700 double inline-block shadow-xs" />
                <span><strong>q1: Active (F)</strong> (Operational Accepting State)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-400 border border-rose-600 inline-block shadow-xs" />
                <span><strong>q2: Disconnected</strong> (Fault / Timeout State)</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TRANSITION DIAGRAM */}
        {(activeView === 'transition' || activeView === 'both') && (
          <div className="bg-slate-50/60 border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                2. DFA Transition Diagram (Event Flow & State Transitions)
              </span>
              <span className="text-[11px] text-gray-500 italic">
                Demonstrates deterministic state movement driven by sensor message inputs
              </span>
            </div>

            {/* SVG Canvas for Transition Diagram */}
            <div className="w-full overflow-x-auto bg-white rounded-xl border border-slate-200/70 p-4 shadow-inner">
              <svg
                viewBox="0 0 940 340"
                className="w-full min-w-[760px] h-auto select-none font-sans"
              >
                <defs>
                  <marker id="t-arr-dark" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#0f172a" />
                  </marker>
                  <marker id="t-arr-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#15803d" />
                  </marker>
                  <marker id="t-arr-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#b91c1c" />
                  </marker>
                  <marker id="t-arr-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#1d4ed8" />
                  </marker>
                </defs>

                {/* Start Arrow */}
                <line x1="30" y1="165" x2="88" y2="165" stroke="#0f172a" strokeWidth="2.5" markerEnd="url(#t-arr-dark)" />
                <rect x="35" y="137" width="46" height="20" rx="4" fill="#0f172a" />
                <text x="58" y="151" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Start</text>

                {/* Box 1: q0 Registered */}
                <rect
                  x="90"
                  y="120"
                  width="170"
                  height="90"
                  rx="12"
                  fill={currentState === 'Registered' ? '#fef3c7' : '#ffffff'}
                  stroke={currentState === 'Registered' ? '#d97706' : '#64748b'}
                  strokeWidth={currentState === 'Registered' ? '3.5' : '2'}
                />
                <text x="175" y="155" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="bold">q0</text>
                <text x="175" y="180" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">Registered</text>

                {/* Forward Arrow q0 -> q1 */}
                <path d="M 260 145 L 428 85" stroke="#15803d" strokeWidth="2.2" markerEnd="url(#t-arr-green)" />
                <rect x="295" y="92" width="120" height="22" rx="4" fill="#dcfce7" stroke="#15803d" strokeWidth="1.2" />
                <text x="355" y="107" textAnchor="middle" fill="#14532d" fontSize="11" fontWeight="bold">ValidMessage</text>

                {/* Forward Arrow q0 -> q2 */}
                <path d="M 260 185 L 428 245" stroke="#b91c1c" strokeWidth="2.2" markerEnd="url(#t-arr-red)" />
                <rect x="275" y="225" width="150" height="22" rx="4" fill="#fee2e2" stroke="#b91c1c" strokeWidth="1.2" />
                <text x="350" y="240" textAnchor="middle" fill="#7f1d1d" fontSize="10.5" fontWeight="bold">Failure / Timeout</text>

                {/* Box 2: q1 Active (Double Border) */}
                <rect
                  x="430"
                  y="35"
                  width="190"
                  height="95"
                  rx="12"
                  fill={currentState === 'Active' ? '#dcfce7' : '#ffffff'}
                  stroke={currentState === 'Active' ? '#15803d' : '#15803d'}
                  strokeWidth="3.5"
                />
                <rect x="435" y="40" width="180" height="85" rx="8" fill="none" stroke="#15803d" strokeWidth="1.5" />
                <text x="525" y="72" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="bold">q1 (Active)</text>
                <text x="525" y="98" textAnchor="middle" fill="#15803d" fontSize="12" fontWeight="bold">[Accepting State]</text>

                {/* Arrow q1 -> q2 (CommFailure) Downward */}
                <line x1="560" y1="132" x2="560" y2="208" stroke="#b91c1c" strokeWidth="2.2" markerEnd="url(#t-arr-red)" />
                <rect x="568" y="158" width="90" height="20" rx="4" fill="#fee2e2" stroke="#b91c1c" />
                <text x="613" y="172" textAnchor="middle" fill="#7f1d1d" fontSize="10" fontWeight="bold">CommFailure</text>

                {/* Arrow q2 -> q1 (Reconnect) Upward */}
                <line x1="490" y1="208" x2="490" y2="132" stroke="#1d4ed8" strokeWidth="2.2" markerEnd="url(#t-arr-blue)" />
                <rect x="400" y="158" width="82" height="20" rx="4" fill="#dbeafe" stroke="#1d4ed8" />
                <text x="441" y="172" textAnchor="middle" fill="#1e3a8a" fontSize="10.5" fontWeight="bold">Reconnect</text>

                {/* Box 3: q2 Disconnected */}
                <rect
                  x="430"
                  y="210"
                  width="190"
                  height="95"
                  rx="12"
                  fill={currentState === 'Disconnected' ? '#fee2e2' : '#ffffff'}
                  stroke={currentState === 'Disconnected' ? '#b91c1c' : '#64748b'}
                  strokeWidth={currentState === 'Disconnected' ? '3.5' : '2'}
                />
                <text x="525" y="250" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="bold">q2</text>
                <text x="525" y="275" textAnchor="middle" fill="#b91c1c" fontSize="12" fontWeight="bold">Disconnected</text>

                {/* Right Side Rules Box */}
                <rect x="670" y="35" width="245" height="270" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <rect x="670" y="35" width="245" height="35" rx="12" fill="#0f172a" />
                <text x="792" y="58" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">DFA Mathematical Rules</text>
                <text x="685" y="95" fill="#334155" fontSize="11" fontWeight="bold">• δ(q, ValidMessage):</text>
                <text x="700" y="115" fill="#15803d" fontSize="10.5">Transitions or stays in q1 (Active)</text>
                <text x="685" y="145" fill="#334155" fontSize="11" fontWeight="bold">• δ(q, InvalidMessage) = q:</text>
                <text x="700" y="165" fill="#d97706" fontSize="10.5">State unchanged, HTTP 400 alert</text>
                <text x="685" y="195" fill="#334155" fontSize="11" fontWeight="bold">• δ(q, CommFailure / Timeout):</text>
                <text x="700" y="215" fill="#b91c1c" fontSize="10.5">Transitions to q2 (Disconnected)</text>
                <text x="685" y="245" fill="#334155" fontSize="11" fontWeight="bold">• Automatic Recovery:</text>
                <text x="700" y="265" fill="#1d4ed8" fontSize="10.5">Valid telemetry restores to q1</text>
              </svg>
            </div>
          </div>
        )}

        {/* VIEW 3: TRANSITION TABLE (δ: Q × Σ → Q) */}
        {(activeView === 'table' || activeView === 'both') && (
          <div className="border border-gray-200/90 rounded-2xl overflow-hidden shadow-2xs">
            <div className="bg-slate-100/80 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />
                3. Complete State Transition Table (δ: Q × Σ → Q)
              </span>
              <span className="text-[11px] font-mono text-gray-500 font-semibold">15 Exhaustive Permutations (|Q × Σ| = 3 × 5 = 15)</span>
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
                          isCurrentStateMatch ? 'bg-blue-50/70 hover:bg-blue-50 font-semibold' : 'hover:bg-slate-50'
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
