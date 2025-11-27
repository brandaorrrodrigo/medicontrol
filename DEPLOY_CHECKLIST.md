# ✅ Checklist de Deploy - MedicControl

## 🎯 Deploy Rápido (30 minutos)

### 1. Banco de Dados (Supabase) - 5 min
- [ ] Criar conta em https://supabase.com
- [ ] Criar novo projeto "mediccontrol"
- [ ] Definir senha forte do banco
- [ ] Copiar Connection String (URI)
- [ ] Executar migrations localmente:
  ```bash
  cd backend
  # Atualizar .env com URL do Supabase
  npx prisma migrate deploy
  ```

### 2. Backend (Render) - 10 min
- [ ] Criar conta em https://render.com
- [ ] Código no GitHub (público ou privado)
- [ ] Criar novo Web Service
  - Root Directory: `backend`
  - Build: `npm install && npx prisma generate && npm run build`
  - Start: `npm start`
  - Instance: Free
- [ ] Adicionar variáveis de ambiente:
  ```env
  NODE_ENV=production
  PORT=3001
  DATABASE_URL=postgresql://postgres:SENHA@db.xxx.supabase.co:5432/postgres
  JWT_SECRET=gere-uma-senha-forte-aqui-min-32-chars
  JWT_REFRESH_SECRET=outra-senha-diferente-aqui-min-32-chars
  JWT_EXPIRES_IN=15m
  JWT_REFRESH_EXPIRES_IN=7d
  FRONTEND_URL=https://mediccontrol.vercel.app
  ```
- [ ] Fazer deploy
- [ ] Copiar URL do backend (ex: `https://mediccontrol-api.onrender.com`)

### 3. Frontend (Vercel) - 10 min
- [ ] Criar conta em https://vercel.com
- [ ] Importar repositório do GitHub
- [ ] Configurar:
  - Framework: Next.js
  - Root Directory: `frontend`
- [ ] Adicionar variável de ambiente:
  ```env
  NEXT_PUBLIC_API_URL=https://mediccontrol-api.onrender.com/api
  ```
- [ ] Fazer deploy
- [ ] Copiar URL do site (ex: `https://mediccontrol.vercel.app`)

### 4. Configuração Final - 5 min
- [ ] Voltar no Render e atualizar FRONTEND_URL com URL da Vercel
- [ ] Fazer redeploy do backend
- [ ] Testar o site:
  - [ ] Cadastro de usuário
  - [ ] Login
  - [ ] Dashboard carrega
  - [ ] API responde

---

## 🔑 Gerando Senhas JWT Fortes

Execute no terminal:

```bash
# JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# JWT_REFRESH_SECRET (execute novamente para gerar outra)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie e cole nas variáveis de ambiente do Render.

---

## 📝 URLs para Guardar

Depois do deploy, anote:

- **Site**: https://_____.vercel.app
- **API**: https://_____.onrender.com
- **Banco**: Supabase Dashboard

---

## ⚠️ Importante

### Cold Start no Render (Plano Gratuito)
O backend dorme após 15 minutos sem uso. Primeira requisição pode levar 30-50s.

**Solução**: Configure um ping automático
1. Crie conta em https://cron-job.org (gratuito)
2. Adicione job:
   - URL: `https://seu-backend.onrender.com/health`
   - Intervalo: A cada 10 minutos
   - Horário: 24/7

Isso mantém o backend ativo.

---

## 🎓 Troubleshooting Rápido

### Erro: "Failed to fetch" no frontend
✅ Verifique NEXT_PUBLIC_API_URL na Vercel
✅ Verifique se backend está ativo (acesse /health)

### Erro: "CORS policy"
✅ Verifique FRONTEND_URL no backend (Render)
✅ Faça redeploy do backend após alterar

### Erro: "Database connection failed"
✅ Verifique DATABASE_URL no backend
✅ Teste conexão local primeiro
✅ Certifique-se que migrations foram aplicadas

### Backend muito lento
✅ Normal no primeiro acesso (cold start)
✅ Configure cron job para manter ativo

---

## 📚 Documentação Completa

Para instruções detalhadas, consulte: **DEPLOY_GUIDE.md**
