import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface AttendanceItem {
  id?: number | string;
  studentId?: number | string;
  studentName?: string;
  classId?: number | string;
  date?: string;
  status?: string;
  remark?: string;
  [key: string]: any;
}

function extractArrayFromResponse(res: any): any[] {
  if (!res) return [];
  if (Array.isArray(res)) return res;

  const keys = ['data', 'content', 'items', 'result', 'list', 'attendances'];
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

  return [];
}

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  constructor(private api: ApiService) {}
  
  async getAttendances(): Promise<AttendanceItem[]> {
    const candidatePaths = ['/attendances', '/attendance', '/attendances/all', '/attendance/list'];
    for (const path of candidatePaths) {
      try {
        const res = await this.api.fetch<any>(path);
        const attendances = extractArrayFromResponse(res);
        if (attendances.length > 0) {
          return attendances;
        }
      } catch (error) {
        console.error(`Error fetching ${path}:`, error);
      }
    }
    return [];
  }
}
