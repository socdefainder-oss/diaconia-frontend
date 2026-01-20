'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';
import { courseService } from '@/services/courseService';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'iniciante' as 'iniciante' | 'intermediário' | 'avançado',
    thumbnail: '',
    lessons: [] as { title: string; description: string; videoUrl: string; duration: number; order: number }[],
  });

  useEffect(() => {
    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCourse = async () => {
    try {
      const course = await courseService.getCourse(params.id);
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        level: (course.level || 'iniciante') as any,
        thumbnail: course.thumbnail || '',
        lessons: (course.lessons || []).map(lesson => ({
          title: lesson.title,
          description: lesson.description || '',
          videoUrl: lesson.videoUrl || '',
          duration: lesson.duration || 0,
          order: lesson.order || 0,
        })),
      });
    } catch (error: any) {
      toast.error('Erro ao carregar curso');
      router.push('/dashboard/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const courseData = {
        ...formData,
        lessons: formData.lessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1,
        })),
      };
      
      await courseService.updateCourse(params.id, courseData);
      toast.success('Curso atualizado com sucesso!');
      router.push('/dashboard/courses');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar curso');
    } finally {
      setSaving(false);
    }
  };

  const addLesson = () => {
    setFormData({
      ...formData,
      lessons: [...formData.lessons, { title: '', description: '', videoUrl: '', duration: 0, order: formData.lessons.length + 1 }],
    });
  };

  const removeLesson = (index: number) => {
    setFormData({
      ...formData,
      lessons: formData.lessons.filter((_, i) => i !== index),
    });
  };

  const updateLesson = (index: number, field: string, value: any) => {
    const updatedLessons = [...formData.lessons];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setFormData({ ...formData, lessons: updatedLessons });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/courses" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft size={20} />
          Voltar
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar Curso</h1>
        <p className="text-gray-600 mt-1">Atualize as informações do curso</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
          
          <div className="space-y-4">
            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem de Capa
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="input flex-1"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <button type="button" className="btn-secondary">
                  <Upload size={18} />
                </button>
              </div>
              {formData.thumbnail && (
                <img src={formData.thumbnail} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título do Curso *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                placeholder="Ex: Treinamento de Diáconos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                placeholder="Descreva o conteúdo do curso..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input"
                  placeholder="Ex: Teologia, Liturgia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nível *
                </label>
                <select
                  required
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                  className="input"
                >
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediário">Intermediário</option>
                  <option value="avançado">Avançado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Aulas */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Aulas</h2>
            <button
              type="button"
              onClick={addLesson}
              className="btn-secondary flex items-center gap-2"
            >
              <Plus size={18} />
              Adicionar Aula
            </button>
          </div>

          {formData.lessons.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhuma aula adicionada. Clique em &quot;Adicionar Aula&quot; para começar.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.lessons.map((lesson, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Aula {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeLesson(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      required
                      value={lesson.title}
                      onChange={(e) => updateLesson(index, 'title', e.target.value)}
                      className="input"
                      placeholder="Título da aula"
                    />

                    <textarea
                      required
                      rows={2}
                      value={lesson.description}
                      onChange={(e) => updateLesson(index, 'description', e.target.value)}
                      className="input"
                      placeholder="Descrição da aula"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="url"
                        value={lesson.videoUrl}
                        onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
                        className="input"
                        placeholder="URL do vídeo (YouTube, Vimeo)"
                      />

                      <input
                        type="number"
                        required
                        min="1"
                        value={lesson.duration}
                        onChange={(e) => updateLesson(index, 'duration', Number(e.target.value))}
                        className="input"
                        placeholder="Duração (minutos)"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex-1"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <Link href="/dashboard/courses" className="btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
