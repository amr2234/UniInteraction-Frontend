import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '@/core/types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL


const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, 
});


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





apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    const { data } = response;

    
    if (data && typeof data === 'object' && 'success' in data) {
      if (data.success) {
        
        if ('data' in data && data.data !== undefined) {
          
          return data.data;
        } else {
          
          return data;
        }
      } else {
        
        throw new Error(data.message || 'Operation failed');
      }
    }

    
    return data;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      const apiError: ApiError = {
        status: 408, 
        message: 'Request timeout',
        errors: undefined,
      };
      return Promise.reject(apiError);
    }
    
    
    if (!error.response) {
      
      const apiError: ApiError = {
        status: 0,
        message: 'Network Error',
        errors: undefined,
      };
      return Promise.reject(apiError);
    }
    
    
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors,
    };

    
    if (apiError.status === 401) {
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userProfile');
      window.location.href = '/login';
    }

    if (apiError.status === 403) {
      
      apiError.message = apiError.message || 'You do not have permission to perform this action';
    }

    return Promise.reject(apiError);
  }
);


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
