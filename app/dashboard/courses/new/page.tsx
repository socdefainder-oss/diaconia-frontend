'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { courseService } from '@/services/courseService';
import toast from 'react-hot-toast';

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    duration: '',
    status: 'draft' as 'draft' | 'published',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('O título é obrigatório');
      return;
    }

    setLoading(true);

    try {
      await courseService.createCourse(formData);
      toast.success('Curso criado com sucesso!');
      router.push('/dashboard/courses');
    } catch (error: any) {
      console.error('Erro ao criar curso:', error);
      toast.error(error.response?.data?.message || 'Erro ao criar curso');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Curso</h1>
          <p className="text-gray-600 mt-1">Preencha os dados para criar um novo curso</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ex: Introdução à Bíblia"
          />
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Descreva o conteúdo do curso..."
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
            URL da Imagem de Capa
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
          {formData.thumbnail && (
            <div className="mt-3">
              <img
                src={formData.thumbnail}
                alt="Preview"
                className="w-full max-w-md h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Duração */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            Duração Estimada
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ex: 8 horas, 4 semanas, etc."
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary flex-1 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Criando...
              </>
            ) : (
              <>
                <Save size={20} />
                Criar Curso
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
