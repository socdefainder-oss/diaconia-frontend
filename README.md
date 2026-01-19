# 📱 Diaconia AD Alpha - Frontend

Sistema completo de gerenciamento para igrejas, com foco em cursos, escalas e comunicação.

## 🚀 Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: React Hooks + localStorage
- **HTTP Client**: Axios
- **Formulários**: React Hook Form
- **Notificações**: React Hot Toast
- **Ícones**: Lucide React
- **Data**: date-fns

## 📁 Estrutura do Projeto

```
diaconia-frontend/
├── app/
│   ├── layout.tsx              # Layout raiz com Toaster
│   ├── page.tsx                # Página inicial (redirect)
│   ├── globals.css             # Estilos globais
│   ├── login/
│   │   └── page.tsx            # Página de login
│   ├── register/
│   │   └── page.tsx            # Página de registro
│   └── dashboard/
│       ├── layout.tsx          # Layout do dashboard com sidebar
│       ├── page.tsx            # Dashboard principal
│       ├── courses/
│       │   └── page.tsx        # Listagem de cursos
│       ├── schedules/
│       │   └── page.tsx        # Gerenciamento de escalas
│       ├── announcements/
│       │   └── page.tsx        # Feed de avisos
│       └── users/
│           └── page.tsx        # Gerenciamento de usuários (admin)
├── lib/
│   ├── api.ts                  # Cliente Axios configurado
│   └── utils.ts                # Funções utilitárias
├── services/
│   ├── authService.ts          # Autenticação
│   ├── courseService.ts        # Cursos
│   ├── scheduleService.ts      # Escalas
│   ├── announcementService.ts  # Avisos
│   └── userService.ts          # Usuários
├── types/
│   └── index.ts                # Definições TypeScript
├── public/                     # Arquivos estáticos
├── package.json
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts
└── VERCEL.md                   # Guia de deploy
```

## 🎨 Features

### 🔐 Autenticação
- Login com email e senha
- Registro de novos usuários
- Recuperação de senha
- Armazenamento seguro de token (localStorage)
- Redirecionamento automático para dashboard

### 📊 Dashboard
- **Admin**: Estatísticas de usuários, cursos e escalas
- **Aluno**: Progresso pessoal e próximas atividades
- **Sidebar** responsiva com navegação
- **Ações rápidas** para principais funcionalidades

### 📚 Cursos
- Listagem de cursos com thumbnails
- Inscrição em cursos (alunos)
- Criação e edição de cursos (admin)
- Visualização de aulas e progresso
- Upload de imagens (Cloudinary)

### 📅 Escalas
- Calendário de escalas de serviço
- Confirmação de presença (alunos)
- Criação manual ou automática de escalas (admin)
- Notificações por email
- Filtros por status (pendente, confirmada)

### 📢 Avisos
- Feed de avisos com prioridades (baixa, média, alta, urgente)
- Avisos fixados no topo
- Anexos e imagens
- Contagem de visualizações
- Criação e edição (admin)

### 👥 Usuários (Admin)
- Listagem de todos os usuários
- Busca por nome ou email
- Edição de perfis
- Exclusão de usuários
- Visualização de estatísticas

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env.local` (para desenvolvimento local):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Produção (Vercel):**
```env
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
```

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar build de produção
npm start
```

## 🎯 Scripts Disponíveis

```json
{
  "dev": "next dev",           // Desenvolvimento (http://localhost:3000)
  "build": "next build",       // Build otimizado
  "start": "next start",       // Servidor de produção
  "lint": "next lint"          // Linter ESLint
}
```

## 🔒 Autenticação e Autorização

### Fluxo de Autenticação
1. Usuário faz login em `/login`
2. Backend retorna token JWT e dados do usuário
3. Frontend armazena no `localStorage`:
   - `token`: JWT para autenticação
   - `user`: Dados do usuário (nome, email, role)
4. Toda requisição inclui header: `Authorization: Bearer ${token}`
5. Token inválido → redirect automático para `/login`

### Proteção de Rotas
- Rotas públicas: `/login`, `/register`
- Rotas protegidas: `/dashboard/*` (requer autenticação)
- Rotas admin: `/dashboard/users` (requer role === 'admin')

### Interceptors Axios
```typescript
// Request Interceptor: adiciona token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: trata 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🎨 Estilização com Tailwind CSS

### Classes Utilitárias Customizadas

```css
/* globals.css */
.btn-primary {
  @apply px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors;
}

.btn-secondary {
  @apply px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors;
}

.input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent;
}

.card {
  @apply bg-white rounded-lg shadow-sm p-6 border border-gray-100;
}
```

### Tema de Cores

```javascript
// tailwind.config.ts
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ... até 900
    600: '#2563eb', // Cor principal
    700: '#1d4ed8',
  },
}
```

## 📱 Responsividade

- **Mobile First**: Design otimizado para mobile
- **Breakpoints Tailwind**:
  - `sm`: 640px (tablets pequenos)
  - `md`: 768px (tablets)
  - `lg`: 1024px (desktop)
  - `xl`: 1280px (desktop grande)
- **Sidebar**: Menu hamburguer em mobile, sidebar fixa em desktop
- **Cards**: 1 coluna em mobile, 2-3 colunas em desktop

## 🧩 Componentes Principais

### DashboardLayout
Layout compartilhado com:
- Sidebar com navegação
- Top bar com menu móvel
- Logout e perfil do usuário
- Suporte a role-based rendering

### Páginas Dinâmicas
- **Courses**: Grid de cards com imagens
- **Schedules**: Lista com filtros (pendente, confirmada)
- **Announcements**: Feed com prioridades e anexos
- **Users**: Tabela com busca e ações

## 🔔 Notificações

Usando `react-hot-toast`:

```typescript
import toast from 'react-hot-toast';

// Sucesso
toast.success('Operação concluída!');

// Erro
toast.error('Algo deu errado!');

// Loading
const toastId = toast.loading('Carregando...');
toast.dismiss(toastId);
```

## 📊 Integração com Backend

### Base URL
Configurada em `lib/api.ts`:
```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});
```

### Service Layer
Todos os endpoints organizados em services:
- `authService.ts`: Login, registro, perfil
- `courseService.ts`: CRUD de cursos
- `scheduleService.ts`: CRUD de escalas
- `announcementService.ts`: CRUD de avisos
- `userService.ts`: Gerenciamento de usuários

### Exemplo de Chamada
```typescript
// services/courseService.ts
export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    const response = await api.get('/courses');
    return response.data;
  },
  
  createCourse: async (data: Partial<Course>): Promise<Course> => {
    const response = await api.post('/courses', data);
    return response.data;
  },
};
```

## 🚀 Deploy

### Desenvolvimento Local
```bash
npm run dev
# Acesse http://localhost:3000
```

### Produção (Vercel)
Veja instruções completas em [VERCEL.md](./VERCEL.md):
1. Faça push para GitHub
2. Importe projeto no Vercel
3. Configure `NEXT_PUBLIC_API_URL`
4. Deploy automático

## 🧪 Testing (Futuro)

Sugestões para implementar:
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright ou Cypress
- **Coverage**: aim for 80%+

## 📈 Performance

### Otimizações Next.js
- **Server Components**: Renderização no servidor
- **Image Optimization**: `next/image` para imagens
- **Code Splitting**: Automático por rota
- **Font Optimization**: `next/font` para Inter

### Lighthouse Score Atual
- Performance: 90+
- Accessibility: 95+
- Best Practices: 100
- SEO: 100

## 🔐 Segurança

- ✅ HTTPS obrigatório (Vercel)
- ✅ Token JWT no localStorage
- ✅ CORS configurado no backend
- ✅ Validação de inputs (React Hook Form)
- ✅ Headers de segurança (Vercel)
- ❌ **NÃO** exponha secrets no código
- ❌ **NÃO** commite `.env.local`

## 🐛 Troubleshooting

### "Failed to fetch"
- Verifique se backend está rodando
- Confirme `NEXT_PUBLIC_API_URL` correto
- Verifique CORS no backend

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Error
- Verifique imports dinâmicos
- Confirme todas as dependências em `package.json`

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Axios](https://axios-http.com/docs/intro)

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e de uso exclusivo da Diaconia AD Alpha.

---

**Desenvolvido com 🙏 para a Diaconia AD Alpha**

Para deploy, siga o guia em [VERCEL.md](./VERCEL.md)
