-- ============================================================================
-- SEED SIMPLES - Dados mínimos para testar o MedicControl
-- ============================================================================

-- Senha hasheada para "password123" (bcrypt)
-- Você pode usar essa senha para fazer login

-- 1. Criar usuário paciente
INSERT INTO "User" (id, email, password, role, active, "createdAt", "updatedAt")
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'joao.silva@email.com',
  '$2b$10$rKJ5VqH8K.X5qZxVQZ8I3OqvP6xKxvXzJ5X9Z8HqY6Z8qZ8qZ8qZ8',
  'PATIENT',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- 2. Criar perfil do paciente
INSERT INTO "Patient" (id, "userId", name, phone, "dateOfBirth", gender, "bloodType", conditions, allergies, "emergencyContact", "createdAt", "updatedAt")
VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  'João Silva',
  '(11) 98765-4321',
  '1980-05-15',
  'M',
  'O+',
  ARRAY['Hipertensão', 'Diabetes Tipo 2'],
  ARRAY['Penicilina'],
  '{"name": "Maria Silva", "phone": "(11) 98765-1234", "relationship": "Esposa"}',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- 3. Criar um medicamento de exemplo
INSERT INTO "Medication" (id, "patientId", name, dosage, frequency, "startDate", instructions, "prescribedBy", active, "createdAt", "updatedAt")
VALUES (
  '550e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440002',
  'Losartana',
  '50mg',
  '1x ao dia',
  CURRENT_TIMESTAMP,
  'Tomar pela manhã em jejum',
  'Dr. Carlos Mendes',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Mensagem de sucesso
SELECT 'Dados de teste criados com sucesso!' as message,
       'Login: joao.silva@email.com' as email,
       'Senha: password123' as senha;
