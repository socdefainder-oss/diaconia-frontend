import api from '@/lib/api';
import { Team, ApiResponse } from '@/types';

export const teamService = {
  async getTeams(): Promise<Team[]> {
    const { data } = await api.get<ApiResponse<Team[]>>('/teams');
    return data.data || [];
  },

  async getTeam(id: string): Promise<Team> {
    const { data } = await api.get<ApiResponse<Team>>(`/teams/${id}`);
    return data.data!;
  },

  async createTeam(teamData: Partial<Team>): Promise<Team> {
    const { data } = await api.post<ApiResponse<Team>>('/teams', teamData);
    return data.data!;
  },

  async updateTeam(id: string, teamData: Partial<Team>): Promise<Team> {
    const { data } = await api.put<ApiResponse<Team>>(`/teams/${id}`, teamData);
    return data.data!;
  },

  async deleteTeam(id: string): Promise<void> {
    await api.delete(`/teams/${id}`);
  },

  async addMember(teamId: string, userId: string): Promise<Team> {
    const { data } = await api.post<ApiResponse<Team>>(`/teams/${teamId}/members`, { userId });
    return data.data!;
  },

  async removeMember(teamId: string, userId: string): Promise<Team> {
    const { data } = await api.delete<ApiResponse<Team>>(`/teams/${teamId}/members/${userId}`);
    return data.data!;
  },
};
