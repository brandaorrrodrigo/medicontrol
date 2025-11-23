# 🏥 MedicControl

> Sistema completo de gestão de saúde para pacientes, cuidadores e profissionais de saúde.

[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)]()
[![Backend](https://img.shields.io/badge/Backend-100%25-blue)]()
[![Frontend](https://img.shields.io/badge/Frontend-100%25-blue)]()
[![License](https://img.shields.io/badge/License-Private-red)]()

## 📋 Sobre o Projeto

MedicControl é uma plataforma web moderna e completa para gestão de saúde, oferecendo:

- ✅ **Gerenciamento de Medicamentos** com lembretes automáticos
- ✅ **Monitoramento de Sinais Vitais** com alertas inteligentes
- ✅ **Agendamento e Acompanhamento de Exames**
- ✅ **Prescrições Médicas** digitais
- ✅ **Consultas e Agendamentos**
- ✅ **Notificações em Tempo Real**
- ✅ **Sistema de Cron Jobs** para lembretes automáticos

## 🎯 Tipos de Usuários

### 👤 Paciente
- Visualizar e gerenciar medicamentos
- Registrar sinais vitais
- Acompanhar exames
- Receber notificações e lembretes

### 👨‍👩‍👧 Cuidador
- Acompanhar múltiplos pacientes
- Visão consolidada de medicamentos
- Alertas de sinais vitais críticos
- Gerenciar lembretes

### 👨‍⚕️ Profissional de Saúde
- Gerenciar pacientes
- Prescrever medicamentos
- Agendar consultas
- Analisar exames e resultados

## 🛠️ Tecnologias

### Backend
- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação
- **node-cron** - Tarefas agendadas

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Zustand** - Estado global
- **Lucide React** - Ícones

## 🚀 Início Rápido

### 1. Instalação

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Editar .env com suas configurações

# Frontend
cd ../frontend
npm install
cp .env.example .env.local
```

### 2. Banco de Dados

```bash
cd backend
npm run prisma:migrate
npm run prisma:seed
```

### 3. Executar

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Rodando em http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Rodando em http://localhost:3000
```

### 4. Login

Acesse `http://localhost:3000` e use:

| Email | Senha | Tipo |
|-------|-------|------|
| joao.silva@email.com | password123 | Paciente |
| ana.costa@email.com | password123 | Cuidador |
| carla.mendes@hospital.com | password123 | Profissional |

## 📚 Documentação

- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Guia completo de início
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Status detalhado do projeto
- **[backend/README.md](./backend/README.md)** - Documentação da API
- **[frontend/README.md](./frontend/README.md)** - Documentação do Frontend

## 📊 Status do Projeto

### Backend - 100% ✅
- ✅ 67 endpoints REST implementados
- ✅ 11 módulos completos
- ✅ Sistema de autenticação JWT
- ✅ Cron jobs automatizados
- ✅ Upload de arquivos
- ✅ Notificações automáticas

### Frontend - 100% ✅
- ✅ 3 dashboards completos
- ✅ Autenticação completa
- ✅ Proteção de rotas
- ✅ Integração total com backend
- ✅ UI/UX moderna e responsiva
- ✅ Sistema de notificações

## 🎨 Screenshots

### Dashboard do Paciente
![Dashboard Paciente](docs/screenshots/patient-dashboard.png)
- Medicamentos próximos
- Sinais vitais recentes
- Exames agendados
- Notificações

### Dashboard do Cuidador
![Dashboard Cuidador](docs/screenshots/caregiver-dashboard.png)
- Múltiplos pacientes
- Alertas consolidados
- Medicamentos de todos
- Estatísticas gerais

### Dashboard do Profissional
![Dashboard Profissional](docs/screenshots/professional-dashboard.png)
- Consultas do dia
- Lista de pacientes
- Exames pendentes
- Estatísticas

## 🔐 Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ JWT com access + refresh tokens
- ✅ Refresh tokens em httpOnly cookies
- ✅ Rate limiting configurado
- ✅ CORS configurado
- ✅ Validação de entrada com Zod
- ✅ Proteção contra SQL injection (Prisma)

## 🌟 Funcionalidades

### Autenticação
- [x] Login/Logout
- [x] Registro (3 tipos de usuário)
- [x] Recuperação de senha
- [x] Renovação automática de token
- [x] Proteção de rotas

### Medicamentos
- [x] CRUD completo
- [x] Lembretes automáticos
- [x] Soft delete
- [x] Histórico de ingestão

### Sinais Vitais
- [x] Registro de múltiplos tipos
- [x] Cálculo automático de status
- [x] Alertas para valores críticos
- [x] Estatísticas e gráficos

### Exames
- [x] Agendamento
- [x] Upload de resultados (PDF/imagens)
- [x] Múltiplos arquivos por exame
- [x] Status tracking

### Consultas
- [x] Agendamento
- [x] Tipos: Rotina, Urgente, Retorno
- [x] Status tracking
- [x] Notificações automáticas

### Prescrições
- [x] Criação por profissionais
- [x] Múltiplos medicamentos
- [x] Notificação ao paciente

### Notificações
- [x] Criação automática
- [x] Marcar como lida
- [x] Filtros (lidas/não lidas)
- [x] Tipos: Info, Warning, Success, Danger

### Cron Jobs
- [x] Lembretes de medicamentos (30min)
- [x] Lembretes de consultas (1h)
- [x] Prevenção de duplicatas

## 📁 Estrutura do Projeto

```
MedicControl/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── auth/           # Autenticação
│   │   ├── dashboard/      # Dashboards
│   │   ├── medications/    # Medicamentos
│   │   ├── vitals/         # Sinais vitais
│   │   ├── exams/          # Exames
│   │   ├── consultations/  # Consultas
│   │   ├── prescriptions/  # Prescrições
│   │   ├── notifications/  # Notificações
│   │   ├── cron/           # Tarefas agendadas
│   │   ├── common/         # Email e serviços comuns
│   │   └── ...
│   ├── prisma/             # Schema e migrations
│   └── uploads/            # Arquivos uploaded
│
├── frontend/               # Next.js + React
│   ├── app/
│   │   ├── (auth)/         # Login/Registro/Recuperação de senha
│   │   ├── (paciente)/     # Dashboard Paciente
│   │   ├── (cuidador)/     # Dashboard Cuidador
│   │   └── (profissional)/ # Dashboard Profissional
│   ├── components/         # Componentes React
│   ├── lib/                # API client
│   ├── services/           # Serviços
│   └── store/              # Estado global (Zustand)
│
└── docs/                   # Documentação
```

## 🧪 Testando

### Testes Manuais

```bash
# Ver GETTING_STARTED.md para guia completo de testes
```

### Testes de API

```bash
# Exemplo com curl
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao.silva@email.com","password":"password123"}'
```

### Prisma Studio

```bash
cd backend
npm run prisma:studio
# Abre interface visual em http://localhost:5555
```

## 🔄 Fluxo de Autenticação

1. Usuário faz login → Recebe access token + refresh token (cookie)
2. Access token válido por 15 minutos
3. Refresh token válido por 7 dias
4. Em caso de 401, frontend renova automaticamente
5. Se falhar, redireciona para login

## 📊 Estatísticas

- **Total de Endpoints**: 67
- **Total de Modelos**: 19
- **Linhas de Código Backend**: ~6.000+
- **Linhas de Código Frontend**: ~3.500+
- **Arquivos TypeScript**: ~80+
- **Componentes React**: ~15+

## 🎯 Roadmap Futuro

- [ ] Notificações push (WebSockets)
- [ ] Modo offline (PWA)
- [ ] Gráficos avançados
- [ ] Exportação de relatórios (PDF)
- [ ] Chat em tempo real
- [ ] Integração com APIs externas
- [ ] App mobile (React Native)
- [ ] Telemedicina (videochamadas)

## 🤝 Contribuindo

Este é um projeto privado. Para contribuir:

1. Clone o repositório
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Privado - MedicControl © 2024

## 👨‍💻 Desenvolvido por

**Equipe MedicControl**

---

⭐ **Star** este projeto se você achou útil!

📧 Para suporte: [suporte@mediccontrol.com](mailto:suporte@mediccontrol.com)

🌐 Website: [www.mediccontrol.com](https://www.mediccontrol.com)
