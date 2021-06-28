import { request } from 'umi';

export class GymService {
  async all() {
    return request(`/api/gym`)
  }
  async fetch(id: number) {
    return request(`/api/gym`)
  }
}

export class GymStreamService {
  async fetch(id: number) {
    return request(`/api/gym/${id}/stream`);
  }
}