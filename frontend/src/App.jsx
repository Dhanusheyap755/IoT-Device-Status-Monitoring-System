import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import OverviewDashboard from './pages/OverviewDashboard';
import DeviceManagementPage from './pages/DeviceManagementPage';
import SensorMonitoringPage from './pages/SensorMonitoringPage';
import AlertsPage from './pages/AlertsPage';
import FsmVisualizerPage from './pages/FsmVisualizerPage';
import SimulationControlsPage from './pages/SimulationControlsPage';
import FsmExplanationPage from './pages/FsmExplanationPage';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [readings, setReadings] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('IOT001');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Load all dashboard state
  const loadDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch Health (always available even if DB degraded)
      const healthRes = await api.getHealth().catch((err) => {
        setServerError(err.message);
        return null;
      });

      if (healthRes) {
        setHealth(healthRes);
        setServerError(null);

        // 2. If database is connected, fetch operational collections
        if (healthRes.database?.connected) {
          const [devicesRes, statsRes, alertsRes, readingsRes] = await Promise.all([
            api.getDevices().catch(() => ({ data: [] })),
            api.getStats().catch(() => ({ data: null })),
            api.getAlerts({ limit: 50 }).catch(() => ({ data: [] })),
            api.getAllRecentReadings(50).catch(() => ({ data: [] })),
          ]);

          const loadedDevices = devicesRes.data || [];
          setDevices(loadedDevices);
          setStats(statsRes.data || null);
          setAlerts(alertsRes.data || []);
          setReadings(readingsRes.data || []);

          if (loadedDevices.length > 0 && !loadedDevices.some((d) => d.deviceId === selectedDeviceId)) {
            setSelectedDeviceId(loadedDevices[0].deviceId);
          }
        } else {
          setDevices([]);
          setStats(null);
          setAlerts([]);
          setReadings([]);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setServerError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    loadDashboardData();

    // Auto-refresh poll every 6 seconds
    const interval = setInterval(() => {
      loadDashboardData();
    }, 6000);

    return () => clearInterval(interval);
  }, [loadDashboardData]);

  const handleSelectDevice = (devId) => {
    setSelectedDeviceId(devId);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={alerts.length}
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Header
          health={health}
          isRefreshing={isRefreshing}
          onRefresh={loadDashboardData}
        />

        {/* Global Connection Warning Banner */}
        {(!health || !health.database?.connected) && (
          <div className="bg-amber-500 text-amber-950 px-6 py-2.5 text-xs flex items-center justify-between border-b border-amber-600 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold">⚠️ Notice:</span>
              <span>
                {serverError
                  ? `Backend unreachable: ${serverError}. Start Express with "npm start" in backend/.`
                  : 'MongoDB connection is currently offline or connecting. Start MongoDB with "mongod" or configure MONGODB_URI in backend/.env.'}
              </span>
            </div>
            <button
              onClick={loadDashboardData}
              className="px-2.5 py-1 bg-amber-900 text-amber-100 rounded text-[11px] font-semibold hover:bg-amber-950 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Scrollable Content View */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto pb-8">
            {activeTab === 'overview' && (
              <OverviewDashboard
                stats={stats}
                devices={devices}
                alerts={alerts}
                readings={readings}
                onNavigate={setActiveTab}
                onSelectDeviceForSimulation={handleSelectDevice}
              />
            )}

            {activeTab === 'devices' && (
              <DeviceManagementPage
                devices={devices}
                onRefresh={loadDashboardData}
                onSelectDeviceForSimulation={handleSelectDevice}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'sensors' && (
              <SensorMonitoringPage
                devices={devices}
                selectedDeviceFilter={selectedDeviceId}
                onRefresh={loadDashboardData}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertsPage
                alerts={alerts}
                devices={devices}
                onRefresh={loadDashboardData}
              />
            )}

            {activeTab === 'fsm-visualizer' && (
              <FsmVisualizerPage
                devices={devices}
                selectedDeviceId={selectedDeviceId}
                setSelectedDeviceId={handleSelectDevice}
                onRefresh={loadDashboardData}
              />
            )}

            {activeTab === 'simulation' && (
              <SimulationControlsPage
                devices={devices}
                selectedDeviceId={selectedDeviceId}
                setSelectedDeviceId={handleSelectDevice}
                onRefresh={loadDashboardData}
              />
            )}

            {activeTab === 'fsm-explanation' && <FsmExplanationPage />}
          </div>
        </main>

        {/* Persistent Footer */}
        <Footer />
      </div>
    </div>
  );
}
