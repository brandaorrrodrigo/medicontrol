# 🧪 Testando Dashboard API

## Pré-requisitos

1. Backend rodando: `npm run dev`
2. Banco de dados com seed: `npm run prisma:seed`

## 📝 Fluxo de Teste

### 1. Fazer Login

Primeiro, faça login para obter o access token:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao.silva@email.com",
    "password": "password123"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-aqui",
      "email": "joao.silva@email.com",
      "role": "PATIENT",
      "name": "João Silva"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Copie o `accessToken` para usar nas próximas requisições!**

---

### 2. Dashboard do Paciente

```bash
curl -X GET http://localhost:3001/api/dashboard/patient \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "patient": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao.silva@email.com",
      "phone": "(11) 98765-4321",
      "age": 43,
      "gender": "M",
      "bloodType": "O+",
      "conditions": ["Hipertensão", "Diabetes Tipo 2"],
      "allergies": ["Penicilina"],
      "emergencyContact": { ... }
    },
    "upcomingMedications": [
      {
        "id": "uuid",
        "medicationName": "Losartana",
        "dosage": "50mg",
        "time": "2024-01-15T14:00:00Z",
        "frequency": "1x ao dia",
        "taken": false
      }
    ],
    "recentVitalSigns": [...],
    "recentExams": [...],
    "notifications": [...]
  }
}
```

---

### 3. Dashboard do Cuidador

```bash
# Primeiro faça login como cuidador
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ana.costa@email.com",
    "password": "password123"
  }'

# Depois acesse o dashboard
curl -X GET http://localhost:3001/api/dashboard/caregiver \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_CUIDADOR"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "caregiver": {
      "id": "uuid",
      "name": "Ana Costa",
      "email": "ana.costa@email.com",
      "relationship": "Filha"
    },
    "patients": [
      {
        "id": "uuid",
        "name": "José Costa",
        "age": 69,
        "conditions": ["Alzheimer", "Hipertensão"]
      }
    ],
    "upcomingMedications": [...],
    "recentVitalSigns": [...],
    "recentExams": [...],
    "notifications": [...]
  }
}
```

---

### 4. Dashboard do Profissional

```bash
# Primeiro faça login como profissional
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "carla.mendes@hospital.com",
    "password": "password123"
  }'

# Depois acesse o dashboard
curl -X GET http://localhost:3001/api/dashboard/professional \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_PROFISSIONAL"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "professional": {
      "id": "uuid",
      "name": "Dra. Carla Mendes",
      "specialty": "Cardiologia",
      "crm": "123456-SP"
    },
    "patients": [...],
    "upcomingAppointments": [
      {
        "id": "uuid",
        "patientName": "João Silva",
        "date": "2024-01-15T16:00:00Z",
        "type": "ROUTINE",
        "duration": 30
      }
    ],
    "recentExams": [...],
    "notifications": [...],
    "stats": {
      "totalPatients": 2,
      "appointmentsToday": 1,
      "pendingExams": 0
    }
  }
}
```

---

## ⚠️ Testando Erros

### Sem autenticação

```bash
curl -X GET http://localhost:3001/api/dashboard/patient
```

**Resposta:**
```json
{
  "success": false,
  "error": "Token não fornecido"
}
```

### Role incorreto

```bash
# Tentar acessar dashboard de cuidador com token de paciente
curl -X GET http://localhost:3001/api/dashboard/caregiver \
  -H "Authorization: Bearer TOKEN_DE_PACIENTE"
```

**Resposta:**
```json
{
  "success": false,
  "error": "Acesso negado"
}
```

---

## 🔧 Testando com Postman/Insomnia

1. **Criar uma request de Login**
   - Method: POST
   - URL: `http://localhost:3001/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "joao.silva@email.com",
       "password": "password123"
     }
     ```

2. **Salvar o token**
   - Copie o `accessToken` da resposta

3. **Criar request de Dashboard**
   - Method: GET
   - URL: `http://localhost:3001/api/dashboard/patient`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer SEU_TOKEN_AQUI`

---

## ✅ Checklist de Testes

- [ ] Login com paciente funciona
- [ ] Dashboard de paciente retorna dados corretos
- [ ] Login com cuidador funciona
- [ ] Dashboard de cuidador retorna múltiplos pacientes
- [ ] Login com profissional funciona
- [ ] Dashboard de profissional retorna estatísticas
- [ ] Acesso sem token retorna 401
- [ ] Acesso com role errado retorna 403
- [ ] Token expirado retorna 401

---

## 📊 Formato de Resposta

Todas as respostas seguem o padrão:

**Sucesso:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Erro:**
```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```
