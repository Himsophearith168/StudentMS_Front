import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface PermissionItem {
  id?: number | string;
  studentId?: number;
  studentName?: string;
  studentCode?: string;
  reason?: string;
  startDate?: string;
  endDate?: string;
  numberOfDays?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  approvedBy?: string;
  approvedDate?: string;
  remark?: string;
  createdAt?: string;
  [key: string]: any;
}


function extractArrayFromResponse(res: any): any[] {
  if (!res) return [];
  if (Array.isArray(res)) return res;

  const keys = ['data', 'content', 'permissions', 'items', 'result', 'list', 'body', 'response', 'payload'];
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
export class PermissionService {
  constructor(private api: ApiService) {}
  
  async getPermissions(): Promise<PermissionItem[]> {
    const candidatePaths = ['/permissions', '/permission', '/permissions/all', '/permission/all', '/permissions/list'];
    for (const path of candidatePaths) {
      try {
        const res = await this.api.fetch<any>(path);
        console.log(`Fetched ${path} response:`, res);
        const permissions = extractArrayFromResponse(res);
        if (permissions.length > 0) {
          return permissions;
        }
      } catch (error) {
        console.error(`Error fetching ${path}:`, error);
      }
    }
    return [];
  }

  
}

