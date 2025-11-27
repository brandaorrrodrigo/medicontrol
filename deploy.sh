#!/bin/bash

# 🚀 Script de Deploy Rápido - MediControl
# Automatiza o processo de aplicar correções e fazer deploy

echo "🚀 MediControl - Deploy Rápido no Railway"
echo "=========================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: package.json não encontrado!${NC}"
    echo "Execute este script na raiz do projeto backend."
    exit 1
fi

echo -e "${BLUE}📋 Este script vai:${NC}"
echo "1. Verificar arquivos necessários"
echo "2. Executar build local para testar"
echo "3. Fazer commit das mudanças"
echo "4. Fazer push para o GitHub"
echo ""
read -p "Continuar? (s/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Deploy cancelado."
    exit 0
fi

echo ""
echo "1️⃣  Verificando arquivos..."
echo "----------------------------"

# Verificar arquivos essenciais
FILES_OK=true

if [ ! -f "railway.toml" ]; then
    echo -e "${RED}❌ railway.toml não encontrado${NC}"
    FILES_OK=false
fi

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json não encontrado${NC}"
    FILES_OK=false
fi

if [ ! -f "tsconfig.json" ]; then
    echo -e "${RED}❌ tsconfig.json não encontrado${NC}"
    FILES_OK=false
fi

if [ ! -f "prisma/schema.prisma" ]; then
    echo -e "${RED}❌ prisma/schema.prisma não encontrado${NC}"
    FILES_OK=false
fi

if [ "$FILES_OK" = false ]; then
    echo ""
    echo -e "${RED}❌ Arquivos essenciais faltando!${NC}"
    echo "Certifique-se de que todos os arquivos foram copiados corretamente."
    exit 1
fi

echo -e "${GREEN}✅ Todos os arquivos necessários encontrados${NC}"
echo ""

echo "2️⃣  Instalando dependências..."
echo "----------------------------"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependências instaladas${NC}"
echo ""

echo "3️⃣  Testando build..."
echo "----------------------------"
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Build falhou!${NC}"
    echo "Corrija os erros acima antes de continuar."
    exit 1
fi

echo -e "${GREEN}✅ Build executado com sucesso${NC}"
echo ""

# Verificar se dist foi gerado
if [ -d "dist" ] && [ -f "dist/server.js" ]; then
    echo -e "${GREEN}✅ Arquivos compilados gerados em dist/${NC}"
else
    echo -e "${RED}❌ dist/server.js não foi gerado${NC}"
    exit 1
fi

echo ""
echo "4️⃣  Preparando commit..."
echo "----------------------------"

# Verificar se há mudanças
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Nenhuma mudança para commit${NC}"
    echo ""
    read -p "Forçar push mesmo assim? (s/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Deploy cancelado."
        exit 0
    fi
else
    # Adicionar arquivos
    git add railway.toml package.json .env.example .gitignore
    
    echo ""
    echo "Arquivos que serão commitados:"
    git diff --cached --name-only
    echo ""
    
    read -p "Mensagem do commit (Enter para usar padrão): " COMMIT_MSG
    
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="fix: configuração Railway para deploy TypeScript"
    fi
    
    git commit -m "$COMMIT_MSG"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro ao fazer commit${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Commit realizado${NC}"
fi

echo ""
echo "5️⃣  Fazendo push..."
echo "----------------------------"

# Detectar branch atual
BRANCH=$(git branch --show-current)

echo "Branch atual: $BRANCH"
echo ""
read -p "Fazer push para origin/$BRANCH? (s/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Push cancelado."
    echo -e "${YELLOW}⚠️  Lembre-se de fazer push manualmente!${NC}"
    exit 0
fi

git push origin $BRANCH

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Erro ao fazer push${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Push realizado com sucesso!${NC}"
echo ""

echo "=========================================="
echo -e "${GREEN}🎉 DEPLOY INICIADO COM SUCESSO!${NC}"
echo "=========================================="
echo ""
echo "Próximos passos:"
echo ""
echo "1. 🔗 Acesse o Railway Dashboard:"
echo "   https://railway.app/project/seu-projeto"
echo ""
echo "2. 🔍 Monitore o deploy em 'Deployments'"
echo ""
echo "3. ⚙️  Configure variáveis de ambiente (se ainda não fez):"
echo "   - DATABASE_URL"
echo "   - JWT_SECRET"
echo "   - FRONTEND_URL"
echo "   - Outras do .env.example"
echo ""
echo "4. 🗄️  Adicione PostgreSQL (se necessário):"
echo "   New → Database → PostgreSQL"
echo ""
echo "5. ✅ Teste o endpoint:"
echo "   curl https://seu-backend.railway.app/health"
echo ""
echo -e "${BLUE}📚 Consulte DEPLOY_RAILWAY.md para mais detalhes${NC}"
echo ""

# Abrir Railway no browser (opcional)
read -p "Abrir Railway Dashboard no navegador? (s/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    # Tentar detectar URL do Railway
    if command -v railway &> /dev/null; then
        railway open
    else
        echo "Comando 'railway' não encontrado."
        echo "Instale: npm install -g @railway/cli"
        echo "Ou acesse: https://railway.app"
    fi
fi

echo ""
echo "🚀 Boa sorte com o deploy!"
echo ""
