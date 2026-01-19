'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, BookOpen, Users, Clock, Edit, Trash2, Eye } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { Course } from '@/types';
import toast from 'react-hot-toast';

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;

    try {
      await courseService.deleteCourse(id);
      toast.success('Curso excluído com sucesso!');
      loadCourses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao excluir curso');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      await courseService.toggleStatus(id, newStatus);
      toast.success(newStatus === 'published' ? 'Curso publicado!' : 'Curso despublicado!');
      loadCourses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao alterar status');
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await courseService.enrollCourse(courseId);
      toast.success('Inscrição realizada com sucesso!');
      loadCourses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao se inscrever');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'admin' ? 'Gerenciar cursos da plataforma' : 'Navegue pelos cursos disponíveis'}
          </p>
        </div>
        {user?.role === 'admin' && (
          <Link href="/dashboard/courses/new" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Novo Curso
          </Link>
        )}
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum curso disponível</h3>
          <p className="text-gray-600">
            {user?.role === 'admin'
              ? 'Clique em "Novo Curso" para criar o primeiro curso'
              : 'Aguarde novos cursos serem adicionados'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="card hover:shadow-lg transition-shadow">
              {/* Thumbnail */}
              {course.thumbnail && (
                <img src={course.thumbnail} alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg -mx-6 -mt-6 mb-4"
                />
              )}

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{course.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <BookOpen size={16} />
                    <span>{course.lessons?.length || 0} aulas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{course.duration}</span>
                  </div>
                  {course.enrolledCount !== undefined && (
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{course.enrolledCount}</span>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleToggleStatus(course._id, course.status || 'draft')}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {course.status === 'published' ? 'Despublicar' : 'Publicar'}
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 flex gap-2">
                  {user?.role === 'admin' ? (
                    <>
                      <Link
                        href={`/dashboard/courses/${course._id}`}
                        className="btn-secondary flex-1 flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        Ver
                      </Link>
                      <Link
                        href={`/dashboard/courses/${course._id}/edit`}
                        className="btn-secondary flex items-center justify-center gap-2"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="btn-secondary text-red-600 hover:bg-red-50 flex items-center justify-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/dashboard/courses/${course._id}`}
                        className="btn-secondary flex-1 flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        Ver Curso
                      </Link>
                      {course.isActive && (
                        <button
                          onClick={() => handleEnroll(course._id)}
                          className="btn-primary flex-1"
                        >
                          Inscrever-se
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

