import api from '@/lib/api';
import { ApiResponse } from '@/types';

interface CertificateData {
  certificateUrl: string;
  studentName: string;
  courseName: string;
  completedAt: string;
  certificateId: string;
}

interface CertificateVerification {
  studentName: string;
  studentEmail: string;
  courseName: string;
  courseCategory: string;
  completedAt: string;
  certificateId: string;
  valid: boolean;
}

export const certificateService = {
  async generateCertificate(courseId: string): Promise<CertificateData> {
    const { data } = await api.post<ApiResponse<CertificateData>>(
      `/certificates/${courseId}/generate`
    );
    return data.data!;
  },

  async verifyCertificate(certificateId: string): Promise<CertificateVerification> {
    const { data } = await api.get<ApiResponse<CertificateVerification>>(
      `/certificates/verify/${certificateId}`
    );
    return data.data!;
  },
};
