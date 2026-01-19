export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'aluno';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Resource {
  name: string;
  url: string;
  type: 'pdf' | 'video' | 'link' | 'image' | 'document';
  size?: number;
}

export interface Lesson {
  _id?: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  videoDuration?: number; // segundos
  duration?: number; // mantido para compatibilidade
  order: number;
  resources?: Resource[];
  isPreview?: boolean;
}

export interface Module {
  _id?: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructor: User | string;
  category: string;
  status?: 'draft' | 'published' | 'archived';
  isActive?: boolean;
  modules?: Module[]; // NOVA estrutura hierárquica
  lessons?: Lesson[]; // Mantido para compatibilidade
  enrolledStudents?: string[];
  enrolledCount?: number;
  duration: string | number;
  totalLessons?: number;
  level?: 'iniciante' | 'intermediário' | 'avançado';
  certificateEnabled?: boolean;
  createdAt: string;
}

export interface Schedule {
  _id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  assignedTo: User | string;
  isConfirmed?: boolean;
  createdAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: User | string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  attachments?: string[];
  isActive: boolean;
  isPinned: boolean;
  viewedBy?: string[];
  viewsCount?: number;
  createdAt: string;
}

export interface LessonProgress {
  lessonId: string;
  moduleId: string;
  completed: boolean;
  completedAt?: string;
  watchedDuration: number;
}

export interface Progress {
  _id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  lastAccessedAt: string;
  completedLessons: LessonProgress[];
  progress: number; // 0-100
  completed: boolean;
  completedAt?: string;
  certificateIssued: boolean;
  certificateUrl?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
