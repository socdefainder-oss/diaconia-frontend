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

export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructor: User | string;
  category: string;
  isActive?: boolean;
  lessons?: Lesson[];
  enrolledStudents?: string[];
  enrolledCount?: number;
  duration: string;
  level?: 'iniciante' | 'intermediário' | 'avançado';
  createdAt: string;
}

export interface Lesson {
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  resources?: {
    name: string;
    url: string;
    type: string;
  }[];
}

export interface Schedule {
  _id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  function: string;
  assignedTo: User;
  substitute?: User;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdBy: User;
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

export interface Progress {
  _id: string;
  user: string;
  course: string;
  completedLessons: number[];
  progress: number;
  lastAccessedAt: string;
  completedAt?: string;
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
