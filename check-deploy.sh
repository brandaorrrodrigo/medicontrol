#!/bin/bash

# 🔍 Script de Verificação Pré-Deploy - MediControl Backend
# Execute este script antes de fazer deploy no Railway

echo "🚀 MediControl - Verificação Pré-Deploy"
echo "========================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
ERRORS=0
WARNINGS=0

# Função para verificar arquivo
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1 encontrado${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 NÃO encontrado${NC}"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Função para verificar conteúdo
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✅ $3${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $3 - não encontrado${NC}"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
}

echo "1️⃣  Verificando arquivos obrigatórios..."
echo "----------------------------------------"
check_file "package.json"
check_file "tsconfig.json"
check_file "railway.toml"
check_file "prisma/schema.prisma"
check_file "src/server.ts"
echo ""

echo "2️⃣  Verificando package.json..."
echo "----------------------------------------"
check_content "package.json" '"build"' "Script 'build' existe"
check_content "package.json" '"start"' "Script 'start' existe"
check_content "package.json" '"start:railway"' "Script 'start:railway' existe"
check_content "package.json" '"prisma generate"' "Prisma generate configurado"
echo ""

echo "3️⃣  Verificando railway.toml..."
echo "----------------------------------------"
check_content "railway.toml" "npm run build" "Build command configurado"
check_content "railway.toml" "start:railway" "Start command configurado"
echo ""

echo "4️⃣  Verificando estrutura TypeScript..."
echo "----------------------------------------"
if [ -d "src" ]; then
    echo -e "${GREEN}✅ Pasta src/ existe${NC}"
    
    if [ -f "src/server.ts" ]; then
        echo -e "${GREEN}✅ src/server.ts encontrado${NC}"
        
        # Verificar se usa process.env.PORT
        if grep -q "process.env.PORT" "src/server.ts"; then
            echo -e "${GREEN}✅ Porta configurada com process.env.PORT${NC}"
        else
            echo -e "${YELLOW}⚠️  Considere usar process.env.PORT no servidor${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "${RED}❌ src/server.ts não encontrado${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}❌ Pasta src/ não encontrada${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo "5️⃣  Verificando Prisma..."
echo "----------------------------------------"
if [ -d "prisma" ]; then
    echo -e "${GREEN}✅ Pasta prisma/ existe${NC}"
    
    if [ -f "prisma/schema.prisma" ]; then
        echo -e "${GREEN}✅ schema.prisma encontrado${NC}"
        
        # Verificar provider
        if grep -q "provider.*=.*\"postgresql\"" "prisma/schema.prisma"; then
            echo -e "${GREEN}✅ Provider PostgreSQL configurado${NC}"
        else
            echo -e "${YELLOW}⚠️  Provider não é PostgreSQL${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
        
        # Verificar DATABASE_URL
        if grep -q "env(\"DATABASE_URL\")" "prisma/schema.prisma"; then
            echo -e "${GREEN}✅ DATABASE_URL configurada${NC}"
        else
            echo -e "${RED}❌ DATABASE_URL não encontrada no schema${NC}"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo -e "${RED}❌ schema.prisma não encontrado${NC}"
        ERRORS=$((ERRORS + 1))
    fi
    
    if [ -d "prisma/migrations" ]; then
        echo -e "${GREEN}✅ Migrations existem${NC}"
    else
        echo -e "${YELLOW}⚠️  Nenhuma migration encontrada${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}❌ Pasta prisma/ não encontrada${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo "6️⃣  Testando build local..."
echo "----------------------------------------"
echo "Executando: npm run build"

if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build executado com sucesso${NC}"
    
    # Verificar se dist foi gerado
    if [ -d "dist" ]; then
        echo -e "${GREEN}✅ Pasta dist/ gerada${NC}"
        
        if [ -f "dist/server.js" ]; then
            echo -e "${GREEN}✅ dist/server.js gerado${NC}"
        else
            echo -e "${RED}❌ dist/server.js não foi gerado${NC}"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo -e "${RED}❌ Pasta dist/ não foi gerada${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}❌ Build falhou! Verifique os erros acima${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo "7️⃣  Verificando variáveis de ambiente..."
echo "----------------------------------------"
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ Arquivo .env encontrado (para desenvolvimento)${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado (OK para produção)${NC}"
fi

if [ -f ".env.example" ]; then
    echo -e "${GREEN}✅ .env.example encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  .env.example não encontrado (recomendado)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo "8️⃣  Verificando dependências..."
echo "----------------------------------------"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules instalado${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules não encontrado. Execute: npm install${NC}"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo "========================================"
echo "📊 RESULTADO DA VERIFICAÇÃO"
echo "========================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ TUDO PRONTO PARA DEPLOY!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. Commit e push das mudanças"
    echo "2. Configure variáveis no Railway"
    echo "3. Adicione PostgreSQL no Railway (se necessário)"
    echo "4. Deploy!"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  PRONTO COM AVISOS ($WARNINGS avisos)${NC}"
    echo ""
    echo "Você pode prosseguir com o deploy, mas revise os avisos acima."
    exit 0
else
    echo -e "${RED}❌ CORRIJA OS ERROS ANTES DO DEPLOY!${NC}"
    echo ""
    echo "Erros encontrados: $ERRORS"
    echo "Avisos: $WARNINGS"
    echo ""
    echo "Revise os itens marcados com ❌ acima."
    exit 1
fi
