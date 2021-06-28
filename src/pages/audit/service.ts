import { request } from 'umi';

export class AuditService {
  async all() {
    return request(`/api/audit`)
  }
  async fetch(id: number) {
    return request(`/api/audit`)
  }
}

export class AuditStreamService {
  async fetch(id: number) {
    return request(`/api/audit/${id}/stream`);
  }
}