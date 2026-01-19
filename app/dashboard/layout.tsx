'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BookOpen, Calendar, Bell, Users, Settings, LogOut, Menu, X } from 'lucide-react';
import { User } from '@/types';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Navegação baseada no role
  const getNavigation = () => {
    if (user?.role === 'admin') {
      // Admin: acesso completo
      return [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Cursos', href: '/dashboard/courses', icon: BookOpen },
        { name: 'Escalas', href: '/dashboard/schedules', icon: Calendar },
        { name: 'Avisos', href: '/dashboard/announcements', icon: Bell },
        { name: 'Usuários', href: '/dashboard/users', icon: Users }
      ];
    } else {
      // Aluno: apenas cursos
      return [
        { name: 'Meus Cursos', href: '/dashboard/courses', icon: BookOpen }
      ];
    }
  };

  const navigation = getNavigation();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <span className="text-xl font-bold text-primary-600">🙏 Diaconia</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r bg-white">
        <div className="flex h-16 items-center px-6 border-b">
          <span className="text-xl font-bold text-primary-600">🙏 Diaconia AD Alpha</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role === 'admin' ? 'Administrador' : 'Aluno'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 flex h-16 bg-white border-b lg:border-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-gray-500 lg:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-1 justify-between items-center px-4 lg:px-8">
            <h1 className="text-xl font-semibold text-gray-900">
              {navigation.find(n => n.href === pathname)?.name || (user?.role === 'admin' ? 'Dashboard' : 'Meus Cursos')}
            </h1>
            <div className="flex items-center gap-4">
              {user?.role === 'admin' && (
                <Link href="/dashboard/settings" className="text-gray-600 hover:text-gray-900">
                  <Settings size={20} />
                </Link>
              )}
              <div className="lg:hidden w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
