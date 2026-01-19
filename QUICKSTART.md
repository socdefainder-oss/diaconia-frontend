# 🚀 Guia Rápido de Deploy - Diaconia AD Alpha

Este guia resume os passos essenciais para colocar todo o sistema em produção.

## 📦 O que temos

- **Backend**: Node.js + Express + MongoDB (pronto)
- **Frontend**: Next.js 14 + Tailwind (pronto)

## 🎯 Passo a Passo Completo

### 1️⃣ Configurar MongoDB Atlas (5 minutos)

1. Acesse [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crie cluster gratuito (M0)
3. Crie usuário do banco:
   - Username: `diaconia_admin`
   - Password: (gere e anote)
4. Libere IP: `0.0.0.0/0` (permitir de qualquer lugar)
5. Copie string de conexão:
   ```
   mongodb+srv://diaconia_admin:SENHA@cluster0.xxxxx.mongodb.net/diaconia?retryWrites=true&w=majority
   ```

### 2️⃣ Configurar Cloudinary (3 minutos)

1. Acesse [cloudinary.com](https://cloudinary.com)
2. Crie conta gratuita
3. No Dashboard, anote:
   - Cloud Name
   - API Key
   - API Secret

### 3️⃣ Configurar Email Gmail (3 minutos)

1. Acesse [myaccount.google.com](https://myaccount.google.com)
2. Vá em Segurança → Verificação em duas etapas (ative)
3. Vá em Senhas de app → Gerar nova
4. Selecione "Correio" e gere senha de 16 dígitos

### 4️⃣ Deploy Backend no Render (10 minutos)

1. Acesse [render.com](https://render.com)
2. New → Web Service
3. Conecte repositório `diaconia-backend`
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance**: Free
5. **Environment Variables** (adicione todas):
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=sua-string-mongodb-completa
   JWT_SECRET=(gere: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   CLOUDINARY_CLOUD_NAME=seu-cloud-name
   CLOUDINARY_API_KEY=sua-api-key
   CLOUDINARY_API_SECRET=seu-api-secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=seu-email@gmail.com
   EMAIL_PASS=senha-de-app-16-digitos
   EMAIL_FROM="Diaconia AD Alpha" <seu-email@gmail.com>
   FRONTEND_URL=https://diaconia-frontend.vercel.app
   ```
6. Deploy e aguarde 3-5 minutos
7. **Anote a URL** (ex: `https://diaconia-backend.onrender.com`)

### 5️⃣ Deploy Frontend no Vercel (5 minutos)

1. Acesse [vercel.com](https://vercel.com)
2. New Project
3. Importar repositório `diaconia-frontend`
4. **Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL=https://diaconia-backend.onrender.com
   ```
   (use a URL do Render do passo anterior)
5. Deploy e aguarde 2-3 minutos
6. **Anote a URL** (ex: `https://diaconia-frontend.vercel.app`)

### 6️⃣ Atualizar CORS no Backend (2 minutos)

1. Volte ao Render → seu backend
2. Environment Variables
3. Atualize `FRONTEND_URL` com a URL do Vercel:
   ```
   FRONTEND_URL=https://diaconia-frontend.vercel.app
   ```
4. Save (vai fazer redeploy automático)

### 7️⃣ Testar Sistema (5 minutos)

1. Acesse a URL do frontend
2. Crie primeira conta (será admin por padrão)
3. Teste:
   - ✅ Login
   - ✅ Dashboard
   - ✅ Criar curso
   - ✅ Criar escala
   - ✅ Criar aviso
   - ✅ Gerenciar usuários

---

## 📋 Checklist Final

- [ ] MongoDB Atlas configurado
- [ ] Cloudinary configurado
- [ ] Gmail senha de app gerada
- [ ] Backend no Render (status "Live")
- [ ] Frontend no Vercel (site acessível)
- [ ] CORS atualizado no backend
- [ ] Login funcionando
- [ ] Dashboard carregando

---

## 🔗 Links Úteis

### Serviços Necessários
- MongoDB Atlas: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Render: [render.com](https://render.com)
- Vercel: [vercel.com](https://vercel.com)
- Cloudinary: [cloudinary.com](https://cloudinary.com)

### Documentação Completa
- Backend: `diaconia-backend/RENDER.md`
- Frontend: `diaconia-frontend/VERCEL.md`

---

## 🎯 Ordem de Deploy

**IMPORTANTE**: Faça nesta ordem:

1. ✅ MongoDB Atlas primeiro (backend precisa)
2. ✅ Backend no Render (obtenha URL)
3. ✅ Frontend no Vercel (use URL do backend)
4. ✅ Atualize CORS no backend (com URL do frontend)

---

## ⚠️ Problemas Comuns

### Backend não conecta ao MongoDB
- Verifique string de conexão (senha correta?)
- Confirme IP 0.0.0.0/0 liberado no Atlas

### Frontend retorna "Failed to fetch"
- `NEXT_PUBLIC_API_URL` configurado?
- Backend está "Live" no Render?
- CORS atualizado no backend?

### Backend "Sleep" (plano Free)
- Normal: acorda em 30-50s na primeira requisição
- Solução: configure cron job ou upgrade para pago

### Email não envia
- Senha de app correta? (16 dígitos sem espaços)
- Verificação em duas etapas ativada no Gmail?

---

## 🎨 Customização

### Alterar Cores (Frontend)
Edite `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    600: '#2563eb', // Azul padrão
  }
}
```

### Logo/Favicon
Adicione em `public/` e atualize `app/layout.tsx`

### Nome da Igreja
Busque "Diaconia AD Alpha" e substitua

---

## 💰 Custos

### Plano Free (Recomendado para Início)
- ✅ MongoDB Atlas: 512MB (M0)
- ✅ Render: 750h/mês
- ✅ Vercel: 100GB bandwidth
- ✅ Cloudinary: 25 créditos/mês
- **Total: R$ 0,00/mês**

### Plano Pago (Se Crescer)
- MongoDB Atlas M2: ~$9/mês
- Render Pro: $7/mês
- Vercel Pro: $20/mês
- **Total: ~$36/mês (~R$ 180)**

---

## 🎓 Próximos Passos

Após deploy bem-sucedido:

1. **Conteúdo Inicial**
   - Criar primeiro curso
   - Adicionar aulas
   - Fazer upload de materiais

2. **Convidar Membros**
   - Criar usuários manualmente (admin)
   - Ou deixar auto-registro aberto

3. **Configurar Escalas**
   - Definir tipos de serviço
   - Usar auto-geração
   - Testar notificações por email

4. **Comunicação**
   - Publicar primeiro aviso
   - Testar sistema de prioridades
   - Fixar avisos importantes

5. **Monitoramento**
   - Ativar Vercel Analytics
   - Verificar logs no Render
   - Acompanhar uso no MongoDB Atlas

---

## 📞 Suporte

- **Render**: [render.com/docs](https://render.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com/)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

---

## ✅ Sistema Pronto!

🎉 Parabéns! Seu sistema Diaconia AD Alpha está no ar e pronto para uso!

**URLs para salvar:**
- Frontend: `https://diaconia-frontend.vercel.app`
- Backend: `https://diaconia-backend.onrender.com`
- MongoDB: Dashboard do Atlas

**Credenciais para guardar:**
- Email admin
- Senhas de app
- API keys Cloudinary
- JWT Secret

---

**Desenvolvido com 🙏 para transformar a gestão da sua igreja**
