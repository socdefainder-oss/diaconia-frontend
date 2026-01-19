import api from '@/lib/api';
import { Schedule, PaginatedResponse, ApiResponse } from '@/types';

export const scheduleService = {
  async getSchedules(params?: { startDate?: string; endDate?: string; page?: number; limit?: number }): Promise<Schedule[]> {
    const { data } = await api.get<Schedule[]>('/schedules', { params });
    return data;
  },

  async createSchedule(scheduleData: Partial<Schedule>): Promise<Schedule> {
    const { data } = await api.post<ApiResponse<Schedule>>('/schedules', scheduleData);
    return data.data!;
  },

  async updateSchedule(id: string, scheduleData: Partial<Schedule>): Promise<Schedule> {
    const { data } = await api.put<ApiResponse<Schedule>>(`/schedules/${id}`, scheduleData);
    return data.data!;
  },

  async deleteSchedule(id: string): Promise<void> {
    await api.delete(`/schedules/${id}`);
  },

  async confirmSchedule(id: string): Promise<void> {
    await api.put(`/schedules/${id}/confirm`);
  },

  async autoGenerateSchedules(params?: {
    startDate?: string;
    endDate?: string;
    functions?: string[];
    daysOfWeek?: number[];
    startTime?: string;
    endTime?: string;
  }): Promise<Schedule[]> {
    const { data } = await api.post<ApiResponse<Schedule[]>>('/schedules/auto-generate', params);
    return data.data!;
  },
};
