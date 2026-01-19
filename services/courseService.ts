import api from '@/lib/api';
import { Course, PaginatedResponse, ApiResponse } from '@/types';

export const courseService = {
  async getCourses(page = 1, limit = 10): Promise<PaginatedResponse<Course>> {
    const { data } = await api.get<PaginatedResponse<Course>>('/courses', {
      params: { page, limit },
    });
    return data;
  },

  async getCourse(id: string): Promise<Course> {
    const { data } = await api.get<ApiResponse<{ course: Course }>>(`/courses/${id}`);
    return data.data!.course;
  },

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    const { data } = await api.post<ApiResponse<Course>>('/courses', courseData);
    return data.data!;
  },

  async updateCourse(id: string, courseData: Partial<Course>): Promise<Course> {
    const { data } = await api.put<ApiResponse<Course>>(`/courses/${id}`, courseData);
    return data.data!;
  },

  async deleteCourse(id: string): Promise<void> {
    await api.delete(`/courses/${id}`);
  },

  async enrollCourse(id: string): Promise<void> {
    await api.post(`/courses/${id}/enroll`);
  },

  async completeLesson(courseId: string, lessonIndex: number): Promise<void> {
    await api.post(`/courses/${courseId}/lessons/${lessonIndex}/complete`);
  },
};
