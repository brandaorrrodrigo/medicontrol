import { PrismaClient, UserRole, Gender, VitalSignType, VitalSignStatus, ExamStatus, NotificationType } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash para senhas (senha: "password123")
  const hashedPassword = await bcrypt.hash('password123', 10)

  // ============================================================================
  // CRIAR USUÁRIOS E PACIENTES
  // ============================================================================

  const patient1User = await prisma.user.create({
    data: {
      email: 'joao.silva@email.com',
      password: hashedPassword,
      role: UserRole.PATIENT,
      patient: {
        create: {
          name: 'João Silva',
          phone: '(11) 98765-4321',
          dateOfBirth: new Date('1980-05-15'),
          gender: Gender.M,
          bloodType: 'O+',
          conditions: ['Hipertensão', 'Diabetes Tipo 2'],
          allergies: ['Penicilina'],
          emergencyContact: {
            name: 'Maria Silva',
            phone: '(11) 98765-1234',
            relationship: 'Esposa',
          },
        },
      },
    },
    include: { patient: true },
  })

  const patient2User = await prisma.user.create({
    data: {
      email: 'jose.costa@email.com',
      password: hashedPassword,
      role: UserRole.PATIENT,
      patient: {
        create: {
          name: 'José Costa',
          phone: '(11) 91234-5678',
          dateOfBirth: new Date('1955-03-20'),
          gender: Gender.M,
          bloodType: 'A+',
          conditions: ['Alzheimer', 'Hipertensão'],
          allergies: [],
        },
      },
    },
    include: { patient: true },
  })

  // ============================================================================
  // CRIAR CUIDADOR
  // ============================================================================

  const caregiverUser = await prisma.user.create({
    data: {
      email: 'ana.costa@email.com',
      password: hashedPassword,
      role: UserRole.CAREGIVER,
      caregiver: {
        create: {
          name: 'Ana Costa',
          phone: '(11) 91234-5678',
          relationship: 'Filha',
        },
      },
    },
    include: { caregiver: true },
  })

  // Vincular cuidador aos pacientes
  await prisma.patientCaregiver.createMany({
    data: [
      {
        patientId: patient1User.patient!.id,
        caregiverId: caregiverUser.caregiver!.id,
      },
      {
        patientId: patient2User.patient!.id,
        caregiverId: caregiverUser.caregiver!.id,
      },
    ],
  })

  // ============================================================================
  // CRIAR PROFISSIONAL
  // ============================================================================

  const professionalUser = await prisma.user.create({
    data: {
      email: 'carla.mendes@hospital.com',
      password: hashedPassword,
      role: UserRole.PROFESSIONAL,
      professional: {
        create: {
          name: 'Dra. Carla Mendes',
          specialty: 'Cardiologia',
          crm: '123456-SP',
          phone: '(11) 3456-7890',
        },
      },
    },
    include: { professional: true },
  })

  // Vincular profissional aos pacientes
  await prisma.patientProfessional.createMany({
    data: [
      {
        patientId: patient1User.patient!.id,
        professionalId: professionalUser.professional!.id,
      },
      {
        patientId: patient2User.patient!.id,
        professionalId: professionalUser.professional!.id,
      },
    ],
  })

  // ============================================================================
  // CRIAR MEDICAMENTOS
  // ============================================================================

  const medication1 = await prisma.medication.create({
    data: {
      patientId: patient1User.patient!.id,
      name: 'Losartana',
      dosage: '50mg',
      frequency: '1x ao dia',
      startDate: new Date('2024-01-01'),
      instructions: 'Tomar pela manhã, em jejum',
      prescribedBy: 'Dra. Carla Mendes',
      active: true,
    },
  })

  const medication2 = await prisma.medication.create({
    data: {
      patientId: patient1User.patient!.id,
      name: 'Metformina',
      dosage: '850mg',
      frequency: '2x ao dia',
      startDate: new Date('2024-01-01'),
      instructions: 'Tomar após as refeições',
      prescribedBy: 'Dra. Carla Mendes',
      active: true,
    },
  })

  // Criar lembretes de medicamentos
  const now = new Date()
  await prisma.medicationSchedule.createMany({
    data: [
      {
        medicationId: medication1.id,
        patientId: patient1User.patient!.id,
        scheduledFor: new Date(now.getTime() + 3600000), // +1 hora
        taken: false,
      },
      {
        medicationId: medication2.id,
        patientId: patient1User.patient!.id,
        scheduledFor: new Date(now.getTime() + 7200000), // +2 horas
        taken: false,
      },
    ],
  })

  // ============================================================================
  // CRIAR SINAIS VITAIS
  // ============================================================================

  await prisma.vitalSign.createMany({
    data: [
      {
        patientId: patient1User.patient!.id,
        type: VitalSignType.BLOOD_PRESSURE,
        value: '120/80',
        unit: 'mmHg',
        status: VitalSignStatus.NORMAL,
        timestamp: new Date(now.getTime() - 3600000),
      },
      {
        patientId: patient1User.patient!.id,
        type: VitalSignType.GLUCOSE,
        value: '110',
        unit: 'mg/dL',
        status: VitalSignStatus.NORMAL,
        timestamp: new Date(now.getTime() - 7200000),
      },
      {
        patientId: patient1User.patient!.id,
        type: VitalSignType.HEART_RATE,
        value: '72',
        unit: 'bpm',
        status: VitalSignStatus.NORMAL,
        timestamp: new Date(now.getTime() - 3600000),
      },
    ],
  })

  // ============================================================================
  // CRIAR EXAMES
  // ============================================================================

  await prisma.exam.createMany({
    data: [
      {
        patientId: patient1User.patient!.id,
        name: 'Hemograma Completo',
        type: 'Exame de Sangue',
        date: new Date(now.getTime() - 86400000),
        status: ExamStatus.COMPLETED,
        result: 'Normal - sem alterações',
        doctor: 'Dra. Carla Mendes',
      },
      {
        patientId: patient1User.patient!.id,
        name: 'Ecocardiograma',
        type: 'Exame Cardíaco',
        date: new Date(now.getTime() + 604800000), // +7 dias
        status: ExamStatus.SCHEDULED,
        doctor: 'Dra. Carla Mendes',
      },
    ],
  })

  // ============================================================================
  // CRIAR NOTIFICAÇÕES
  // ============================================================================

  await prisma.notification.createMany({
    data: [
      {
        userId: patient1User.id,
        title: 'Lembrete de Medicamento',
        message: 'Não esqueça de tomar Losartana às 14:00',
        type: NotificationType.INFO,
        read: false,
        timestamp: new Date(now.getTime() - 1800000),
      },
      {
        userId: patient1User.id,
        title: 'Exame Agendado',
        message: 'Ecocardiograma agendado para próxima semana',
        type: NotificationType.SUCCESS,
        read: false,
        timestamp: new Date(now.getTime() - 3600000),
      },
      {
        userId: caregiverUser.id,
        title: 'Lembrete de Medicamento',
        message: 'Losartana para João Silva em 1 hora',
        type: NotificationType.INFO,
        read: false,
        timestamp: new Date(now.getTime() - 900000),
      },
    ],
  })

  // ============================================================================
  // CRIAR CONSULTA
  // ============================================================================

  await prisma.consultation.create({
    data: {
      patientId: patient1User.patient!.id,
      professionalId: professionalUser.professional!.id,
      type: 'ROUTINE',
      date: new Date(now.getTime() + 7200000), // +2 horas
      duration: 30,
      notes: 'Consulta de rotina',
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📧 Test users created:')
  console.log('- Patient: joao.silva@email.com / password123')
  console.log('- Patient: jose.costa@email.com / password123')
  console.log('- Caregiver: ana.costa@email.com / password123')
  console.log('- Professional: carla.mendes@hospital.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
