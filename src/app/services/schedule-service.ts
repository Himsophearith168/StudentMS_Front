import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface ScheduleItem {
  id?: number | string;
  day?: string;
  dayOfWeek?: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  subject?: string;
  subjectName?: string;
  teacher?: string;
  teacherName?: string;
  room?: string;
  [key: string]: any;
}

function extractArrayFromResponse(res: any): any[] {
  if (!res) return [];
  if (Array.isArray(res)) return res;

  const keys = ['data', 'content', 'items', 'result', 'list', 'schedules'];
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
export class ScheduleService {
  constructor(private api: ApiService) {}
  
  async getSchedules(): Promise<ScheduleItem[]> {
    const candidatePaths = ['/schedules', '/schedule', '/schedules/all', '/schedule/list'];
    for (const path of candidatePaths) {
      try {
        const res = await this.api.fetch<any>(path);
        const schedules = extractArrayFromResponse(res);
        if (schedules.length > 0) {
          return schedules;
        }
      } catch (error) {
        console.error(`Error fetching ${path}:`, error);
      }
    }
    return [];
  }
}
