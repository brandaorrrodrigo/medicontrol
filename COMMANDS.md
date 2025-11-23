# MedicControl - Comandos Úteis

## 📦 Comandos do Backend

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar versão de produção
npm start
```

### Banco de Dados (Prisma)

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Criar/aplicar migrations
npm run prisma:migrate

# Criar migration com nome
npx prisma migrate dev --name nome_da_migration

# Popular banco com dados de teste
npm run prisma:seed

# Abrir Prisma Studio (interface visual)
npm run prisma:studio

# Sincronizar schema sem migration (dev only)
npm run db:push

# Resetar banco de dados (CUIDADO!)
npm run db:reset

# Ver status das migrations
npx prisma migrate status

# Formatar schema.prisma
npx prisma format
```

### Testes e Linting

```bash
# Rodar linter
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

### Utilitários

```bash
# Ver logs do servidor
# (logs aparecem automaticamente ao rodar npm run dev)

# Limpar node_modules e reinstalar
rm -rf node_modules
npm install

# Verificar versão do Node
node -v

# Verificar versão do npm
npm -v
```

## 🎨 Comandos do Frontend

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar build de produção
npm start

# Analisar bundle
npm run build && npx @next/bundle-analyzer
```

### Linting e Formatação

```bash
# Rodar linter
npm run lint

# Fix automático de problemas de lint
npm run lint -- --fix

# Verificar tipos TypeScript
npx tsc --noEmit
```

### Utilitários

```bash
# Limpar cache do Next.js
rm -rf .next

# Limpar tudo e reinstalar
rm -rf node_modules .next
npm install

# Ver estrutura de rotas
npx next info
```

## 🗄️ Comandos do PostgreSQL

### Windows (psql)

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Conectar a um banco específico
psql -U postgres -d mediccontrol

# Listar bancos de dados
\l

# Conectar a um banco
\c mediccontrol

# Listar tabelas
\dt

# Descrever uma tabela
\d nome_da_tabela

# Executar query
SELECT * FROM "User";

# Sair
\q
```

### Criar Banco de Dados

```sql
CREATE DATABASE mediccontrol;
```

### Dropar Banco (CUIDADO!)

```sql
DROP DATABASE mediccontrol;
```

## 🐳 Docker (Opcional)

### PostgreSQL com Docker

```bash
# Iniciar PostgreSQL em container
docker run --name mediccontrol-db \
  -e POSTGRES_PASSWORD=sua_senha \
  -e POSTGRES_DB=mediccontrol \
  -p 5432:5432 \
  -d postgres:14

# Parar container
docker stop mediccontrol-db

# Iniciar container existente
docker start mediccontrol-db

# Ver logs
docker logs mediccontrol-db

# Remover container
docker rm mediccontrol-db
```

## 🔧 Comandos Git

### Básicos

```bash
# Ver status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: adicionar nova funcionalidade"

# Push
git push origin main

# Pull
git pull origin main

# Ver histórico
git log --oneline
```

### Branches

```bash
# Criar nova branch
git checkout -b feature/minha-feature

# Mudar de branch
git checkout main

# Listar branches
git branch

# Deletar branch
git branch -d feature/minha-feature
```

### Desfazer Mudanças

```bash
# Desfazer mudanças não staged
git checkout -- arquivo.ts

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Desfazer último commit (descarta mudanças)
git reset --hard HEAD~1

# Ver diferenças
git diff
```

## 📊 Comandos de Debug

### Backend

```bash
# Verificar se porta 3001 está em uso (Windows)
netstat -ano | findstr :3001

# Matar processo na porta 3001
# Encontre o PID e então:
taskkill /PID numero_do_pid /F

# Ver variáveis de ambiente
echo %DATABASE_URL%

# Testar conexão com banco
npx prisma db pull
```

### Frontend

```bash
# Verificar se porta 3000 está em uso
netstat -ano | findstr :3000

# Limpar cache e reinstalar
rm -rf node_modules .next package-lock.json
npm install

# Build com análise detalhada
npm run build -- --profile

# Verificar variáveis de ambiente
echo %NEXT_PUBLIC_API_URL%
```

## 🧪 Comandos de Teste com cURL

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"joao.silva@email.com\",\"password\":\"password123\"}"
```

### Dashboard (com token)

```bash
curl http://localhost:3001/api/dashboard/patient \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Criar Medicamento

```bash
curl -X POST http://localhost:3001/api/medications \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "{\"patientId\":\"ID_PACIENTE\",\"name\":\"Aspirina\",\"dosage\":\"100mg\",\"frequency\":\"2x ao dia\"}"
```

### Health Check

```bash
curl http://localhost:3001/health
```

## 🔍 Comandos de Monitoramento

### Ver Processos Node

```bash
# Windows
tasklist | findstr node

# Ver uso de memória
tasklist /FI "IMAGENAME eq node.exe" /FO TABLE
```

### Logs em Tempo Real

```bash
# Backend (já mostra automaticamente)
npm run dev

# Frontend (já mostra automaticamente)
npm run dev
```

## 📝 Comandos de Documentação

### Gerar Documentação da API

```bash
# Se tiver Swagger/OpenAPI configurado
npx swagger-jsdoc -d swagger.json src/**/*.ts

# Gerar documentação TypeScript
npx typedoc --out docs src
```

## 🚀 Comandos de Deploy

### Build Completo

```bash
# Backend
cd backend
npm run build
npm run prisma:migrate deploy

# Frontend
cd ../frontend
npm run build
```

### Verificar Build

```bash
# Backend
node dist/server.js

# Frontend
npm start
```

## 💡 Dicas Úteis

### Aliases (Adicione ao seu .bashrc ou .zshrc)

```bash
# Backend
alias backend-dev="cd D:/Projects/MedicControl/backend && npm run dev"
alias backend-db="cd D:/Projects/MedicControl/backend && npm run prisma:studio"

# Frontend
alias frontend-dev="cd D:/Projects/MedicControl/frontend && npm run dev"

# Ambos
alias medic-dev="backend-dev & frontend-dev"
```

### Scripts Package.json Customizados

Adicione ao `package.json`:

```json
{
  "scripts": {
    "dev:all": "concurrently \"npm run dev\" \"cd ../frontend && npm run dev\"",
    "clean": "rm -rf node_modules dist .next",
    "fresh": "npm run clean && npm install",
    "db:reset:dev": "npx prisma migrate reset && npm run prisma:seed"
  }
}
```

## 🔒 Comandos de Segurança

### Atualizar Dependências

```bash
# Verificar dependências desatualizadas
npm outdated

# Atualizar todas (cuidado!)
npm update

# Atualizar uma específica
npm update nome-do-pacote

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades automaticamente
npm audit fix
```

### Verificar Licenças

```bash
# Instalar license-checker
npm install -g license-checker

# Ver licenças de todas as dependências
license-checker
```

## 📦 Comandos de Backup

### Backup do Banco de Dados

```bash
# PostgreSQL dump
pg_dump -U postgres mediccontrol > backup.sql

# Restaurar backup
psql -U postgres mediccontrol < backup.sql
```

### Backup de Uploads

```bash
# Copiar pasta de uploads
cp -r backend/uploads backend/uploads-backup-$(date +%Y%m%d)
```

---

💡 **Dica**: Salve este arquivo e consulte sempre que precisar!

🔖 **Atalho**: Ctrl+F para buscar comandos específicos
