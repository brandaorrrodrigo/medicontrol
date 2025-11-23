# MedicControl Frontend

Frontend web application para o sistema MedicControl - Sistema de Gestão de Saúde.

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Zustand** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend MedicControl rodando (veja `../backend/README.md`)

## 🔧 Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🏃 Executando o projeto

### Modo desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

### Build para produção

```bash
npm run build
npm start
```

## 🔐 Autenticação

O sistema utiliza autenticação JWT integrada com o backend:

- **Access Token**: Armazenado no Zustand store e localStorage
- **Refresh Token**: Gerenciado via httpOnly cookies
- **Renovação automática**: O sistema renova o token automaticamente em caso de expiração

### Login

Use as credenciais de teste do backend (após rodar `npm run prisma:seed` no backend):

| Email | Senha | Role |
|-------|-------|------|
| joao.silva@email.com | password123 | PATIENT |
| ana.costa@email.com | password123 | CAREGIVER |
| carla.mendes@hospital.com | password123 | PROFESSIONAL |

## 📱 Funcionalidades Implementadas

### Dashboards

- ✅ **Dashboard do Paciente**
  - Visualização de medicamentos próximos
  - Sinais vitais recentes
  - Exames agendados e resultados
  - Notificações

- ✅ **Dashboard do Cuidador**
  - Visão consolidada de múltiplos pacientes
  - Medicamentos de todos os pacientes
  - Alertas de sinais vitais
  - Exames pendentes

- ✅ **Dashboard do Profissional**
  - Lista de pacientes
  - Consultas agendadas
  - Exames pendentes de análise
  - Estatísticas gerais

### Autenticação

- ✅ Login
- ✅ Registro de usuários (paciente, cuidador, profissional)
- ✅ Logout
- ✅ Recuperação de senha
- ✅ Renovação automática de token

### Ações Rápidas

- ✅ Marcar medicamento como tomado
- ✅ Marcar notificação como lida
- ✅ Marcar todas notificações como lidas

## 🗂️ Estrutura do Projeto

```
frontend/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Rotas de autenticação
│   │   ├── login/         # Login
│   │   ├── register/      # Registro
│   │   ├── forgot-password/ # Recuperação de senha
│   │   └── reset-password/  # Resetar senha
│   ├── (paciente)/        # Dashboard do paciente
│   │   ├── dashboard/     # Visão geral
│   │   ├── medicamentos/  # Gerenciar medicamentos
│   │   │   └── [id]/fotos/ # Fotos do medicamento (caixa, frasco, bula, receita)
│   │   ├── sinais-vitais/ # Sinais vitais com gráficos
│   │   ├── exames/        # Exames e resultados
│   │   ├── fotos/         # Galeria de fotos (antes/depois do paciente)
│   │   ├── consultas/     # Consultas agendadas
│   │   ├── prescricoes/   # Prescrições médicas
│   │   └── perfil/        # Perfil do paciente
│   ├── (cuidador)/        # Dashboard do cuidador
│   │   └── dashboard/     # Visão consolidada
│   ├── (profissional)/    # Dashboard do profissional
│   │   └── dashboard/     # Gerenciar pacientes
│   └── layout.tsx
├── components/            # Componentes reutilizáveis
├── lib/                   # Utilitários e configurações
│   ├── api.ts            # Cliente API integrado com backend
│   └── types.ts          # Definições de tipos TypeScript
├── services/             # Serviços
│   └── auth.service.ts   # Serviço de autenticação
├── store/                # Estado global (Zustand)
│   └── auth.store.ts     # Store de autenticação
└── styles/               # Estilos globais
```

## 🔌 Integração com Backend

O frontend está 100% integrado com a API do backend. Todas as chamadas de API estão em `lib/api.ts`:

### Cliente API

```typescript
// Exemplo de uso
import { getPatientDashboardData } from '@/lib/api'

const data = await getPatientDashboardData()
```

### Autenticação Automática

O cliente API adiciona automaticamente o token de autenticação em todas as requisições:

```typescript
// Em lib/api.ts
headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
}
```

### Renovação Automática de Token

Em caso de token expirado (401), o sistema tenta renovar automaticamente:

```typescript
if (response.status === 401) {
  const newToken = await authService.refreshToken()
  // Retenta a requisição com novo token
}
```

## 🎨 Customização

### Cores e Tema

Edite `tailwind.config.js` para personalizar o tema:

```javascript
theme: {
  extend: {
    colors: {
      primary: {...},
      secondary: {...},
    },
  },
}
```

### Adicionar Novos Endpoints

1. Adicione a função em `lib/api.ts`:

```typescript
export async function getMyData(): Promise<MyData> {
  return await fetchAPI<MyData>('/my-endpoint')
}
```

2. Use no componente:

```typescript
import { getMyData } from '@/lib/api'

const data = await getMyData()
```

## 🔄 Fluxo de Autenticação

1. Usuário faz login via `authService.login()`
2. Token é armazenado no Zustand store e localStorage
3. Refresh token é armazenado em httpOnly cookie pelo backend
4. Todas as requisições incluem o access token
5. Se token expirar (401), sistema renova automaticamente
6. Se renovação falhar, usuário é redirecionado para login

## 📚 Funcionalidades Completas

✅ **Implementado (Frontend 100% Completo):**

- [x] Autenticação completa (login, registro, recuperação de senha)
- [x] Dashboard do paciente com visão geral
- [x] Dashboard do cuidador com múltiplos pacientes
- [x] Dashboard do profissional
- [x] Gerenciamento de medicamentos (CRUD completo)
- [x] Fotos dos medicamentos (caixa, frasco, bula, receita médica)
- [x] Sinais vitais com gráficos interativos (Recharts)
- [x] Exames com upload de arquivos
- [x] Galeria de fotos (antes/depois/progresso do paciente)
- [x] Consultas e agendamentos
- [x] Prescrições médicas com visualização
- [x] Perfil do paciente editável
- [x] Sistema de notificações
- [x] Integração 100% com backend

🚀 **Próximos Passos:**

- [ ] Adicionar chat em tempo real
- [ ] Adicionar notificações push (WebSockets)
- [ ] Adicionar modo offline (PWA)
- [ ] Adicionar exportação de relatórios (PDF)
- [ ] Adicionar gráficos avançados e analytics
- [ ] Adicionar telemedicina (videochamadas)

## 🐛 Troubleshooting

### Erro de CORS

Certifique-se que o backend está configurado para aceitar requisições do frontend:

```typescript
// backend/src/config/env.ts
FRONTEND_URL: "http://localhost:3000"
```

### Token expirado constantemente

Verifique se os cookies estão sendo enviados corretamente. O fetch deve incluir:

```typescript
credentials: 'include'
```

### API não encontrada

Verifique se a variável `NEXT_PUBLIC_API_URL` está configurada corretamente no `.env.local`.

## 📄 Licença

Privado - MedicControl © 2024
