# 🚀 Guia de Deploy - MedicControl

## Plano Gratuito Recomendado

| Componente | Plataforma | Custo | Limites |
|------------|-----------|-------|---------|
| **Frontend** | Vercel | Gratuito | Ilimitado para hobby |
| **Backend** | Render | Gratuito | 750h/mês, dorme após 15min |
| **Banco de Dados** | Supabase | Gratuito | 500MB, 2GB transfer |

---

## 📋 Checklist Pré-Deploy

- [ ] Código no GitHub (repositório público ou privado)
- [ ] Testes locais funcionando
- [ ] Variáveis de ambiente documentadas

---

## 1️⃣ Deploy do Banco de Dados (Supabase)

### Passo 1: Criar conta no Supabase
1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub

### Passo 2: Criar novo projeto
1. Clique em "New Project"
2. Preencha:
   - **Name**: mediccontrol
   - **Database Password**: (anote essa senha!)
   - **Region**: South America (São Paulo)
3. Clique em "Create new project"
4. Aguarde ~2 minutos

### Passo 3: Obter a Connection String
1. Na barra lateral, clique em "Project Settings" (ícone de engrenagem)
2. Vá em "Database"
3. Role até "Connection string"
4. Selecione "URI" e copie a connection string
5. Substitua `[YOUR-PASSWORD]` pela senha que você criou

Exemplo:
```
postgresql://postgres:[SUA-SENHA]@db.xxxxx.supabase.co:5432/postgres
```

### Passo 4: Aplicar migrations
No seu computador, atualize o `.env` do backend:

```env
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.xxxxx.supabase.co:5432/postgres"
```

Execute as migrations:
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

✅ Banco de dados pronto!

---

## 2️⃣ Deploy do Backend (Render)

### Passo 1: Preparar o repositório
Certifique-se de que seu código está no GitHub.

### Passo 2: Criar conta no Render
1. Acesse [https://render.com](https://render.com)
2. Clique em "Get Started"
3. Faça login com GitHub

### Passo 3: Criar Web Service
1. No dashboard, clique em "New +" → "Web Service"
2. Conecte seu repositório GitHub
3. Configure:
   - **Name**: mediccontrol-api
   - **Region**: Oregon (mais próximo gratuito)
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Passo 4: Adicionar variáveis de ambiente
Na seção "Environment Variables", adicione:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://postgres:[SUA-SENHA]@db.xxxxx.supabase.co:5432/postgres
JWT_SECRET=seu-segredo-super-forte-aqui-min-32-caracteres
JWT_REFRESH_SECRET=outro-segredo-diferente-aqui-min-32-caracteres
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://seu-site.vercel.app
```

⚠️ **IMPORTANTE**: Gere senhas fortes para JWT_SECRET e JWT_REFRESH_SECRET!

### Passo 5: Deploy
1. Clique em "Create Web Service"
2. Aguarde o build (~5 minutos)
3. Copie a URL do backend (ex: `https://mediccontrol-api.onrender.com`)

✅ Backend no ar!

---

## 3️⃣ Deploy do Frontend (Vercel)

### Passo 1: Criar conta na Vercel
1. Acesse [https://vercel.com](https://vercel.com)
2. Clique em "Sign Up"
3. Faça login com GitHub

### Passo 2: Importar projeto
1. No dashboard, clique em "Add New..." → "Project"
2. Selecione seu repositório do GitHub
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: (deixe padrão) `npm run build`
   - **Output Directory**: (deixe padrão) `.next`

### Passo 3: Adicionar variáveis de ambiente
Na seção "Environment Variables", adicione:

```env
NEXT_PUBLIC_API_URL=https://mediccontrol-api.onrender.com
```

### Passo 4: Deploy
1. Clique em "Deploy"
2. Aguarde o build (~2 minutos)
3. Copie a URL do seu site (ex: `https://mediccontrol.vercel.app`)

### Passo 5: Atualizar CORS no backend
Volte no Render e adicione/atualize a variável:

```env
FRONTEND_URL=https://mediccontrol.vercel.app
```

Clique em "Manual Deploy" → "Deploy latest commit"

✅ Frontend no ar!

---

## 4️⃣ Configurações Finais

### Atualizar arquivo de configuração da API
No frontend, verifique se `lib/api.ts` está usando a variável de ambiente:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

### Testar a aplicação
1. Acesse seu site na Vercel
2. Tente fazer cadastro/login
3. Verifique se as requisições funcionam

---

## ⚠️ Limitações do Plano Gratuito

### Render (Backend)
- ⏰ **Sleep após 15 min**: Backend dorme se não houver requests
- 🐌 **Cold start**: Primeira requisição pode levar 30-50s
- 💾 **750h/mês**: Suficiente para hobby (31 dias × 24h = 744h)

**Solução**: Configure um cron job gratuito (cron-job.org) para fazer ping a cada 10 minutos

### Supabase (Banco)
- 💾 **500MB**: Suficiente para milhares de registros
- 🔄 **2GB transfer/mês**: ~60 usuários ativos
- ⏸️ **Pausa após 1 semana**: Sem atividade, banco pausa

### Vercel (Frontend)
- ✅ **Sem limitações** significativas para hobby
- 🚀 CDN global
- 📦 100GB bandwidth/mês

---

## 🔒 Segurança em Produção

### Checklist de Segurança
- [ ] Senhas JWT fortes (min 32 caracteres)
- [ ] DATABASE_URL não exposta no frontend
- [ ] CORS configurado corretamente
- [ ] HTTPS habilitado (automático na Vercel/Render)
- [ ] Rate limiting ativo (já configurado no código)
- [ ] Helmet.js ativo (já configurado no código)

---

## 🎯 Alternativas

### Se precisar de mais recursos:

**Backend alternativo: Railway**
- Plano gratuito: $5 créditos/mês
- Sem sleep
- Deploy mais rápido

**Banco alternativo: Neon**
- PostgreSQL gratuito
- Sem sleep
- 3GB storage

**Backend + Banco: Railway**
- Tudo em um lugar
- PostgreSQL integrado
- $5 grátis/mês

---

## 📱 Domínio Customizado (Opcional)

### Vercel (Frontend)
1. Compre domínio (ex: mediccontrol.com.br em Registro.br ~R$40/ano)
2. Na Vercel: Settings → Domains → Add Domain
3. Configure DNS conforme instruções

### Render (Backend)
1. Na Vercel, configure subdomínio: api.mediccontrol.com.br
2. Aponte para o Render via CNAME

---

## 🆘 Troubleshooting

### Erro: "Cannot connect to database"
- Verifique se a DATABASE_URL está correta
- Teste a conexão localmente primeiro
- Verifique se as migrations foram aplicadas

### Erro: "CORS policy"
- Verifique se FRONTEND_URL está correto no backend
- Faça redeploy do backend após mudar variável

### Backend muito lento na primeira requisição
- Normal no plano gratuito (cold start)
- Configure cron job para manter ativo

### Erro de build no Vercel
- Verifique se `frontend/package.json` tem `next build`
- Certifique-se que todas as dependências estão no package.json

---

## 📊 Monitoramento

### Logs do Backend (Render)
1. Dashboard → Seu service → Logs
2. Veja erros em tempo real

### Logs do Frontend (Vercel)
1. Dashboard → Seu projeto → Logs
2. Veja requisições e erros

### Banco de Dados (Supabase)
1. Dashboard → SQL Editor
2. Execute queries para verificar dados

---

## 🎉 Pronto!

Seu MedicControl está no ar! 🚀

**URLs finais:**
- 🌐 Site: https://mediccontrol.vercel.app
- 🔌 API: https://mediccontrol-api.onrender.com
- 🗄️ Banco: Supabase

**Próximos passos:**
1. Crie seu primeiro usuário
2. Teste todas as funcionalidades
3. Configure email (opcional)
4. Configure domínio customizado (opcional)
5. Monitore logs e performance
