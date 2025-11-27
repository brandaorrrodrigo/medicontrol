# ⚡ Quick Start - Railway Deploy

## 🎯 Deploy em 20 minutos

### ✅ Pré-requisitos
- [ ] Código no GitHub
- [ ] Conta Railway criada
- [ ] Conta Vercel criada

---

## 🚂 Parte 1: Railway (Backend + Banco) - 10 min

### 1. Criar projeto
1. https://railway.app/dashboard → **New Project**
2. **Deploy from GitHub repo** → Escolha `MedicControl`

### 2. Adicionar PostgreSQL
1. No projeto → **+ New** → **Database** → **PostgreSQL**
2. ✅ Aguarde provisionar (~1 min)

### 3. Configurar Backend
No service do backend:
1. **Settings** → Configure:
   - Root Directory: `backend`
   - Build: `npm install && npx prisma generate && npm run build`
   - Start: `npm start`

### 4. Variáveis de Ambiente
**Variables** → Adicione:

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://mediccontrol.vercel.app
JWT_SECRET=<gere-senha-forte-32-chars>
JWT_REFRESH_SECRET=<outra-senha-diferente-32-chars>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**Gerar senhas:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Rodar Migrations
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login e linkar
railway login
railway link

# Rodar migrations
railway run npx prisma migrate deploy
```

### 6. Gerar domínio
1. **Settings** → **Generate Domain**
2. ✅ Copie a URL: `https://xxxxx.up.railway.app`

---

## 🎨 Parte 2: Vercel (Frontend) - 10 min

### 1. Importar projeto
1. https://vercel.com/dashboard → **Add New** → **Project**
2. Selecione repositório `MedicControl`

### 2. Configurar
- Framework: **Next.js**
- Root Directory: `frontend`
- Build: (padrão) `npm run build`

### 3. Variável de Ambiente
```env
NEXT_PUBLIC_API_URL=https://xxxxx.up.railway.app/api
```
⚠️ Cole a URL da Railway que você copiou!

### 4. Deploy
1. **Deploy** → Aguarde ~2 min
2. ✅ Copie a URL: `https://xxxxx.vercel.app`

---

## 🔄 Parte 3: Conectar tudo

### Atualizar FRONTEND_URL
1. Volte na Railway
2. Backend → **Variables** → Edite `FRONTEND_URL`
3. Cole a URL da Vercel
4. ✅ Railway redeploy automaticamente

---

## ✅ Testar

- [ ] Abra o site da Vercel
- [ ] Crie uma conta
- [ ] Faça login
- [ ] Dashboard carrega?
- [ ] Adicione um medicamento

---

## 📝 Anote suas URLs

```
Site: https://_____.vercel.app
API:  https://_____.up.railway.app
```

---

## 🆘 Deu erro?

### "Cannot connect to database"
```bash
railway run npx prisma migrate deploy
```

### "CORS policy"
Verifique `FRONTEND_URL` na Railway (deve ser HTTPS)

### "Module not found"
Settings → Root Directory deve ser `backend`

---

## 💡 Dica Pro

### Manter logs em tempo real:
```bash
railway logs -f
```

### Abrir Prisma Studio:
```bash
railway run npx prisma studio
```

### Ver uso de créditos:
Railway Dashboard → Veja "Usage" no topo

---

## 🎉 Pronto!

Seu MedicControl está no ar! 🚀

**Documentação completa**: `DEPLOY_RAILWAY.md`
