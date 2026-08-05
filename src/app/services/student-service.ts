import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface Student {
  id?: number | string;
  name: string;
  email?: string;
  major?: string;
  grade?: string;
  status?: string;
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
export class StudentService {
  constructor(private api: ApiService) {}

  async getStudents(): Promise<Student[]> {
    const candidatePaths = ['/students', '/student', '/students/all', '/student/all', '/students/list'];
    for (const path of candidatePaths) {
      try {
        const res = await this.api.fetch<any>(path);
        console.log(`Fetched ${path} response:`, res);
        const arr = extractArrayFromResponse(res);
        if (arr.length > 0) {
          console.log(`[StudentService] Found ${arr.length} students via ${path}`);
          return arr;
        }
      } catch (error) {
        // try next path candidate
      }
    }
    console.warn('[StudentService] Could not find any students in API response.');
    return [];
  }

  async getStudentById(id: string | number): Promise<Student> {
    const res = await this.api.fetch<any>(`/students/${id}`);
    return res && res.data !== undefined ? res.data : res;
  }

  async createStudent(payload: Student): Promise<Student> {
    const res = await this.api.post<any>('/students', payload);
    return res && res.data !== undefined ? res.data : res;
  }

  async updateStudent(id: string | number, payload: Student): Promise<Student> {
    const res = await this.api.put<any>(`/students/${id}`, payload);
    return res && res.data !== undefined ? res.data : res;
  }

  async deleteStudent(id: string | number): Promise<void> {
    await this.api.delete<any>(`/students/${id}`);
  }
}

