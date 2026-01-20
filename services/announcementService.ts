import api from '@/lib/api';
import { Announcement, PaginatedResponse, ApiResponse } from '@/types';

export const announcementService = {
  async getAnnouncements(page = 1, limit = 10): Promise<Announcement[]> {
    const { data } = await api.get<ApiResponse<Announcement[]>>('/announcements', {
      params: { page, limit },
    });
    return data.data || [];
  },

  async createAnnouncement(announcementData: Partial<Announcement>): Promise<Announcement> {
    const { data } = await api.post<ApiResponse<Announcement>>('/announcements', announcementData);
    return data.data!;
  },

  async updateAnnouncement(id: string, announcementData: Partial<Announcement>): Promise<Announcement> {
    const { data } = await api.put<ApiResponse<Announcement>>(`/announcements/${id}`, announcementData);
    return data.data!;
  },

  async deleteAnnouncement(id: string): Promise<void> {
    await api.delete(`/announcements/${id}`);
  },

  async markAsViewed(id: string): Promise<void> {
    await api.put(`/announcements/${id}/view`);
  },
};
