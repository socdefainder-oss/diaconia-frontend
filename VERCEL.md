# 🚀 Deploy do Frontend no Vercel

Este guia fornece instruções passo a passo para fazer deploy do frontend Diaconia AD Alpha no Vercel.

## 📋 Pré-requisitos

1. Conta no [Vercel](https://vercel.com) (gratuita)
2. Backend já implantado no Render (URL anotada)
3. Repositório Git do frontend (diaconia-frontend)

---

## 🌐 Passo 1: Preparar Repositório

### 1.1 Verificar Estrutura
Certifique-se de que seu repositório contém:
```
diaconia-frontend/
├── app/
├── components/
├── lib/
├── services/
├── types/
├── public/
├── package.json
├── next.config.mjs
├── tsconfig.json
└── tailwind.config.ts
```

### 1.2 Commit e Push
Certifique-se de que todas as alterações estão no GitHub:
```bash
cd diaconia-frontend
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## 🔧 Passo 2: Deploy no Vercel

### 2.1 Importar Projeto
1. Acesse [Vercel](https://vercel.com)
2. Clique em **"Add New..."** → **"Project"**
3. Clique em **"Import Git Repository"**
4. Autorize o Vercel a acessar seu GitHub (se ainda não fez)
5. Selecione o repositório `diaconia-frontend`

### 2.2 Configurar Projeto
Na página de configuração:

**Project Settings:**
- **Project Name**: `diaconia-frontend` (ou outro nome)
- **Framework Preset**: `Next.js` (detectado automaticamente)
- **Root Directory**: `./` (deixe padrão)

**Build and Output Settings:**
- **Build Command**: 
  ```
  npm run build
  ```
  (Vercel detecta automaticamente)
  
- **Output Directory**: 
  ```
  .next
  ```
  (Vercel detecta automaticamente)

- **Install Command**: 
  ```
  npm install
  ```
  (Vercel detecta automaticamente)

### 2.3 Adicionar Variáveis de Ambiente
Em **"Environment Variables"**, adicione:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://seu-backend.onrender.com` |

**Importante**: 
- Substitua `seu-backend.onrender.com` pela URL real do seu backend no Render
- **NÃO** adicione barra `/` no final
- Exemplo: `https://diaconia-backend.onrender.com`

### 2.4 Deploy
1. Clique em **"Deploy"**
2. O Vercel começará automaticamente:
   - Clone do repositório
   - Instalação de dependências
   - Build do Next.js
   - Deploy para CDN global
3. Aguarde 1-3 minutos

### 2.5 Verificar Deploy
1. Quando aparecer **"Congratulations!"**, seu frontend está no ar! 🎉
2. Clique em **"Visit"** ou copie a URL fornecida
3. URL padrão: `https://diaconia-frontend.vercel.app`

---

## 🔗 Passo 3: Atualizar Backend com URL do Frontend

### 3.1 Atualizar CORS no Render
1. Acesse seu backend no [Render Dashboard](https://dashboard.render.com)
2. Vá em **"Environment"**
3. Encontre a variável `FRONTEND_URL`
4. Atualize para a URL do Vercel:
   ```
   https://diaconia-frontend.vercel.app
   ```
5. Clique em **"Save Changes"**
6. O backend fará redeploy automaticamente (1-2 minutos)

---

## 🎨 Passo 4: Custom Domain (Opcional)

### 4.1 Adicionar Domínio Próprio
1. No projeto Vercel, vá em **"Settings"** → **"Domains"**
2. Clique em **"Add"**
3. Digite seu domínio (ex: `diaconia.com.br`)
4. Siga as instruções para configurar DNS

### 4.2 Configurar DNS
Adicione os seguintes registros no seu provedor de domínio:

**Para domínio raiz (diaconia.com.br):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Para subdomain (www.diaconia.com.br):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4.3 Atualizar Backend
Após configurar domínio customizado, atualize `FRONTEND_URL` no Render:
```
https://diaconia.com.br
```

---

## 📊 Passo 5: Monitoramento e Analytics

### 5.1 Vercel Analytics (Opcional)
1. No projeto, vá em **"Analytics"**
2. Clique em **"Enable Analytics"**
3. Gratuito até 100k eventos/mês

### 5.2 Speed Insights (Opcional)
1. No projeto, vá em **"Speed Insights"**
2. Clique em **"Enable Speed Insights"**
3. Monitora performance em tempo real

---

## 🔄 Passo 6: Auto-Deploy e CI/CD

### 6.1 Auto-Deploy Configurado
O Vercel automaticamente faz deploy quando você fizer push:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

### 6.2 Preview Deployments
Para cada Pull Request, o Vercel cria um deploy de preview:
- URL única para testar antes de merge
- Útil para revisão de código

### 6.3 Environments
O Vercel suporta múltiplos ambientes:
- **Production**: branch `main`
- **Preview**: outras branches e PRs
- **Development**: ambiente local

---

## ⚙️ Passo 7: Configurações Avançadas

### 7.1 Ajustar Configurações de Build
Se necessário, edite `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Para otimizar tamanho
  images: {
    domains: ['res.cloudinary.com'], // Para imagens do Cloudinary
  },
};

export default nextConfig;
```

### 7.2 Redirect e Rewrite Rules
Crie `vercel.json` na raiz (se necessário):
```json
{
  "redirects": [
    {
      "source": "/",
      "destination": "/dashboard",
      "permanent": false
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

---

## ⚠️ Limitações do Plano Free

### Hobby (Free)
- ✅ 100GB bandwidth/mês
- ✅ Unlimited sites
- ✅ Preview deployments
- ✅ HTTPS automático
- ✅ Edge Network global
- ❌ Sem suporte comercial
- ❌ Sem password protection

### Pro ($20/mês)
- Tudo do Free +
- 1TB bandwidth
- Password protection
- Analytics avançado
- Suporte prioritário

---

## 📝 Checklist Final

- [ ] Repositório no GitHub atualizado
- [ ] Projeto importado no Vercel
- [ ] Variável `NEXT_PUBLIC_API_URL` configurada
- [ ] Deploy bem-sucedido
- [ ] Site acessível na URL fornecida
- [ ] Backend atualizado com `FRONTEND_URL` correto
- [ ] Login funcionando (testar credenciais)
- [ ] Navegação entre páginas funcionando
- [ ] Imagens carregando do Cloudinary (se houver)

---

## 🧪 Passo 8: Testar Aplicação

### 8.1 Testes Básicos
1. Acesse a URL do frontend
2. Tente fazer login com credenciais de teste
3. Navegue pelas páginas do dashboard
4. Teste criação de curso (se admin)
5. Teste confirmação de escala
6. Verifique avisos

### 8.2 Testes de Performance
1. Abra DevTools (F12)
2. Vá em **Network** → recarregue página
3. Verifique tempo de carregamento (deve ser < 3s)
4. Use **Lighthouse** para análise completa

### 8.3 Testes Mobile
1. Abra site no celular
2. Teste menu lateral (hamburguer)
3. Verifique responsividade
4. Teste formulários e botões

---

## 🐛 Troubleshooting

### Erro: "Application Error"
- Verifique logs no Vercel: **"Deployments"** → clique no deploy → **"View Function Logs"**
- Comum: variável de ambiente faltando

### Erro: "Failed to fetch" ao fazer login
- Verifique `NEXT_PUBLIC_API_URL` no Vercel
- Certifique-se de que backend está rodando no Render
- Verifique `FRONTEND_URL` no backend (CORS)

### Erro: "Module not found"
- Execute `npm install` localmente
- Commit `package-lock.json`
- Faça push e Vercel irá rebuildar

### Build Timeout
- Plano Free tem timeout de 45 minutos
- Verifique se há dependências desnecessárias
- Considere otimizar imports dinâmicos

### Imagens não carregam
- Adicione domínio Cloudinary em `next.config.mjs`:
  ```javascript
  images: {
    domains: ['res.cloudinary.com'],
  }
  ```

---

## 🔐 Passo 9: Segurança (Recomendações)

### 9.1 Environment Variables
- **NUNCA** commite secrets no código
- Use apenas `NEXT_PUBLIC_*` para variáveis expostas ao browser
- Secrets do backend ficam apenas no Render

### 9.2 HTTPS
- Vercel fornece HTTPS automático (Let's Encrypt)
- Sempre use `https://` nas URLs

### 9.3 Headers de Segurança
Já configurados no exemplo `vercel.json` acima:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`

---

## 📞 Suporte

- [Documentação Vercel](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

## ✅ Próximos Passos

Após concluir o deploy:
1. ✅ Backend no Render funcionando
2. ✅ Frontend no Vercel funcionando
3. ✅ Integração entre backend e frontend testada
4. 🎯 Criar primeiro usuário admin
5. 🎯 Adicionar cursos e conteúdos
6. 🎯 Convidar membros da igreja
7. 🎯 Começar a usar! 🙏

---

## 🎉 Comandos Úteis

### Forçar Redeploy
```bash
# Na pasta do projeto
git commit --allow-empty -m "Force redeploy"
git push origin main
```

### Ver Logs Localmente
```bash
npm run dev
# Acesse http://localhost:3000
```

### Build Local (teste antes de deploy)
```bash
npm run build
npm start
```

---

## 📊 Monitorar Performance

### Vercel Dashboard
- Acesse métricas em tempo real
- Veja tempo de build
- Monitore erros e logs

### Lighthouse Score
Objetivo para produção:
- ✅ Performance: 90+
- ✅ Accessibility: 90+
- ✅ Best Practices: 90+
- ✅ SEO: 90+

---

🎉 **Frontend pronto para produção no Vercel!**

Agora sua aplicação está completa e rodando em produção. Parabéns! 🙏
