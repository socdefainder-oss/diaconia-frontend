'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Users, Edit, Trash2, Send } from 'lucide-react';
import { scheduleService } from '@/services/scheduleService';
import { Schedule } from '@/types';
import toast from 'react-hot-toast';
import { formatDate, formatDateTime } from '@/lib/utils';

export default function SchedulesPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const data = await scheduleService.getSchedules();
      setSchedules(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao carregar escalas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta escala?')) return;

    try {
      await scheduleService.deleteSchedule(id);
      toast.success('Escala excluída com sucesso!');
      loadSchedules();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao excluir escala');
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await scheduleService.confirmSchedule(id);
      toast.success('Presença confirmada!');
      loadSchedules();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao confirmar presença');
    }
  };

  const handleAutoGenerate = async () => {
    try {
      await scheduleService.autoGenerateSchedules();
      toast.success('Escalas geradas automaticamente!');
      loadSchedules();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao gerar escalas');
    }
  };

  const filteredSchedules = schedules.filter((schedule) => {
    if (filter === 'pending') return !schedule.isConfirmed;
    if (filter === 'confirmed') return schedule.isConfirmed;
    return true;
  });

  const sortedSchedules = [...filteredSchedules].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Escalas</h1>
          <p className="text-gray-600 mt-1">Gerenciar escalas de serviço</p>
        </div>
        {user?.role === 'admin' && (
          <div className="flex gap-2">
            <button onClick={handleAutoGenerate} className="btn-secondary flex items-center gap-2">
              <Send size={20} />
              Auto-gerar
            </button>
            <button
              onClick={() => router.push('/dashboard/schedules/new')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Nova Escala
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'confirmed'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Confirmadas
        </button>
      </div>

      {/* Schedules List */}
      {sortedSchedules.length === 0 ? (
        <div className="card text-center py-12">
          <CalendarIcon size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma escala encontrada</h3>
          <p className="text-gray-600">
            {user?.role === 'admin'
              ? 'Clique em "Nova Escala" ou "Auto-gerar" para criar escalas'
              : 'Aguarde novas escalas serem criadas'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedSchedules.map((schedule) => (
            <div
              key={schedule._id}
              className={`card hover:shadow-md transition-shadow ${
                schedule.isConfirmed ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{schedule.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{schedule.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    schedule.isConfirmed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {schedule.isConfirmed ? 'Confirmada' : 'Pendente'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon size={16} />
                  <span>{formatDate(schedule.date)}</span>
                </div>
                {schedule.time && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>{schedule.time}</span>
                  </div>
                )}
                {schedule.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{schedule.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} />
                  <span>
                    {typeof schedule.assignedTo === 'object' && schedule.assignedTo?.name
                      ? schedule.assignedTo.name
                      : 'Não atribuído'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t flex gap-2">
                {user?.role === 'admin' ? (
                  <>
                    <button
                      onClick={() => router.push(`/dashboard/schedules/${schedule._id}/edit`)}
                      className="btn-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(schedule._id)}
                      className="btn-secondary text-red-600 hover:bg-red-50 flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    {!schedule.isConfirmed &&
                      typeof schedule.assignedTo === 'object' &&
                      schedule.assignedTo?._id === user?._id && (
                        <button
                          onClick={() => handleConfirm(schedule._id)}
                          className="btn-primary flex-1"
                        >
                          Confirmar Presença
                        </button>
                      )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
