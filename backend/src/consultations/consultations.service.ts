// @ts-nocheck
import { prisma } from '../database/prisma'
import type { CreateConsultationInput, UpdateConsultationInput } from './consultations.validator'
import { notificationsService } from '../notifications/notifications.service'

export class ConsultationsService {
  // Listar consultas de um paciente
  async getConsultations(patientId: string) {
    const consultations = await prisma.consultation.findMany({
      where: { patientId },
      orderBy: { date: 'asc' },
      include: {
        professional: {
          select: {
            id: true,
            name: true,
            specialty: true,
            crm: true,
          },
        },
      },
    })

    return consultations.map((c) => ({
      id: c.id,
      patientId: c.patientId,
      professionalId: c.professionalId,
      professional: c.professional,
      date: c.date.toISOString(),
      type: c.type,
      duration: c.duration,
      notes: c.notes,
      diagnosis: c.diagnosis,
      createdAt: c.createdAt.toISOString(),
    }))
  }

  // Listar consultas de um profissional
  async getConsultationsByProfessional(professionalId: string) {
    const consultations = await prisma.consultation.findMany({
      where: { professionalId },
      orderBy: { date: 'asc' },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            dateOfBirth: true,
          },
        },
      },
    })

    return consultations.map((c) => ({
      id: c.id,
      patientId: c.patientId,
      patient: c.patient,
      professionalId: c.professionalId,
      date: c.date.toISOString(),
      type: c.type,
      duration: c.duration,
      notes: c.notes,
      diagnosis: c.diagnosis,
      createdAt: c.createdAt.toISOString(),
    }))
  }

  // Obter detalhes de uma consulta
  async getConsultationById(consultationId: string) {
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            dateOfBirth: true,
            gender: true,
            bloodType: true,
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
      },
    })

    if (!consultation) {
      throw new Error('Consulta não encontrada')
    }

    return {
      id: consultation.id,
      patientId: consultation.patientId,
      patient: consultation.patient,
      professionalId: consultation.professionalId,
      professional: consultation.professional,
      date: consultation.date.toISOString(),
      type: consultation.type,
      duration: consultation.duration,
      notes: consultation.notes,
      diagnosis: consultation.diagnosis,
      createdAt: consultation.createdAt.toISOString(),
      updatedAt: consultation.updatedAt.toISOString(),
    }
  }

  // Criar consulta
  async createConsultation(data: CreateConsultationInput, userId: string) {
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
      throw new Error('Apenas profissionais podem criar consultas')
    }

    if (user.professional.patients.length === 0) {
      throw new Error('Você não tem acesso a este paciente')
    }

    // Criar consulta
    const consultation = await prisma.consultation.create({
      data: {
        patientId: data.patientId,
        professionalId: user.professional.id,
        date: new Date(data.date),
        type: data.type as any,
        duration: data.duration || 60,
        notes: data.notes,
        diagnosis: data.diagnosis,
        location: data.location,
        status: data.status as any,
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    })

    // Criar notificação para o paciente
    await notificationsService.createNotification({
      userId: consultation.patient.user.id,
      title: 'Nova Consulta Agendada',
      message: `Você tem uma consulta agendada com ${user.professional.name} em ${new Date(data.date).toLocaleDateString('pt-BR')}`,
      type: 'INFO',
    })

    return {
      id: consultation.id,
      patientId: consultation.patientId,
      professionalId: consultation.professionalId,
      date: consultation.date.toISOString(),
      type: consultation.type,
      duration: consultation.duration,
      notes: consultation.notes,
      diagnosis: consultation.diagnosis,
      createdAt: consultation.createdAt.toISOString(),
    }
  }

  // Atualizar consulta
  async updateConsultation(consultationId: string, data: UpdateConsultationInput, userId: string) {
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        professional: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!consultation) {
      throw new Error('Consulta não encontrada')
    }

    // Verificar se é o profissional que criou a consulta
    if (consultation.professional.user.id !== userId) {
      throw new Error('Apenas o profissional que criou a consulta pode alterá-la')
    }

    const updated = await prisma.consultation.update({
      where: { id: consultationId },
      data: {
        ...(data.date && { date: new Date(data.date) }),
        ...(data.type && { type: data.type as any }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.diagnosis !== undefined && { diagnosis: data.diagnosis }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.status && { status: data.status as any }),
      },
    })

    return {
      id: updated.id,
      date: updated.date.toISOString(),
      type: updated.type,
      duration: updated.duration,
      notes: updated.notes,
      diagnosis: updated.diagnosis,
      updatedAt: updated.updatedAt.toISOString(),
    }
  }

  // Atualizar status da consulta
  // NOTA: Campo 'status' não existe no schema atual do Prisma
  // Esta função está comentada até que o campo seja adicionado ao schema
  /*
  async updateStatus(
    consultationId: string,
    status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    userId: string
  ) {
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        professional: {
          include: {
            user: true,
          },
        },
        patient: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!consultation) {
      throw new Error('Consulta não encontrada')
    }

    // Verificar se é o profissional que criou a consulta
    if (consultation.professional.user.id !== userId) {
      throw new Error('Acesso negado')
    }

    const updated = await prisma.consultation.update({
      where: { id: consultationId },
      data: { status },
    })

    // Notificar paciente sobre mudança de status
    const statusMessages = {
      SCHEDULED: 'agendada',
      CONFIRMED: 'confirmada',
      IN_PROGRESS: 'em andamento',
      COMPLETED: 'concluída',
      CANCELLED: 'cancelada',
    }

    await notificationsService.createNotification({
      userId: consultation.patient.user.id,
      title: 'Status da Consulta Atualizado',
      message: `Sua consulta foi ${statusMessages[status]}`,
      type: status === 'CANCELLED' ? 'WARNING' : 'INFO',
    })

    return {
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt.toISOString(),
    }
  }
  */

  // Deletar consulta
  async deleteConsultation(consultationId: string, userId: string) {
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        professional: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!consultation) {
      throw new Error('Consulta não encontrada')
    }

    if (consultation.professional.user.id !== userId) {
      throw new Error('Acesso negado')
    }

    await prisma.consultation.delete({
      where: { id: consultationId },
    })

    return { success: true }
  }
}

export const consultationsService = new ConsultationsService()
