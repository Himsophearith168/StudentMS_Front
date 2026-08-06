import { Injectable, Service } from '@angular/core';
import { ApiService } from './api.service';


export interface SubjectItem {
    id?: number | string;
    subjectName?: string;
    subjectDescription?: string;
    semester?: string;
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
export class SubjectService {
    constructor(private api: ApiService) {}
    async getSubjects(): Promise<SubjectItem[]> {
        const candidatePaths = ['/subjects', '/subject', '/subjects/all', '/subject/all', '/subjects/list'];
        for (const path of candidatePaths) {
            try {
                const res = await this.api.fetch<any>(path);
                console.log(`Fetched ${path} response:`, res);
                const subjects = extractArrayFromResponse(res);
                if (subjects.length > 0) {
                    return subjects;
                }
            } catch (error) {
                console.error(`Error fetching ${path}:`, error);
            }
        }
        return [];
    }

    async getSubjectById(id: string | number): Promise<SubjectItem> {
       const res = await this.api.fetch<any>(`/subjects/${id}`);
        if (res && typeof res === 'object') {
            return res && res.data !== undefined ? res.data : res;
        }
        throw new Error(`Subject with id ${id} not found`);
    }

    async createSubject(payload: SubjectItem): Promise<SubjectItem> {
        const res = await this.api.post<any>('/subjects', payload);
        if (res && typeof res === 'object') {
            return res && res.data !== undefined ? res.data : res;
        }
        throw new Error('Failed to create subject');
    }

    async updateSubject(id: string | number, payload: SubjectItem): Promise<SubjectItem> {
        const res = await this.api.put<any>(`/subjects/${id}`, payload);
        if (res && typeof res === 'object') {
            return res && res.data !== undefined ? res.data : res;
        }
        throw new Error(`Failed to update subject with id ${id}`);
    }

    async deleteSubject(id: string | number): Promise<void> {
        await this.api.delete<any>(`/subjects/${id}`);
        throw new Error(`Failed to delete subject with id ${id}`);
    }
}
