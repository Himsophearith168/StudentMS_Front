import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface ClassItem {
  id?: number | string;
  className?: string;
  name?: string;
  code?: string;
  description?: string;
  [key: string]: any;
}

function extractArrayFromResponse(res: any): any[] {
  if (!res) return [];
  if (Array.isArray(res)) return res;

  const keys = ['data', 'content', 'students', 'classes', 'items', 'result', 'list', 'body', 'response', 'payload'];
  for (const k of keys) {
    if (Array.isArray(res[k])) {
      return res[k];
    }
  }

  if (res.data && typeof res.data === 'object') {
    if (Array.isArray(res.data)) return res.data;
    for (const k of keys) {
      if (Array.isArray(res.data[k])) {
        return res.data[k];
      }
    }
  }

  if (res.result && typeof res.result === 'object') {
    for (const k of keys) {
      if (Array.isArray(res.result[k])) {
        return res.result[k];
      }
    }
  }

  const total = res.totalElements ?? res.totalCount ?? res.total ?? res.count ?? res.size ?? res.data?.totalElements ?? res.data?.totalCount ?? res.data?.total ?? res.data?.count;
  if (typeof total === 'number' && total > 0) {
    return new Array(total).fill({});
  }

  return [];
}

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  constructor(private api: ApiService) {}

  async getClasses(): Promise<ClassItem[]> {
    const candidatePaths = ['/classes', '/class', '/classes/all', '/class/all', '/classes/list'];
    for (const path of candidatePaths) {
      try {
        const res = await this.api.fetch<any>(path);
        console.log(`Fetched ${path} response:`, res);
        const arr = extractArrayFromResponse(res);
        if (arr.length > 0) {
          console.log(`[ClassService] Found ${arr.length} classes via ${path}`);
          return arr;
        }
      } catch (error) {
        // try next path candidate
      }
    }
    console.warn('[ClassService] Could not find any classes in API response.');
    return [];
  }

  async getClassById(id: string | number): Promise<ClassItem> {
    const res = await this.api.fetch<any>(`/classes/${id}`);
    return res && res.data !== undefined ? res.data : res;
  }

  async createClass(payload: ClassItem): Promise<ClassItem> {
    const res = await this.api.post<any>('/classes', payload);
    return res && res.data !== undefined ? res.data : res;
  }

  async updateClass(id: string | number, payload: ClassItem): Promise<ClassItem> {
    const res = await this.api.put<any>(`/classes/${id}`, payload);
    return res && res.data !== undefined ? res.data : res;
  }

  async deleteClass(id: string | number): Promise<void> {
    await this.api.delete<any>(`/classes/${id}`);
  }
}

