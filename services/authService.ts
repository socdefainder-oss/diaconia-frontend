import api from '@/lib/api';
import { User, ApiResponse } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const { data } = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      email,
      password,
    });
    return data.data!;
  },

  async register(name: string, email: string, password: string, phone?: string): Promise<{ user: User; token: string }> {
    const { data } = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', {
      name,
      email,
      password,
      phone,
    });
    return data.data!;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data.data!;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const { data } = await api.put<ApiResponse<User>>('/auth/profile', userData);
    return data.data!;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/change-password', { currentPassword, newPassword });
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },
};
