import React from 'react';
import {
  DashboardIcon,
  DevicesIcon,
  SensorIcon,
  AlertIcon,
  FsmIcon,
  SimulationIcon,
  BookOpenIcon,
} from './Icons';

export default function Sidebar({ activeTab, setActiveTab, alertCount = 0 }) {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview Dashboard',
      icon: <DashboardIcon size={18} />,
    },
    {
      id: 'devices',
      label: 'Device Management',
      icon: <DevicesIcon size={18} />,
    },
    {
      id: 'sensors',
      label: 'Sensor Monitoring',
      icon: <SensorIcon size={18} />,
    },
    {
      id: 'alerts',
      label: 'System Alerts',
      icon: <AlertIcon size={18} />,
      badge: alertCount > 0 ? alertCount : null,
    },
    {
      id: 'fsm-visualizer',
      label: 'FSM Visualizer',
      icon: <FsmIcon size={18} />,
    },
    {
      id: 'simulation',
      label: 'Simulation Controls',
      icon: <SimulationIcon size={18} />,
    },
    {
      id: 'fsm-explanation',
      label: 'FLAT Documentation',
      icon: <BookOpenIcon size={18} />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800 bg-slate-950">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold">
          IoT
        </div>
        <div>
          <span className="font-bold text-sm tracking-tight text-white block">
            IoT Monitor
          </span>
          <span className="text-[11px] text-blue-400 font-mono tracking-wider">
            FLAT FSM ENGINE
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive
                      ? 'bg-white text-blue-700'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Student Project Badge */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 m-3 rounded-xl">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Student Information
        </div>
        <div className="mt-2 text-xs">
          <p className="font-bold text-white">Reg No: 24ITR018</p>
          <p className="text-slate-400 text-[11px] mt-0.5">Project #18 (FLAT / Full Stack)</p>
          <p className="text-slate-500 text-[10px] mt-1">Velalar College of Engg & Tech</p>
        </div>
      </div>
    </aside>
  );
}
