import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '@/core/types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5193/api';

// Create Axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
});

// Request interceptor - Add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Extract tokens from headers if present
// REMOVED: No longer needed since tokens are now returned in response body

// Response interceptor - Handle API response envelope
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    const { data } = response;

    // If backend follows ApiResponse<T> format
    if (data && typeof data === 'object' && 'success' in data) {
      if (data.success) {
        // Check if data has a data property (nested ApiResponse)
        if ('data' in data && data.data !== undefined) {
          // Return the unwrapped data for successful responses
          return data.data;
        } else {
          // Return the data directly if it's already the correct format
          return data;
        }
      } else {
        // Throw error with message from backend
        throw new Error(data.message || 'Operation failed');
      }
    }

    // Fallback: return raw data if not in ApiResponse format
    return data;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      const apiError: ApiError = {
        status: 408, // Request Timeout
        message: 'Request timeout',
        errors: undefined,
      };
      return Promise.reject(apiError);
    }
    
    // Handle network errors specifically
    if (!error.response) {
      // Network error (no response received)
      const apiError: ApiError = {
        status: 0,
        message: 'Network Error',
        errors: undefined,
      };
      return Promise.reject(apiError);
    }
    
    // Handle error responses
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors,
    };

    // Handle specific error cases
    if (apiError.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userProfile');
      window.location.href = '/login';
    }

    if (apiError.status === 403) {
      // Forbidden - user doesn't have permission
      apiError.message = apiError.message || 'You do not have permission to perform this action';
    }

    return Promise.reject(apiError);
  }
);

// Generic request wrapper with type safety
export const apiRequest = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get<ApiResponse<T>, T>(url, config);
  },

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post<ApiResponse<T>, T>(url, data, config);
  },

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.put<ApiResponse<T>, T>(url, data, config);
  },

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.patch<ApiResponse<T>, T>(url, data, config);
  },

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete<ApiResponse<T>, T>(url, config);
  },

  // Special handler for file uploads
  uploadFile: <T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post<ApiResponse<T>, T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default apiClient;
