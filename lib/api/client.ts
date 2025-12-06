import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request [${config.method?.toUpperCase()} ${config.url}]:`, {
        params: config.params,
        baseURL: config.baseURL,
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server error
      const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
      const url = error.config?.url || 'UNKNOWN';
      const status = error.response.status;
      const statusText = error.response.statusText;
      console.error(`API Error [${method} ${url}]:`, {
        status,
        statusText,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // Network error
      const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
      const url = error.config?.url || 'UNKNOWN';
      console.error(`Network Error [${method} ${url}]:`, error.message);
    } else {
      // Request setup error
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
