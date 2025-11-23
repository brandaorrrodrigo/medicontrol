# MedicControl - Guia de Início Rápido

## 🎯 Visão Geral

O **MedicControl** é um sistema completo de gestão de saúde com 3 tipos de usuários:
- **Pacientes**: Gerenciam sua própria saúde
- **Cuidadores**: Acompanham múltiplos pacientes
- **Profissionais**: Atendem e prescrevem para pacientes

## 📦 Pré-requisitos

- **Node.js** 18 ou superior
- **PostgreSQL** 14 ou superior
- **npm** ou **yarn**
- **Git**

## 🚀 Instalação e Configuração

### 1. Clone o Repositório

```bash
cd D:\Projects\MedicControl
```

### 2. Configure o Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
copy .env.example .env

# Editar o arquivo .env com suas configurações
# DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/mediccontrol"
# JWT_SECRET="seu-secret-super-seguro-mude-isso"
# JWT_REFRESH_SECRET="outro-secret-super-seguro"
```

### 3. Configure o Banco de Dados

```bash
# Criar as tabelas
npm run prisma:migrate

# Popular com dados de teste
npm run prisma:seed
```

### 4. Configure o Frontend

```bash
cd ..\frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
copy .env.example .env.local

# O arquivo .env.local deve conter:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🏃 Executando o Sistema

### Terminal 1 - Backend

```bash
cd D:\Projects\MedicControl\backend
npm run dev
```

✅ Backend rodando em `http://localhost:3001`

### Terminal 2 - Frontend

```bash
cd D:\Projects\MedicControl\frontend
npm run dev
```

✅ Frontend rodando em `http://localhost:3000`

## 👥 Usuários de Teste

Após executar `npm run prisma:seed`, você terá os seguintes usuários:

### 🏥 Paciente

```
Email: joao.silva@email.com
Senha: password123
```

**Acesso:** Dashboard com medicamentos, sinais vitais e exames

### 👨‍👩‍👧 Cuidador

```
Email: ana.costa@email.com
Senha: password123
```

**Acesso:** Dashboard com visão de múltiplos pacientes

### 👨‍⚕️ Profissional de Saúde

```
Email: carla.mendes@hospital.com
Senha: password123
```

**Acesso:** Dashboard com consultas, pacientes e exames

## 🧪 Testando o Sistema

### 1. Teste de Login

1. Acesse `http://localhost:3000`
2. Você será redirecionado para `/login`
3. Use uma das credenciais acima
4. Após login, será redirecionado para o dashboard apropriado

### 2. Teste do Dashboard do Paciente

**Login como:** `joao.silva@email.com`

✅ **Funcionalidades disponíveis:**
- Ver informações pessoais
- Visualizar próximos medicamentos
- Marcar medicamentos como tomados
- Ver sinais vitais recentes
- Visualizar exames agendados e resultados
- Receber notificações
- Estatísticas rápidas

**Como testar:**
1. Faça login
2. Veja a lista de medicamentos
3. Clique em "Marcar" em um medicamento
4. Observe que ele muda para "✓ Tomado"
5. Veja as notificações não lidas
6. Clique em uma notificação para marcá-la como lida

### 3. Teste do Dashboard do Cuidador

**Login como:** `ana.costa@email.com`

✅ **Funcionalidades disponíveis:**
- Ver perfil do cuidador
- Visualizar lista de pacientes
- Ver medicamentos de todos os pacientes
- Monitorar sinais vitais (com alertas)
- Acompanhar exames
- Receber notificações agregadas

**Como testar:**
1. Faça login
2. Veja a lista de pacientes sob seus cuidados
3. Observe os medicamentos de diferentes pacientes
4. Veja alertas de sinais vitais (status warning/danger)
5. Verifique as estatísticas consolidadas

### 4. Teste do Dashboard do Profissional

**Login como:** `carla.mendes@hospital.com`

✅ **Funcionalidades disponíveis:**
- Ver estatísticas gerais (total pacientes, consultas hoje, exames pendentes)
- Visualizar consultas agendadas
- Ver lista de pacientes
- Acompanhar exames e resultados
- Receber notificações

**Como testar:**
1. Faça login
2. Observe os cards de estatísticas coloridos
3. Veja as consultas agendadas para hoje
4. Navegue pela lista de pacientes
5. Verifique os exames recentes e seus status

### 5. Teste de Registro

1. Acesse `http://localhost:3000/register`
2. Escolha um tipo de conta (Paciente/Cuidador/Profissional)
3. Preencha o formulário
4. Crie a conta
5. Será automaticamente logado e redirecionado

**Campos específicos por tipo:**
- **Paciente**: Data de nascimento, gênero, tipo sanguíneo
- **Cuidador**: Relação com o paciente
- **Profissional**: Especialidade e CRM

### 6. Teste de Logout

1. Em qualquer dashboard, procure o botão de logout no header
2. Clique em "Sair"
3. Será redirecionado para `/login`
4. Tente acessar `/patient/dashboard` sem estar logado
5. Deve ser redirecionado automaticamente para login

## 🔧 Testando APIs Diretamente

### Usando o Backend diretamente

Você pode testar as APIs usando ferramentas como Postman, Insomnia ou curl:

#### 1. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"joao.silva@email.com\",\"password\":\"password123\"}"
```

Resposta:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "joao.silva@email.com",
      "role": "PATIENT",
      "name": "João Silva"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Obter Dashboard do Paciente

```bash
curl http://localhost:3001/api/dashboard/patient \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### 3. Marcar Medicamento como Tomado

```bash
curl -X POST http://localhost:3001/api/reminders/REMINDER_ID/mark-taken \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

## 🎨 Estrutura Visual

### Login/Registro
- Design moderno com gradientes
- Validação em tempo real
- Mensagens de erro claras
- Credenciais de teste visíveis

### Dashboards
- **Paciente**: Tema azul, foco em autocuidado
- **Cuidador**: Tema verde, visão multi-paciente
- **Profissional**: Tema roxo, ferramentas profissionais

### Componentes
- Cards informativos
- Badges de status coloridos
- Loading states
- Estados de erro com retry
- Notificações não lidas destacadas

## 🔍 Troubleshooting

### Problema: Erro de conexão com o banco

**Solução:**
1. Verifique se o PostgreSQL está rodando
2. Confirme as credenciais no `.env`
3. Teste a conexão:
```bash
cd backend
npm run prisma:studio
```

### Problema: Frontend não conecta com backend

**Solução:**
1. Verifique se o backend está rodando em `http://localhost:3001`
2. Confirme o `.env.local` do frontend tem `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
3. Verifique o console do navegador para erros CORS

### Problema: Token expirado constantemente

**Solução:**
1. O access token expira em 15 minutos
2. O sistema deve renovar automaticamente
3. Se falhar, faça logout e login novamente

### Problema: Página em branco após login

**Solução:**
1. Abra o console do navegador (F12)
2. Verifique se há erros
3. Confirme que o token foi salvo (Application > Local Storage)
4. Tente limpar o cache e fazer login novamente

## 📊 Dados de Teste

O seed cria automaticamente:

### Pacientes
- João Silva (paciente principal)
- José Costa (paciente vinculado a cuidador)

### Relacionamentos
- Ana Costa (cuidadora) → José Costa (paciente)
- Dra. Carla Mendes (profissional) → Vários pacientes

### Dados Gerados
- Medicamentos com horários
- Sinais vitais (alguns com alertas)
- Exames agendados e concluídos
- Notificações não lidas

## 🎯 Fluxos de Teste Recomendados

### Fluxo 1: Jornada do Paciente
1. Registrar como paciente
2. Ver dashboard
3. Marcar medicamento como tomado
4. Ver notificação de confirmação
5. Explorar sinais vitais e exames

### Fluxo 2: Jornada do Cuidador
1. Login como cuidador
2. Ver lista de pacientes
3. Identificar alertas de sinais vitais
4. Marcar medicamento de um paciente
5. Ver notificações consolidadas

### Fluxo 3: Jornada do Profissional
1. Login como profissional
2. Ver estatísticas gerais
3. Checar consultas do dia
4. Revisar exames pendentes
5. Visualizar pacientes

## 📝 Próximos Passos

Após se familiarizar com o sistema:

1. **Explore as APIs**: Veja `backend/README.md` para lista completa de endpoints
2. **Teste funcionalidades avançadas**: Upload de arquivos, prescrições, consultas
3. **Personalize**: Ajuste cores, textos, adicione novos recursos
4. **Deploy**: Prepare para produção com variáveis de ambiente adequadas

## 🆘 Suporte

Se encontrar problemas:

1. **Verifique os logs**: Backend e Frontend mostram erros detalhados no console
2. **Revise a documentação**:
   - `backend/README.md` - Documentação completa da API
   - `frontend/README.md` - Documentação do frontend
   - `PROJECT_STATUS.md` - Status completo do projeto
3. **Issues conhecidos**: Verifique se já foi reportado

## 🎉 Você está pronto!

O MedicControl está 100% funcional e pronto para uso. Explore, teste e adapte conforme suas necessidades!

**Happy coding! 🚀**
