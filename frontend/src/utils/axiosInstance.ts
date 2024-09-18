import axios from 'axios';
import { getToken, setTokens } from './auth'; // Import token handling utilities

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // backend URL
  timeout: 10000, // Optional: Set a timeout for requests
});

// Request interceptor to add access token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getToken('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;
    const originalRequest = response.config;

    if (response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getToken('refreshToken');
        const { data } = await axios.post('http://localhost:3000/api/refresh-token', { refreshToken });
        setTokens(data.accessToken, data.refreshToken); // Update tokens in storage
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
