# ⚡ Quick Start - MedicControl

Guia rápido para rodar o projeto em **5 minutos**!

---

## 🎯 Opção 1: Desenvolvimento Local (Recomendado para testar)

### 1️⃣ Instalar PostgreSQL

**Windows:**
```bash
# Download e instale: https://www.postgresql.org/download/windows/
# Durante instalação, anote: usuário=postgres, senha=sua_senha
```

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2️⃣ Criar Banco de Dados

```bash
# Acesse o PostgreSQL
psql -U postgres

# Dentro do psql:
CREATE DATABASE mediccontrol;
\q
```

### 3️⃣ Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Criar arquivo .env
echo 'NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/mediccontrol?schema=public"
JWT_SECRET=meu-super-secret-jwt-para-desenvolvimento-local-123
JWT_REFRESH_SECRET=meu-super-secret-refresh-para-desenvolvimento-local-456
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100' > .env

# Gerar cliente Prisma e criar tabelas
npx prisma generate
npx prisma db push

# Iniciar servidor
npm run dev
```

✅ Backend rodando em `http://localhost:3001`

### 4️⃣ Configurar Frontend

```bash
# Em outro terminal
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env.local
echo 'NEXT_PUBLIC_API_URL=http://localhost:3001/api' > .env.local

# Iniciar app
npm run dev
```

✅ Frontend rodando em `http://localhost:3000`

### 5️⃣ Testar!

1. Abra `http://localhost:3000`
2. Clique em "Registrar"
3. Preencha os dados
4. Faça login
5. Explore o sistema! 🎉

---

## 🚀 Opção 2: Deploy Rápido (Grátis!)

### 1️⃣ Criar Banco (2 min)

1. Acesse [supabase.com](https://supabase.com)
2. Criar projeto → Anote a senha
3. Settings → Database → Copie Connection String
4. Substitua `[YOUR-PASSWORD]` pela senha

### 2️⃣ Deploy Backend (3 min)

1. Push código para GitHub
2. Acesse [railway.app](https://railway.app)
3. New Project → Deploy from GitHub
4. Selecione pasta `backend`
5. Variables → Cole as variáveis do `.env.production.example`
6. Aguarde deploy → Copie URL

### 3️⃣ Deploy Frontend (2 min)

1. Acesse [vercel.com](https://vercel.com)
2. Import Project → Selecione repositório
3. Root Directory: `frontend`
4. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.railway.app/api
   ```
5. Deploy!

### 4️⃣ Configurar Email (2 min)

1. [Gmail App Passwords](https://myaccount.google.com/apppasswords)
2. Gerar senha de app
3. Adicionar no Railway como `SMTP_PASS`

✅ **Pronto! Seu app está no ar!**

---

## 🔧 Comandos Úteis

### Backend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm start            # Rodar produção
npx prisma studio    # Visualizar banco (GUI)
npx prisma db push   # Aplicar mudanças no banco
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm start            # Rodar produção
npm run lint         # Verificar código
```

---

## 🐛 Problemas Comuns

### "Cannot connect to database"
→ Verifique se PostgreSQL está rodando
→ Confira `DATABASE_URL` no `.env`

### "Port 3000 already in use"
→ Mate o processo: `npx kill-port 3000`

### "Prisma Client not found"
→ Execute: `npx prisma generate`

### "CORS error"
→ Confira `FRONTEND_URL` no backend `.env`

---

## 📚 Próximos Passos

1. ✅ Rodar local → [Opção 1](#opção-1-desenvolvimento-local)
2. 🚀 Deploy produção → [DEPLOYMENT.md](./DEPLOYMENT.md)
3. 📖 Ler documentação → [README.md](./README.md)
4. 🧪 Testar funcionalidades
5. 🎨 Customizar conforme necessário

---

## 💡 Dicas

- Use `npx prisma studio` para visualizar dados
- Logs do backend aparecem no terminal
- Erros do frontend aparecem no console do navegador
- Para produção, **sempre** use senhas fortes para JWT!

---

**Dúvidas?** Abra uma issue no GitHub!

Bom desenvolvimento! 🚀
