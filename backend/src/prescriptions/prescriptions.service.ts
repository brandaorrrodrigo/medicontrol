// @ts-nocheck
import { prisma } from '../database/prisma'
import type { CreatePrescriptionInput, UpdatePrescriptionInput, AddItemInput } from './prescriptions.validator'
import { notificationsService } from '../notifications/notifications.service'

export class PrescriptionsService {
  // Listar prescrições de um paciente
  async getPrescriptions(patientId: string) {
    const prescriptions = await prisma.prescription.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
      include: {
        professional: {
          select: {
            id: true,
            name: true,
            specialty: true,
            crm: true,
          },
        },
        items: {
          include: {
            medication: {
              select: {
                id: true,
                active: true,
              },
            },
          },
        },
      },
    })

    return prescriptions.map((p) => ({
      id: p.id,
      patientId: p.patientId,
      professionalId: p.professionalId,
      professional: p.professional,
      date: p.date.toISOString(),
      notes: p.notes,
      createdAt: p.createdAt.toISOString(),
      items: p.items.map((item) => ({
        id: item.id,
        medicationName: item.medicationName,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        instructions: item.instructions,
        medicationId: item.medicationId,
        isActive: item.medication?.active || false,
      })),
    }))
  }

  // Obter detalhes de uma prescrição
  async getPrescriptionById(prescriptionId: string) {
    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
        professional: {
          select: {
            id: true,
            name: true,
            specialty: true,
            crm: true,
          },
        },
        items: {
          include: {
            medication: true,
          },
        },
      },
    })

    if (!prescription) {
      throw new Error('Prescrição não encontrada')
    }

    return {
      id: prescription.id,
      patientId: prescription.patientId,
      patientName: prescription.patient.name,
      professionalId: prescription.professionalId,
      professional: prescription.professional,
      date: prescription.date.toISOString(),
      notes: prescription.notes,
      createdAt: prescription.createdAt.toISOString(),
      items: prescription.items.map((item) => ({
        id: item.id,
        medicationName: item.medicationName,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        instructions: item.instructions,
        medicationId: item.medicationId,
        medication: item.medication,
      })),
    }
  }

  // Criar prescrição
  async createPrescription(data: CreatePrescriptionInput, userId: string) {
    // Verificar se é um profissional
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        professional: {
          include: {
            patients: {
              where: { patientId: data.patientId },
            },
          },
        },
      },
    })

    if (!user || !user.professional) {
      throw new Error('Apenas profissionais podem criar prescrições')
    }

    if (user.professional.patients.length === 0) {
      throw new Error('Você não tem acesso a este paciente')
    }

    // Criar prescrição com itens
    const prescription = await prisma.prescription.create({
      data: {
        patientId: data.patientId,
        professionalId: user.professional.id,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            medicationName: item.medicationName,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions,
          })),
        },
      },
      include: {
        items: true,
        patient: {
          include: {
            user: true,
          },
        },
      },
    })

    // Criar notificação para o paciente
    await notificationsService.createNotification({
      userId: prescription.patient.user.id,
      title: 'Nova Prescrição',
      message: `Você recebeu uma nova prescrição médica de ${user.professional.name}`,
      type: 'INFO',
    })

    return {
      id: prescription.id,
      patientId: prescription.patientId,
      professionalId: prescription.professionalId,
      date: prescription.date.toISOString(),
      notes: prescription.notes,
      itemsCount: prescription.items.length,
      createdAt: prescription.createdAt.toISOString(),
    }
  }

  // Atualizar prescrição
  async updatePrescription(prescriptionId: string, data: UpdatePrescriptionInput, userId: string) {
    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        professional: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!prescription) {
      throw new Error('Prescrição não encontrada')
    }

    // Verificar se é o profissional que criou a prescrição
    if (prescription.professional.user.id !== userId) {
      throw new Error('Apenas o profissional que criou a prescrição pode alterá-la')
    }

    const updated = await prisma.prescription.update({
      where: { id: prescriptionId },
      data: {
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    })

    return {
      id: updated.id,
      notes: updated.notes,
      updatedAt: updated.updatedAt.toISOString(),
    }
  }

  // Adicionar item à prescrição
  async addItem(prescriptionId: string, data: AddItemInput, userId: string) {
    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        professional: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!prescription) {
      throw new Error('Prescrição não encontrada')
    }

    if (prescription.professional.user.id !== userId) {
      throw new Error('Acesso negado')
    }

    const item = await prisma.prescriptionItem.create({
      data: {
        prescriptionId,
        medicationName: data.medicationName,
        dosage: data.dosage,
        frequency: data.frequency,
        duration: data.duration,
        instructions: data.instructions,
      },
    })

    return {
      id: item.id,
      medicationName: item.medicationName,
      dosage: item.dosage,
      frequency: item.frequency,
      createdAt: item.createdAt.toISOString(),
    }
  }

  // Remover item da prescrição
  async removeItem(itemId: string, userId: string) {
    const item = await prisma.prescriptionItem.findUnique({
      where: { id: itemId },
      include: {
        prescription: {
          include: {
            professional: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    })

    if (!item) {
      throw new Error('Item não encontrado')
    }

    if (item.prescription.professional.user.id !== userId) {
      throw new Error('Acesso negado')
    }

    await prisma.prescriptionItem.delete({
      where: { id: itemId },
    })

    return { success: true }
  }

  // Deletar prescrição
  async deletePrescription(prescriptionId: string, userId: string) {
    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        professional: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!prescription) {
      throw new Error('Prescrição não encontrada')
    }

    if (prescription.professional.user.id !== userId) {
      throw new Error('Acesso negado')
    }

    await prisma.prescription.delete({
      where: { id: prescriptionId },
    })

    return { success: true }
  }
}

export const prescriptionsService = new PrescriptionsService()
