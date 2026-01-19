import api from '@/lib/api';
import { ApiResponse } from '@/types';

interface UploadResponse {
  url: string;
  publicId: string;
  duration?: number;
  format?: string;
}

export const uploadService = {
  async uploadImage(file: File): Promise<UploadResponse> {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const { data } = await api.post<ApiResponse<UploadResponse>>('/upload/image', {
            file: reader.result,
          });
          resolve(data.data!);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  async uploadVideo(file: File): Promise<UploadResponse> {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const { data } = await api.post<ApiResponse<UploadResponse>>('/upload/video', {
            file: reader.result,
          });
          resolve(data.data!);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  async deleteFile(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<void> {
    await api.delete('/upload/file', {
      data: { publicId, resourceType },
    });
  },
};
