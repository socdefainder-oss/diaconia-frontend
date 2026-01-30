'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Tentando fazer login...');
      const response = await authService.login(email, password);
      console.log('Resposta do login:', response);
      
      if (!response || !response.token || !response.user) {
        console.error('Resposta inválida:', response);
        toast.error('Erro: resposta inválida do servidor');
        return;
      }
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      toast.success(`Bem-vindo, ${response.user.name}!`);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erro no login:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer login';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <span className="text-3xl">🙏</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Diaconia AD Alpha</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestão Ministerial</p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Entrar</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded mr-2" />
                <span className="text-gray-600">Lembrar-me</span>
              </label>
              <Link href="/forgot-password" className="text-primary-600 hover:text-primary-700">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Registre-se
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © 2026 Diaconia AD Alpha. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
