import api from '@/lib/api';
import { User, PaginatedResponse, ApiResponse } from '@/types';

export const userService = {
  async getUsers(params?: { role?: string; search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<User>> {
    const { data } = await api.get<PaginatedResponse<User>>('/users', { params });
    return data;
  },

  async getUser(id: string): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
    return data.data!;
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const { data } = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    return data.data!;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async toggleUserStatus(id: string): Promise<User> {
    const { data } = await api.put<ApiResponse<User>>(`/users/${id}/toggle-status`);
    return data.data!;
  },

  async getDashboardStats(): Promise<any> {
    const { data } = await api.get<ApiResponse<any>>('/users/stats');
    return data.data!;
  },
};
