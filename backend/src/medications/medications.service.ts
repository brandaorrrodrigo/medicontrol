import { prisma } from '../database/prisma'
import type { CreateMedicationInput, UpdateMedicationInput } from './medications.validator'

export class MedicationsService {
  // Listar medicamentos de um paciente
  async getMedications(patientId: string, activeOnly: boolean = false) {
    const medications = await prisma.medication.findMany({
      where: {
        patientId,
        ...(activeOnly && { active: true }),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        schedules: {
          where: {
            scheduledFor: { gte: new Date() },
            taken: false,
          },
          orderBy: { scheduledFor: 'asc' },
          take: 5,
        },
      },
    })

    return medications.map((med) => ({
      id: med.id,
      patientId: med.patientId,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      startDate: med.startDate.toISOString(),
      endDate: med.endDate?.toISOString(),
      instructions: med.instructions,
      prescribedBy: med.prescribedBy,
      active: med.active,
      createdAt: med.createdAt.toISOString(),
      updatedAt: med.updatedAt.toISOString(),
      upcomingSchedules: med.schedules.map((s) => ({
        id: s.id,
        scheduledFor: s.scheduledFor.toISOString(),
        taken: s.taken,
      })),
    }))
  }

  // Obter um medicamento específico
  async getMedicationById(medicationId: string) {
    const medication = await prisma.medication.findUnique({
      where: { id: medicationId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
        schedules: {
          orderBy: { scheduledFor: 'desc' },
          take: 10,
        },
      },
    })

    if (!medication) {
      throw new Error('Medicamento não encontrado')
    }

    return {
      id: medication.id,
      patientId: medication.patientId,
      patientName: medication.patient.name,
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      startDate: medication.startDate.toISOString(),
      endDate: medication.endDate?.toISOString(),
      instructions: medication.instructions,
      prescribedBy: medication.prescribedBy,
      active: medication.active,
      createdAt: medication.createdAt.toISOString(),
      updatedAt: medication.updatedAt.toISOString(),
      schedules: medication.schedules.map((s) => ({
        id: s.id,
        scheduledFor: s.scheduledFor.toISOString(),
        taken: s.taken,
        takenAt: s.takenAt?.toISOString(),
      })),
    }
  }

  // Criar medicamento
  async createMedication(data: CreateMedicationInput, userId: string) {
    // Verificar se o usuário tem acesso a esse paciente
    await this.verifyPatientAccess(data.patientId, userId)

    const medication = await prisma.medication.create({
      data: {
        patientId: data.patientId,
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        instructions: data.instructions,
        prescribedBy: data.prescribedBy,
        active: true,
      },
    })

    return {
      id: medication.id,
      patientId: medication.patientId,
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      startDate: medication.startDate.toISOString(),
      endDate: medication.endDate?.toISOString(),
      instructions: medication.instructions,
      prescribedBy: medication.prescribedBy,
      active: medication.active,
      createdAt: medication.createdAt.toISOString(),
    }
  }

  // Atualizar medicamento
  async updateMedication(medicationId: string, data: UpdateMedicationInput, userId: string) {
    const medication = await prisma.medication.findUnique({
      where: { id: medicationId },
    })

    if (!medication) {
      throw new Error('Medicamento não encontrado')
    }

    // Verificar acesso
    await this.verifyPatientAccess(medication.patientId, userId)

    const updated = await prisma.medication.update({
      where: { id: medicationId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.dosage && { dosage: data.dosage }),
        ...(data.frequency && { frequency: data.frequency }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && {
          endDate: data.endDate ? new Date(data.endDate) : null,
        }),
        ...(data.instructions !== undefined && { instructions: data.instructions }),
        ...(data.prescribedBy !== undefined && { prescribedBy: data.prescribedBy }),
        ...(data.active !== undefined && { active: data.active }),
      },
    })

    return {
      id: updated.id,
      patientId: updated.patientId,
      name: updated.name,
      dosage: updated.dosage,
      frequency: updated.frequency,
      startDate: updated.startDate.toISOString(),
      endDate: updated.endDate?.toISOString(),
      instructions: updated.instructions,
      prescribedBy: updated.prescribedBy,
      active: updated.active,
      updatedAt: updated.updatedAt.toISOString(),
    }
  }

  // Deletar medicamento
  async deleteMedication(medicationId: string, userId: string) {
    const medication = await prisma.medication.findUnique({
      where: { id: medicationId },
    })

    if (!medication) {
      throw new Error('Medicamento não encontrado')
    }

    // Verificar acesso
    await this.verifyPatientAccess(medication.patientId, userId)

    // Soft delete (marcar como inativo) ao invés de deletar
    await prisma.medication.update({
      where: { id: medicationId },
      data: { active: false },
    })

    return { success: true }
  }

  // Verificar se o usuário tem acesso ao paciente
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

    // Paciente pode acessar seus próprios medicamentos
    if (user.patient && user.patient.id === patientId) {
      return true
    }

    // Cuidador pode acessar medicamentos dos pacientes sob seus cuidados
    if (user.caregiver && user.caregiver.patients.length > 0) {
      return true
    }

    // Profissional pode acessar medicamentos dos seus pacientes
    if (user.professional && user.professional.patients.length > 0) {
      return true
    }

    throw new Error('Acesso negado')
  }
}

export const medicationsService = new MedicationsService()
