import { Injectable } from '@angular/core';
import { API_BASE_URL, API_KEY } from '../config';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      ...customHeaders,
    };
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const urlsToTry = [
      `${API_BASE_URL}${path}`,
      `http://localhost:8081/api/v1${path}`,
      `http://localhost:8080/api/v1${path}`,
      `http://localhost:8081/api${path}`,
      `http://localhost:8080/api${path}`,
      `http://localhost:8081${path}`,
      `http://localhost:8080${path}`,
    ];

    let lastError: any = null;
    let lastErrorResponse: any = null;

    for (const url of urlsToTry) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: this.getHeaders(options.headers),
        });

        if (!response.ok) {
          const text = await response.text();
          console.warn(`[ApiService] ${options.method || 'GET'} ${url} returned ${response.status}:`, text);
          lastErrorResponse = { status: response.status, statusText: response.statusText, body: text };
          continue;
        }

        const text = await response.text();
        const trimmed = text.trim();
        if (trimmed && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
          console.log(`[ApiService] Successfully fetched from: ${url}`);
          return JSON.parse(trimmed) as T;
        }
      } catch (e) {
        console.warn(`[ApiService] ${options.method || 'GET'} ${url} failed:`, e);
        lastError = e;
      }
    }

    console.warn(`[ApiService] Could not fetch ${path} from candidate URLs.`);
    if (lastErrorResponse) {
      throw new Error(`API Error ${lastErrorResponse.status}: ${lastErrorResponse.statusText} - ${lastErrorResponse.body}`);
    }
    throw lastError || new Error(`Failed to fetch ${path}`);
  }

  fetch<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(path: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

