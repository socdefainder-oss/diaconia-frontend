import api from '@/lib/api';
import { Progress, ApiResponse } from '@/types';

export const progressService = {
  async getCourseProgress(courseId: string): Promise<Progress> {
    const { data } = await api.get<ApiResponse<Progress>>(`/progress/${courseId}`);
    return data.data!;
  },

  async completeLesson(courseId: string, moduleId: string, lessonId: string): Promise<Progress> {
    const { data } = await api.post<ApiResponse<Progress>>(
      `/progress/${courseId}/modules/${moduleId}/lessons/${lessonId}/complete`
    );
    return data.data!;
  },

  async updateWatchTime(
    courseId: string,
    moduleId: string,
    lessonId: string,
    watchedDuration: number
  ): Promise<Progress> {
    const { data } = await api.post<ApiResponse<Progress>>(
      `/progress/${courseId}/modules/${moduleId}/lessons/${lessonId}/watch-time`,
      { watchedDuration }
    );
    return data.data!;
  },

  async checkLessonAccess(
    courseId: string,
    moduleId: string,
    lessonId: string
  ): Promise<{ unlocked: boolean }> {
    const { data } = await api.get<ApiResponse<{ unlocked: boolean }>>(
      `/progress/${courseId}/modules/${moduleId}/lessons/${lessonId}/access`
    );
    return data.data!;
  },
};
