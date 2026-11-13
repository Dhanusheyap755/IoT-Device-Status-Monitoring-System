/**
 * Frontend REST API Service for IoT Device Status Monitoring System
 * Handles communication between React UI and Express Backend
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const connErr = new Error(
        'Unable to reach backend server. Please verify Express is running on http://localhost:5000'
      );
      connErr.status = 0;
      throw connErr;
    }
    throw err;
  }
}

export const api = {
  // Health & Stats
  getHealth: () => request('/health'),
  getStats: () => request('/devices/stats'),

  // Devices
  getDevices: () => request('/devices'),
  getDeviceById: (id) => request(`/devices/${id}`),
  registerDevice: (payload) =>
    request('/devices/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Sensor Ingestion & Simulation Operations
  sendMessage: (payload) =>
    request('/devices/message', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  simulateFailure: (payload) =>
    request('/devices/failure', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  simulateTimeout: (payload) =>
    request('/devices/timeout', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  reconnectDevice: (deviceId) =>
    request(`/devices/${deviceId}/reconnect`, {
      method: 'POST',
    }),

  // Alerts
  getAlerts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.deviceId) query.append('deviceId', params.deviceId);
    if (params.severity) query.append('severity', params.severity);
    if (params.alertType) query.append('alertType', params.alertType);
    if (params.limit) query.append('limit', params.limit);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/alerts${queryString}`);
  },
  deleteAlert: (id) =>
    request(`/alerts/${id}`, {
      method: 'DELETE',
    }),

  // Telemetry Readings & FSM History
  getReadings: (deviceId, limit = 50) =>
    request(`/readings/${deviceId}?limit=${limit}`),
  getAllRecentReadings: (limit = 50) =>
    request(`/readings?limit=${limit}`),
  getDeviceHistory: (deviceId) =>
    request(`/history/${deviceId}`),
};
