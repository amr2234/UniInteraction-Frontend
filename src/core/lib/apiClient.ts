import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ApiResponse, ApiError } from "@/core/types/api";
import { i18n } from "@/i18n/i18n";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
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

    if (data && typeof data === "object" && "success" in data) {
      if (data.success) {
        if ("data" in data && data.data !== undefined) {
          return data.data;
        } else {
          return data;
        }
      } else {
        // Check for generic error messages
        const errorMessage = data.message || "";
        const genericErrorPatterns = [
          /an error occurred/i,
          /processing your request/i,
          /something went wrong/i,
          /operation failed/i,
        ];
        
        const isGenericError = genericErrorPatterns.some(pattern => 
          pattern.test(errorMessage)
        );
        
        throw new Error(
          isGenericError 
            ? i18n.t("errors.unexpectedError")
            : (data.message || i18n.t("errors.unexpectedError"))
        );
      }
    }

    return data;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      const apiError: ApiError = {
        status: 408,
        message: i18n.t("errors.timeoutError"),
        errors: undefined,
      };
      return Promise.reject(apiError);
    }

    if (!error.response) {
      const apiError: ApiError = {
        status: 0,
        message: i18n.t("errors.networkError"),
        errors: undefined,
      };
      return Promise.reject(apiError);
    }

    // Get the backend error message
    let errorMessage = error.response?.data?.message || error.message;
    
    // Map generic backend error messages to translated frontend messages
    const genericErrorPatterns = [
      /an error occurred/i,
      /processing your request/i,
      /something went wrong/i,
      /internal server error/i,
      /operation failed/i,
    ];
    
    // Check if the error message matches any generic pattern
    const isGenericError = genericErrorPatterns.some(pattern => 
      errorMessage && pattern.test(errorMessage)
    );

    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: isGenericError 
        ? i18n.t("errors.unexpectedError")
        : (errorMessage || i18n.t("errors.unexpectedError")),
      errors: error.response?.data?.errors,
    };

    if (apiError.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userProfile");
      window.location.href = "/login";
    }

    if (apiError.status === 403) {
      apiError.message = apiError.message || i18n.t("errors.forbidden");
    }

    if (apiError.status === 404) {
      apiError.message = apiError.message || i18n.t("errors.notFound");
    }

    if (apiError.status >= 500) {
      // For 500+ errors, always use translated message
      apiError.message = i18n.t("errors.serverError");
    }

    return Promise.reject(apiError);
  }
);

export const apiRequest = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get<ApiResponse<T>, T>(url, config);
  },

  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return apiClient.post<ApiResponse<T>, T>(url, data, config);
  },

  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return apiClient.put<ApiResponse<T>, T>(url, data, config);
  },

  patch: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return apiClient.patch<ApiResponse<T>, T>(url, data, config);
  },

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete<ApiResponse<T>, T>(url, config);
  },

  uploadFile: <T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return apiClient.post<ApiResponse<T>, T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default apiClient;
