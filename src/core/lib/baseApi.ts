import { apiRequest } from './apiClient';
import { PaginatedResponse } from '@/core/types/api';
import { AxiosRequestConfig } from 'axios';

/**
 * Generic Base API Class
 * Provides common CRUD operations for all API endpoints
 * 
 * @template T - The DTO type for the resource
 * @template CreatePayload - The payload type for creating a resource
 * @template UpdatePayload - The payload type for updating a resource
 * @template Filters - The filter type for querying resources
 */
export class BaseApi<
  T,
  CreatePayload = Partial<T>,
  UpdatePayload = Partial<T>,
  Filters = Record<string, any>
> {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Build query string from filters object
   */
  protected buildQueryString(filters?: Filters): string {
    if (!filters) return '';

    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Handle arrays
        if (Array.isArray(value)) {
          value.forEach((item) => params.append(key, String(item)));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Get all resources (paginated)
   */
  async getAll(filters?: Filters): Promise<PaginatedResponse<T>> {
    const queryString = this.buildQueryString(filters);
    return apiRequest.get<PaginatedResponse<T>>(`${this.baseUrl}/pagination${queryString}`);
  }

  /**
   * Get all resources (non-paginated list)
   */
  async getList(filters?: Filters): Promise<T[]> {
    const queryString = this.buildQueryString(filters);
    return apiRequest.get<T[]>(`${this.baseUrl}${queryString}`);
  }

  /**
   * Get a single resource by ID
   */
  async getById(id: number | string): Promise<T> {
    return apiRequest.get<T>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new resource
   */
  async create(payload: CreatePayload): Promise<T> {
    return apiRequest.post<T>(this.baseUrl, payload);
  }

  /**
   * Update an existing resource
   */
  async update(id: number | string, payload: UpdatePayload): Promise<T> {
    return apiRequest.put<T>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * Partially update a resource
   */
  async patch(id: number | string, payload: Partial<UpdatePayload>): Promise<T> {
    return apiRequest.patch<T>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * Delete a resource
   */
  async delete(id: number | string): Promise<void> {
    return apiRequest.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Toggle status (activate/deactivate)
   */
  async toggleStatus(id: number | string, isActive: boolean): Promise<T> {
    return apiRequest.patch<T>(`${this.baseUrl}/${id}/status`, { isActive });
  }

  /**
   * Bulk delete resources
   */
  async bulkDelete(ids: number[]): Promise<void> {
    return apiRequest.delete<void>(`${this.baseUrl}/bulk-delete`, { data: { ids } });
  }

  /**
   * Export resources (returns Blob for file download)
   */
  async export(filters?: Filters, config?: AxiosRequestConfig): Promise<Blob> {
    const queryString = this.buildQueryString(filters);
    return apiRequest.get<Blob>(`${this.baseUrl}/export${queryString}`, {
      ...config,
      responseType: 'blob',
    });
  }

  /**
   * Search resources
   */
  async search(searchTerm: string, pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<T>> {
    return apiRequest.get<PaginatedResponse<T>>(
      `${this.baseUrl}/search?term=${encodeURIComponent(searchTerm)}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  /**
   * Upload file
   */
  async uploadFile(formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    return apiRequest.uploadFile<T>(`${this.baseUrl}/upload`, formData, config);
  }

  /**
   * Custom GET request
   */
  protected async customGet<R = T>(endpoint: string, config?: AxiosRequestConfig): Promise<R> {
    return apiRequest.get<R>(`${this.baseUrl}${endpoint}`, config);
  }

  /**
   * Custom POST request
   */
  protected async customPost<R = T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return apiRequest.post<R>(`${this.baseUrl}${endpoint}`, data, config);
  }

  /**
   * Custom PUT request
   */
  protected async customPut<R = T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return apiRequest.put<R>(`${this.baseUrl}${endpoint}`, data, config);
  }

  /**
   * Custom PATCH request
   */
  protected async customPatch<R = T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return apiRequest.patch<R>(`${this.baseUrl}${endpoint}`, data, config);
  }

  /**
   * Custom DELETE request
   */
  protected async customDelete<R = void>(endpoint: string, config?: AxiosRequestConfig): Promise<R> {
    return apiRequest.delete<R>(`${this.baseUrl}${endpoint}`, config);
  }
}
