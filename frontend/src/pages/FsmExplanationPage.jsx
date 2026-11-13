import React from 'react';
import { BookOpenIcon, FsmIcon, CheckCircleIcon } from '../components/Icons';

export default function FsmExplanationPage() {
  const transitionTable = [
    {
      current: 'Registered',
      event: 'ValidMessage',
      next: 'Active',
      action: 'Promote device to Active and persist sensor reading in MongoDB',
      alert: 'No',
    },
    {
      current: 'Registered',
      event: 'InvalidMessage',
      next: 'Registered',
      action: 'Maintain Registered state, reject payload (400), log validation alert',
      alert: 'Yes (Warning)',
    },
    {
      current: 'Registered',
      event: 'CommunicationFailure',
      next: 'Disconnected',
      action: 'Transition to Disconnected state, generate failure alert',
      alert: 'Yes (Error)',
    },
    {
      current: 'Registered',
      event: 'Timeout',
      next: 'Disconnected',
      action: 'Transition to Disconnected due to silence window expiration',
      alert: 'Yes (Warning)',
    },
    {
      current: 'Registered',
      event: 'Reconnect',
      next: 'Active',
      action: 'Explicit operator activation',
      alert: 'Yes (Info)',
    },

    {
      current: 'Active',
      event: 'ValidMessage',
      next: 'Active',
      action: 'Maintain Active operational state (self-loop), update telemetry & timestamp',
      alert: 'No',
    },
    {
      current: 'Active',
      event: 'InvalidMessage',
      next: 'Active',
      action: 'Maintain Active state, reject corrupted message (400), log alert',
      alert: 'Yes (Warning)',
    },
    {
      current: 'Active',
      event: 'CommunicationFailure',
      next: 'Disconnected',
      action: 'Demote to Disconnected, raise communication error alert',
      alert: 'Yes (Error)',
    },
    {
      current: 'Active',
      event: 'Timeout',
      next: 'Disconnected',
      action: 'Demote to Disconnected due to expired keepalive timer',
      alert: 'Yes (Warning)',
    },
    {
      current: 'Active',
      event: 'Reconnect',
      next: 'Active',
      action: 'Already Active; reaffirm operational status',
      alert: 'Yes (Info)',
    },

    {
      current: 'Disconnected',
      event: 'ValidMessage',
      next: 'Active',
      action: 'Automatic recovery: restore to Active and store valid telemetry',
      alert: 'Yes (Info)',
    },
    {
      current: 'Disconnected',
      event: 'InvalidMessage',
      next: 'Disconnected',
      action: 'Maintain Disconnected, reject message (400), raise validation alert',
      alert: 'Yes (Warning)',
    },
    {
      current: 'Disconnected',
      event: 'CommunicationFailure',
      next: 'Disconnected',
      action: 'Maintain Disconnected, log recurrent failure alert',
      alert: 'Yes (Error)',
    },
    {
      current: 'Disconnected',
      event: 'Timeout',
      next: 'Disconnected',
      action: 'Maintain Disconnected, log recurrent timeout alert',
      alert: 'Yes (Warning)',
    },
    {
      current: 'Disconnected',
      event: 'Reconnect',
      next: 'Active',
      action: 'Operator restores device connectivity; state becomes Active',
      alert: 'Yes (Info)',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
            <BookOpenIcon size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              FLAT Automata Theory Specification
            </h2>
            <p className="text-xs text-gray-500">
              Department of Information Technology • Velalar College of Engineering and Technology
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed mt-2">
          This system implements a formal Deterministic Finite Automaton (DFA) that acts as the core state-management engine for all connected IoT nodes. Every incoming HTTP packet is treated as an input symbol from the finite alphabet Σ, deterministically driving the state transition function δ.
        </p>
      </div>

      {/* Formal Definition 5-Tuple */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-md">
        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-4 font-mono">
          Mathematical Definition: 5-Tuple M = (Q, Σ, δ, q0, F)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">Q (Set of States):</span>
            <p className="text-slate-300">Q = &#123; Registered, Active, Disconnected &#125;</p>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              Finite set of mutually exclusive operational statuses.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">Σ (Input Alphabet):</span>
            <p className="text-slate-300">
              Σ = &#123; ValidMessage, InvalidMessage, CommunicationFailure, Timeout, Reconnect &#125;
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              Discrete telemetry and simulation events triggering transitions.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-blue-400 font-bold block mb-1">q0 (Initial State):</span>
            <p className="text-slate-300">q0 = Registered</p>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              All provisioned devices originate in the Registered state upon creation.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-rose-400 font-bold block mb-1">F (Operational / Accepting States):</span>
            <p className="text-slate-300">F = &#123; Active &#125;</p>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              Accepting operational state indicating healthy streaming connectivity.
            </p>
          </div>
        </div>
      </div>

      {/* Visual State Transition Diagram Box */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
          State Transition Diagram Representation
        </h3>
        <p className="text-xs text-gray-500 mb-6">
          Architectural transition map representing the transition function δ: Q × Σ &rarr; Q
        </p>

        {/* ASCII / Visual Graph Map */}
        <div className="bg-slate-50 p-6 rounded-xl border border-gray-200 font-mono text-xs overflow-x-auto text-slate-800 leading-loose">
          <div className="text-center font-bold text-blue-800 pb-3 border-b border-gray-200">
            [ Start ] ──( Provision / Register )──&gt; ( Registered )
          </div>
          <div className="py-4 space-y-2">
            <p className="text-amber-800">
              <strong>( Registered )</strong>
              <br />
              &nbsp;&nbsp;├── [ Valid Message ] ─────────────────────────&gt; <strong>( Active )</strong>
              <br />
              &nbsp;&nbsp;├── [ Communication Failure / Timeout ] ───────&gt; <strong>( Disconnected )</strong>
              <br />
              &nbsp;&nbsp;└── [ Invalid Message ] ──────────────────────&gt; <strong>( Registered )</strong> [Self-Loop + Alert]
            </p>
            <p className="text-emerald-800 pt-2 border-t border-gray-200">
              <strong>( Active )</strong>
              <br />
              &nbsp;&nbsp;├── [ Valid Message ] ─────────────────────────&gt; <strong>( Active )</strong> [Self-Loop, Telemetry Stored]
              <br />
              &nbsp;&nbsp;├── [ Communication Failure / Timeout ] ───────&gt; <strong>( Disconnected )</strong> [Alert Raised]
              <br />
              &nbsp;&nbsp;└── [ Invalid Message ] ──────────────────────&gt; <strong>( Active )</strong> [Self-Loop + Alert]
            </p>
            <p className="text-rose-800 pt-2 border-t border-gray-200">
              <strong>( Disconnected )</strong>
              <br />
              &nbsp;&nbsp;├── [ Valid Message / Reconnect ] ─────────────&gt; <strong>( Active )</strong> [Recovery to Operational]
              <br />
              &nbsp;&nbsp;├── [ Communication Failure / Timeout ] ───────&gt; <strong>( Disconnected )</strong> [Self-Loop]
              <br />
              &nbsp;&nbsp;└── [ Invalid Message ] ──────────────────────&gt; <strong>( Disconnected )</strong> [Self-Loop + Alert]
            </p>
          </div>
        </div>
      </div>

      {/* Complete State Transition Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            State Transition Table: δ(Current State, Event) &rarr; Next State
          </h3>
          <p className="text-xs text-gray-500">
            Exhaustive mapping for every pair in Q × Σ with associated operational actions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-gray-600 font-semibold">
                <th className="py-3 px-4">Current State (q ∈ Q)</th>
                <th className="py-3 px-4">Input Symbol / Event (σ ∈ Σ)</th>
                <th className="py-3 px-4">Next State (δ(q, σ))</th>
                <th className="py-3 px-4">System Action & Persistence Rule</th>
                <th className="py-3 px-4 text-center">Generates Alert?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono">
              {transitionTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-gray-900 font-sans">{row.current}</td>
                  <td className="py-2.5 px-4 font-bold text-blue-700">{row.event}</td>
                  <td className="py-2.5 px-4 font-bold text-gray-900 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        row.next === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.next === 'Registered'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {row.next}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-sans text-gray-600 max-w-md">{row.action}</td>
                  <td className="py-2.5 px-4 text-center font-sans text-[11px]">
                    <span
                      className={`font-semibold ${
                        row.alert.startsWith('Yes') ? 'text-amber-700' : 'text-gray-400'
                      }`}
                    >
                      {row.alert}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
