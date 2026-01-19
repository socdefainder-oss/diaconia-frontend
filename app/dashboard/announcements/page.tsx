'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Plus, Edit, Trash2, Pin, Eye } from 'lucide-react';
import { announcementService } from '@/services/announcementService';
import { Announcement } from '@/types';
import toast from 'react-hot-toast';
import { formatDateTime } from '@/lib/utils';

export default function AnnouncementsPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao carregar avisos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este aviso?')) return;

    try {
      await announcementService.deleteAnnouncement(id);
      toast.success('Aviso excluído com sucesso!');
      loadAnnouncements();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao excluir aviso');
    }
  };

  const handleMarkAsViewed = async (id: string) => {
    try {
      await announcementService.markAsViewed(id);
      loadAnnouncements();
    } catch (error: any) {
      console.error('Erro ao marcar como visualizado:', error);
    }
  };

  const priorityColors = {
    baixa: 'bg-gray-100 text-gray-800',
    media: 'bg-blue-100 text-blue-800',
    alta: 'bg-orange-100 text-orange-800',
    urgente: 'bg-red-100 text-red-800',
  };

  // Sort: pinned first, then by createdAt desc
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Avisos</h1>
          <p className="text-gray-600 mt-1">Comunicados e informações importantes</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => router.push('/dashboard/announcements/new')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Aviso
          </button>
        )}
      </div>

      {/* Announcements List */}
      {sortedAnnouncements.length === 0 ? (
        <div className="card text-center py-12">
          <Bell size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum aviso disponível</h3>
          <p className="text-gray-600">
            {user?.role === 'admin'
              ? 'Clique em "Novo Aviso" para criar o primeiro aviso'
              : 'Não há avisos no momento'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedAnnouncements.map((announcement) => (
            <div
              key={announcement._id}
              className={`card hover:shadow-md transition-shadow ${
                announcement.isPinned ? 'border-l-4 border-primary-600 bg-primary-50/30' : ''
              }`}
              onClick={() => user?.role !== 'admin' && handleMarkAsViewed(announcement._id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {announcement.isPinned && (
                      <Pin size={16} className="text-primary-600" />
                    )}
                    <h3 className="text-xl font-bold text-gray-900">{announcement.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>
                      Por{' '}
                      {typeof announcement.author === 'object'
                        ? announcement.author.name
                        : 'Admin'}
                    </span>
                    <span>•</span>
                    <span>{formatDateTime(announcement.createdAt)}</span>
                    {announcement.viewsCount !== undefined && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{announcement.viewsCount} visualizações</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    priorityColors[announcement.priority]
                  }`}
                >
                  {announcement.priority}
                </span>
              </div>

              <p className="text-gray-700 whitespace-pre-wrap mb-4">{announcement.content}</p>

              {announcement.attachments && announcement.attachments.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Anexos:</p>
                  <div className="flex flex-wrap gap-2">
                    {announcement.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                      >
                        📎 Anexo {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Actions */}
              {user?.role === 'admin' && (
                <div className="pt-4 border-t flex gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/announcements/${announcement._id}/edit`)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="btn-secondary text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
