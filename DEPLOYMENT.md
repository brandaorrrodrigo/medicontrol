# 🚀 Guia de Deploy - MedicControl

## 📋 Visão Geral

Este guia mostra como fazer o deploy do MedicControl em produção usando serviços gratuitos.

---

## 🗄️ PASSO 1: Banco de Dados (Supabase)

### 1.1 Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma nova organização
4. Crie um novo projeto:
   - Nome: `mediccontrol`
   - Database Password: (anote esta senha!)
   - Region: Escolha a mais próxima

### 1.2 Obter Connection String
1. Vá em `Settings` → `Database`
2. Em "Connection string" → copie a URI (modo `Transaction`)
3. Substitua `[YOUR-PASSWORD]` pela senha que você anotou

Exemplo:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

---

## 🔧 PASSO 2: Backend (Railway)

### 2.1 Criar Projeto
1. Acesse [railway.app](https://railway.app)
2. Login com GitHub
3. Clique em "New Project"
4. Escolha "Deploy from GitHub repo"
5. Selecione o repositório `MedicControl`
6. Escolha a pasta `backend`

### 2.2 Configurar Variáveis de Ambiente

Vá em `Variables` e adicione:

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-frontend.vercel.app

# Database (do Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# JWT Secrets (gere senhas fortes!)
JWT_SECRET=sua-senha-muito-segura-com-32-caracteres-ou-mais
JWT_REFRESH_SECRET=outra-senha-muito-segura-com-32-caracteres-ou-mais
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
EMAIL_FROM=noreply@mediccontrol.com

# Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# Rate Limit
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2.3 Configurar Build
Em `Settings` → `Build`:
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `npx prisma db push && npm start`

### 2.4 Obter URL do Backend
Após o deploy, copie a URL (ex: `https://mediccontrol-backend.up.railway.app`)

---

## 🎨 PASSO 3: Frontend (Vercel)

### 3.1 Criar Projeto
1. Acesse [vercel.com](https://vercel.com)
2. Login com GitHub
3. Clique em "Add New" → "Project"
4. Selecione o repositório `MedicControl`
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`

### 3.2 Configurar Variável de Ambiente

Em `Environment Variables`, adicione:

```env
NEXT_PUBLIC_API_URL=https://seu-backend.up.railway.app/api
```

### 3.3 Deploy
Clique em "Deploy" e aguarde!

---

## 🔐 PASSO 4: Configurar Email Gmail

### 4.1 Ativar 2FA no Gmail
1. Acesse [myaccount.google.com/security](https://myaccount.google.com/security)
2. Ative "Verificação em duas etapas"

### 4.2 Gerar Senha de App
1. Acesse [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Selecione "Email" e "Outro (nome personalizado)"
3. Digite "MedicControl"
4. Clique em "Gerar"
5. **Copie a senha de 16 dígitos** e use no `SMTP_PASS`

---

## ✅ PASSO 5: Testar

1. Acesse seu frontend: `https://seu-app.vercel.app`
2. Registre um novo usuário
3. Teste login
4. Teste recuperação de senha (verifique email)
5. Teste funcionalidades principais

---

## 🔄 PASSO 6: Atualizar Frontend com URL do Backend

No Railway, após obter a URL do backend:

1. Volte no Vercel
2. Vá em `Settings` → `Environment Variables`
3. Edite `NEXT_PUBLIC_API_URL` com a URL correta
4. Vá em `Deployments`
5. Clique nos "..." no último deploy
6. Clique em "Redeploy"

---

## 🎉 Pronto!

Seu MedicControl está em produção!

**URLs:**
- Frontend: `https://seu-app.vercel.app`
- Backend: `https://seu-backend.up.railway.app`
- Banco: Supabase (gerenciado)

---

## 🔧 Manutenção

### Logs
- **Frontend:** Vercel Dashboard → Functions → Logs
- **Backend:** Railway Dashboard → Deployments → View Logs

### Banco de Dados
- Acesse Supabase → Table Editor para ver dados
- Use SQL Editor para queries

### Atualizações
Qualquer push para `main` no GitHub fará deploy automático!

---

## 💰 Custos

- **Supabase:** Gratuito até 500MB database
- **Railway:** $5/mês de crédito grátis (~550h/mês)
- **Vercel:** Gratuito (ilimitado para hobbies)
- **Gmail SMTP:** Gratuito

**Total: GRATUITO** (com limites)

---

## 📊 Limites Gratuitos

- **Supabase:** 500MB DB, 2GB bandwidth
- **Railway:** $5/mês crédito, 500h execução
- **Vercel:** 100GB bandwidth, deploys ilimitados
- **Gmail:** 500 emails/dia

---

## 🚨 Troubleshooting

### "Cannot connect to database"
→ Verifique `DATABASE_URL` no Railway

### "CORS error"
→ Verifique `FRONTEND_URL` no Railway

### "Email not sending"
→ Verifique senha de app do Gmail

### "Prisma client not found"
→ Adicione `npx prisma generate` no build command

---

## 📞 Suporte

Problemas? Verifique os logs primeiro:
- Railway: Ver logs em tempo real
- Vercel: Functions → Logs
- Supabase: Logs → SQL statements
