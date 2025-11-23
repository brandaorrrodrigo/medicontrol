import { prisma } from '../database/prisma'
import type { UpdatePatientInput } from './patients.validator'

export class PatientsService {
  // Listar todos os pacientes (com filtros por role)
  async getPatients(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patient: true,
        caregiver: {
          include: {
            patients: {
              include: {
                patient: true,
              },
            },
          },
        },
        professional: {
          include: {
            patients: {
              include: {
                patient: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    // Se for paciente, retorna apenas ele mesmo
    if (user.patient) {
      return [this.formatPatient(user.patient)]
    }

    // Se for cuidador, retorna pacientes sob seus cuidados
    if (user.caregiver) {
      return user.caregiver.patients.map((pc) => this.formatPatient(pc.patient))
    }

    // Se for profissional, retorna seus pacientes
    if (user.professional) {
      return user.professional.patients.map((pp) => this.formatPatient(pp.patient))
    }

    return []
  }

  // Obter detalhes de um paciente
  async getPatientById(patientId: string, userId: string) {
    // Verificar acesso
    await this.verifyPatientAccess(patientId, userId)

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        caregivers: {
          include: {
            caregiver: true,
          },
        },
        professionals: {
          include: {
            professional: true,
          },
        },
        medications: {
          where: { active: true },
          take: 5,
        },
        vitalSigns: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
        exams: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    })

    if (!patient) {
      throw new Error('Paciente não encontrado')
    }

    return {
      id: patient.id,
      name: patient.name,
      email: patient.user.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth.toISOString(),
      age: this.calculateAge(patient.dateOfBirth),
      gender: patient.gender,
      bloodType: patient.bloodType,
      conditions: patient.conditions,
      allergies: patient.allergies,
      emergencyContact: patient.emergencyContact as any,
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
      caregivers: patient.caregivers.map((pc) => ({
        id: pc.caregiver.id,
        name: pc.caregiver.name,
        relationship: pc.caregiver.relationship,
      })),
      professionals: patient.professionals.map((pp) => ({
        id: pp.professional.id,
        name: pp.professional.name,
        specialty: pp.professional.specialty,
        crm: pp.professional.crm,
      })),
      medications: patient.medications.map((m) => ({
        id: m.id,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
      })),
      recentVitalSigns: patient.vitalSigns.map((v) => ({
        id: v.id,
        type: v.type,
        value: v.value,
        timestamp: v.timestamp.toISOString(),
      })),
      recentExams: patient.exams.map((e) => ({
        id: e.id,
        name: e.name,
        date: e.date.toISOString(),
        status: e.status,
      })),
    }
  }

  // Atualizar paciente
  async updatePatient(patientId: string, data: UpdatePatientInput, userId: string) {
    // Verificar acesso
    await this.verifyPatientAccess(patientId, userId)

    const updated = await prisma.patient.update({
      where: { id: patientId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
        ...(data.gender && { gender: data.gender }),
        ...(data.bloodType !== undefined && { bloodType: data.bloodType }),
        ...(data.conditions && { conditions: data.conditions }),
        ...(data.allergies && { allergies: data.allergies }),
        ...(data.emergencyContact !== undefined && { emergencyContact: data.emergencyContact as any }),
      },
    })

    return this.formatPatient(updated)
  }

  // Vincular cuidador ao paciente
  async linkCaregiver(patientId: string, caregiverId: string, userId: string) {
    // Verificar se o usuário é o próprio paciente ou profissional
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patient: true,
        professional: {
          include: {
            patients: {
              where: { patientId },
            },
          },
        },
      },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const isOwnPatient = user.patient && user.patient.id === patientId
    const isProfessional = user.professional && user.professional.patients.length > 0

    if (!isOwnPatient && !isProfessional) {
      throw new Error('Acesso negado')
    }

    // Verificar se cuidador existe
    const caregiver = await prisma.caregiver.findUnique({
      where: { id: caregiverId },
    })

    if (!caregiver) {
      throw new Error('Cuidador não encontrado')
    }

    // Criar vínculo (ou ignorar se já existe)
    await prisma.patientCaregiver.upsert({
      where: {
        patientId_caregiverId: {
          patientId,
          caregiverId,
        },
      },
      create: {
        patientId,
        caregiverId,
      },
      update: {},
    })

    return {
      success: true,
      message: 'Cuidador vinculado com sucesso',
    }
  }

  // Desvincular cuidador
  async unlinkCaregiver(patientId: string, caregiverId: string, userId: string) {
    // Verificar acesso
    await this.verifyPatientAccess(patientId, userId)

    await prisma.patientCaregiver.delete({
      where: {
        patientId_caregiverId: {
          patientId,
          caregiverId,
        },
      },
    })

    return {
      success: true,
      message: 'Cuidador desvinculado com sucesso',
    }
  }

  // Vincular profissional ao paciente
  async linkProfessional(patientId: string, professionalId: string, userId: string) {
    await this.verifyPatientAccess(patientId, userId)

    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
    })

    if (!professional) {
      throw new Error('Profissional não encontrado')
    }

    await prisma.patientProfessional.upsert({
      where: {
        patientId_professionalId: {
          patientId,
          professionalId,
        },
      },
      create: {
        patientId,
        professionalId,
      },
      update: {},
    })

    return {
      success: true,
      message: 'Profissional vinculado com sucesso',
    }
  }

  // Desvincular profissional
  async unlinkProfessional(patientId: string, professionalId: string, userId: string) {
    await this.verifyPatientAccess(patientId, userId)

    await prisma.patientProfessional.delete({
      where: {
        patientId_professionalId: {
          patientId,
          professionalId,
        },
      },
    })

    return {
      success: true,
      message: 'Profissional desvinculado com sucesso',
    }
  }

  // Helpers
  private formatPatient(patient: any) {
    return {
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth.toISOString(),
      age: this.calculateAge(patient.dateOfBirth),
      gender: patient.gender,
      bloodType: patient.bloodType,
      conditions: patient.conditions,
      allergies: patient.allergies,
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
    }
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  private async verifyPatientAccess(patientId: string, userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patient: true,
        caregiver: {
          include: {
            patients: {
              where: { patientId },
            },
          },
        },
        professional: {
          include: {
            patients: {
              where: { patientId },
            },
          },
        },
      },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    if (user.patient && user.patient.id === patientId) return true
    if (user.caregiver && user.caregiver.patients.length > 0) return true
    if (user.professional && user.professional.patients.length > 0) return true

    throw new Error('Acesso negado')
  }
}

export const patientsService = new PatientsService()
