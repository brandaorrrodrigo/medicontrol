# 🚂 Deploy MedicControl - Railway (Recomendado)

## Por que Railway?

✅ **Backend + Banco juntos** - Tudo em um lugar
✅ **Sem cold start** - Sempre rápido
✅ **$5 grátis/mês** - Suficiente para começar
✅ **Deploy simples** - Menos configuração
✅ **PostgreSQL integrado** - Connection string automática

---

## 📋 Stack Final

| Componente | Plataforma | Custo |
|------------|-----------|-------|
| **Frontend** | Vercel | Gratuito |
| **Backend + Banco** | Railway | $5 grátis/mês |

---

## 🚀 Deploy em 20 Minutos

### Pré-requisitos
- [ ] Código no GitHub (repositório público ou privado)
- [ ] Conta na Railway criada
- [ ] Cartão de crédito cadastrado na Railway (não será cobrado nos primeiros $5)

---

## 1️⃣ Deploy do Backend + Banco (Railway)

### Passo 1: Criar novo projeto
1. Acesse https://railway.app/dashboard
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha seu repositório `MedicControl`
5. Railway detectará automaticamente o projeto

### Passo 2: Adicionar PostgreSQL
1. No projeto Railway, clique em **"+ New"**
2. Selecione **"Database"**
3. Escolha **"Add PostgreSQL"**
4. PostgreSQL será provisionado automaticamente
5. ✅ Railway cria automaticamente a variável `DATABASE_URL`

### Passo 3: Configurar o Backend
1. Clique no service do backend (não no database)
2. Vá em **"Settings"**
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Watch Paths**: `/backend/**`

### Passo 4: Adicionar variáveis de ambiente
1. No service do backend, vá em **"Variables"**
2. Clique em **"+ New Variable"**
3. Adicione as seguintes variáveis:

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://mediccontrol.vercel.app
JWT_SECRET=gere-senha-forte-aqui-32-caracteres
JWT_REFRESH_SECRET=outra-senha-diferente-32-caracteres
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

⚠️ **IMPORTANTE**: A variável `DATABASE_URL` já foi criada automaticamente pela Railway! Não precisa adicionar.

**Como gerar senhas JWT fortes:**
```bash
# Execute no terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Passo 5: Executar migrations
Após o primeiro deploy falhar (normal), você precisa rodar as migrations:

**Opção A - Via Railway CLI (Recomendado)**
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Linkar ao projeto
railway link

# Rodar migrations
railway run npx prisma migrate deploy
```

**Opção B - Via Localmente**
1. Copie a `DATABASE_URL` da Railway
2. No seu `.env` local, substitua temporariamente pela URL da Railway
3. Execute: `npx prisma migrate deploy`
4. Reverta o `.env` para localhost

### Passo 6: Redeploy
1. Na Railway, clique em **"Deploy"** → **"Redeploy"**
2. Aguarde o build (~2-3 minutos)
3. Clique em **"Settings"** → **"Generate Domain"**
4. Copie a URL (ex: `https://mediccontrol-api.up.railway.app`)

✅ **Backend + Banco configurados!**

---

## 2️⃣ Deploy do Frontend (Vercel)

### Passo 1: Criar conta na Vercel
1. Acesse https://vercel.com
2. Clique em **"Sign Up"**
3. Faça login com GitHub

### Passo 2: Importar projeto
1. No dashboard, clique em **"Add New..."** → **"Project"**
2. Selecione seu repositório `MedicControl`
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: (deixe padrão) `npm run build`
   - **Output Directory**: (deixe padrão) `.next`

### Passo 3: Adicionar variável de ambiente
Na seção **"Environment Variables"**, adicione:

```env
NEXT_PUBLIC_API_URL=https://mediccontrol-api.up.railway.app/api
```

⚠️ **Substitua pela URL real** que você copiou da Railway!

### Passo 4: Deploy
1. Clique em **"Deploy"**
2. Aguarde o build (~2 minutos)
3. Copie a URL do site (ex: `https://mediccontrol.vercel.app`)

✅ **Frontend no ar!**

---

## 3️⃣ Configuração Final

### Atualizar FRONTEND_URL no Railway
1. Volte na Railway
2. Clique no service do backend → **"Variables"**
3. Edite a variável `FRONTEND_URL`
4. Coloque a URL da Vercel: `https://mediccontrol.vercel.app`
5. O Railway fará redeploy automaticamente

---

## 4️⃣ Testar a Aplicação

### Checklist de Testes
- [ ] Acesse o site na Vercel
- [ ] Teste criar conta
- [ ] Teste fazer login
- [ ] Verifique se o dashboard carrega
- [ ] Adicione um medicamento
- [ ] Verifique se os dados são salvos

### URLs Finais
- **Site**: https://mediccontrol.vercel.app
- **API**: https://mediccontrol-api.up.railway.app
- **Banco**: Dashboard da Railway

---

## 📊 Monitoramento

### Railway
- **Dashboard**: https://railway.app/dashboard
- **Logs**: Clique no service → "Deployments" → Último deploy → "View Logs"
- **Métricas**: Veja uso de CPU, memória e créditos
- **Banco de dados**: Clique no PostgreSQL → "Data" → "Connect"

### Vercel
- **Dashboard**: https://vercel.com/dashboard
- **Logs**: Clique no projeto → "Deployments" → Último deploy → "Logs"
- **Analytics**: Veja visitantes e performance

---

## 💰 Gerenciar Créditos Railway

### Ver uso atual
1. Railway Dashboard → Nome do projeto
2. Veja "Usage" no topo
3. Créditos gratuitos: $5/mês

### Quanto dura?
- **Uso leve** (~10 usuários): ~30 dias
- **Uso médio** (~50 usuários): ~15-20 dias
- **Uso pesado**: ~7-10 dias

### Quando os créditos acabarem
Opções:
1. **Adicionar cartão**: Pague apenas o que usar além dos $5
2. **Otimizar**: Reduza recursos (escale para baixo)
3. **Migrar**: Volte para Render (gratuito com cold start)

---

## 🔧 Comandos Úteis

### Railway CLI

```bash
# Instalar
npm i -g @railway/cli

# Login
railway login

# Ver projetos
railway list

# Linkar ao projeto
railway link

# Ver variáveis
railway variables

# Rodar comando no Railway
railway run <comando>

# Ver logs em tempo real
railway logs

# SSH no container
railway shell
```

### Rodar migrations
```bash
railway run npx prisma migrate deploy
```

### Abrir Prisma Studio no banco da Railway
```bash
railway run npx prisma studio
```

---

## 🆘 Troubleshooting

### Erro: "Cannot connect to database"
**Solução:**
1. Verifique se o PostgreSQL está rodando na Railway
2. Verifique se as migrations foram aplicadas
3. Teste a conexão:
   ```bash
   railway run npx prisma db pull
   ```

### Erro: "CORS policy"
**Solução:**
1. Verifique `FRONTEND_URL` na Railway
2. Certifique-se que é HTTPS (não HTTP)
3. Redeploy após alterar

### Erro: "Module not found"
**Solução:**
1. Verifique Root Directory: deve ser `backend`
2. Verifique Build Command
3. Force rebuild: Settings → "Restart Build"

### Migrations não aplicadas
**Solução:**
```bash
# Via Railway CLI
railway run npx prisma migrate deploy

# Ou gere o Prisma Client novamente
railway run npx prisma generate
```

### Créditos acabando rápido
**Soluções:**
1. **Escale para baixo**: Settings → "Resources" → Menor tier
2. **Sleep schedule**: Configure para dormir à noite (hobby plan)
3. **Remova recursos**: Delete serviços não usados

---

## 🎯 Próximos Passos

### Configurações Opcionais

#### 1. Domínio Customizado
**Railway (Backend)**
1. Settings → "Domains"
2. "Custom Domain" → `api.seusite.com`
3. Configure DNS:
   - CNAME: api → seu-projeto.up.railway.app

**Vercel (Frontend)**
1. Settings → "Domains"
2. "Add Domain" → `seusite.com`
3. Configure DNS conforme instruções

#### 2. Alertas de Créditos
1. Railway → Settings → "Usage Alerts"
2. Configure alerta em $4 (80% dos créditos)

#### 3. Backup Automático
1. Railway → PostgreSQL → Settings
2. "Backups" → Configure frequência
3. Backups ficam salvos 7 dias

#### 4. Logs Persistentes
Railway salva logs por 7 dias. Para mais:
- Integre com Logtail, Papertrail, ou similar
- Use Sentry para monitorar erros

---

## 📈 Escalabilidade

### Quando crescer
Railway permite escalar facilmente:

1. **Mais recursos**: Settings → "Resources" → Maior tier
2. **Múltiplas instâncias**: Settings → "Replicas"
3. **Redis**: Adicione cache para performance
4. **CDN**: Vercel já usa CDN global

### Custos Estimados (além dos $5 grátis)
- **Hobby**: $5-20/mês (até 100 usuários)
- **Startup**: $20-50/mês (até 1000 usuários)
- **Growth**: $50+/mês (milhares de usuários)

---

## 🎉 Pronto!

Seu MedicControl está no ar com Railway + Vercel! 🚀

**Benefícios dessa stack:**
- ✅ Deploy simplificado (tudo junto na Railway)
- ✅ Performance melhor (sem cold start)
- ✅ Gerenciamento fácil (um dashboard só)
- ✅ Escalável quando crescer

**Tem dúvidas?** Consulte:
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MedicControl Issues: https://github.com/seu-repo/issues
