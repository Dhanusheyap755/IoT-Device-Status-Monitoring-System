/**
 * Frontend REST API Service for IoT Device Status Monitoring System
 * Handles communication between React UI and Express Backend
 * Supports both local development (http://localhost:5000/api) and
 * production deployments via VITE_API_BASE_URL (Render backend)
 */

const rawApiUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

// Normalize URL: Strip trailing slash and ensure /api endpoint prefix
const cleanUrl = rawApiUrl.replace(/\/+$/, '');
export const API_BASE_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

async function request(endpoint, options = {}) {
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${formattedEndpoint}`;

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
        `Unable to reach backend API at ${API_BASE_URL}. If deployed on Render, please allow up to 60 seconds for the free instance to spin up.`
      );
      connErr.status = 0;
      throw connErr;
    }
    throw err;
  }
}

export const api = {
  // Base URL introspection
  getBaseUrl: () => API_BASE_URL,

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
