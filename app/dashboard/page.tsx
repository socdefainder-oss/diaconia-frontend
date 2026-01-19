'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Calendar, Bell, Users, TrendingUp, Activity } from 'lucide-react';
import { userService } from '@/services/userService';
import { courseService } from '@/services/courseService';
import { scheduleService } from '@/services/scheduleService';
import { announcementService } from '@/services/announcementService';
import { User } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (userData.role === 'admin') {
        const [userStats] = await Promise.all([
          userService.getDashboardStats(),
        ]);
        setStats(userStats);
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminCards = [
    { title: 'Total de Usuários', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-500' },
    { title: 'Admins', value: stats?.totalAdmins || 0, icon: Users, color: 'bg-purple-500' },
    { title: 'Alunos', value: stats?.totalStudents || 0, icon: Users, color: 'bg-green-500' },
    { title: 'Usuários Ativos', value: stats?.activeUsers || 0, icon: Activity, color: 'bg-teal-500' },
  ];

  const quickActions = [
    { title: 'Gerenciar Cursos', href: '/dashboard/courses', icon: BookOpen, description: 'Ver e editar cursos' },
    { title: 'Ver Escalas', href: '/dashboard/schedules', icon: Calendar, description: 'Gerenciar escalas' },
    { title: 'Avisos', href: '/dashboard/announcements', icon: Bell, description: 'Publicar avisos' },
    ...(user?.role === 'admin' ? [{ title: 'Usuários', href: '/dashboard/users', icon: Users, description: 'Gerenciar usuários' }] : []),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.role === 'admin' ? 'Painel Administrativo' : 'Seu painel pessoal'}
        </p>
      </div>

      {/* Stats Cards (Admin only) */}
      {user?.role === 'admin' && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  </div>
                  <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="card hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Atividade Recente</h2>
        <div className="card">
          <div className="text-center py-12 text-gray-500">
            <Activity size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhuma atividade recente</p>
          </div>
        </div>
      </div>
    </div>
  );
}
