import api from '@/lib/api';
import { User, PaginatedResponse, ApiResponse } from '@/types';

export const userService = {
  async getUsers(params?: { role?: string; search?: string; page?: number; limit?: number }): Promise<User[]> {
    const { data } = await api.get<ApiResponse<User[]>>('/users', { params });
    return data.data || [];
  },

  async getUser(id: string): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
    return data.data!;
  },

  async createUser(userData: Partial<User>): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>('/users', userData);
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

  async resetPassword(id: string, newPassword: string): Promise<void> {
    await api.put(`/users/${id}/reset-password`, { password: newPassword });
  },

  async getDashboardStats(): Promise<any> {
    const { data } = await api.get<ApiResponse<any>>('/users/stats');
    return data.data!;
  },
};
