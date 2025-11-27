// @ts-nocheck
import { prisma } from '../database/prisma'
import { notificationsService } from '../notifications/notifications.service'

export class RemindersService {
  // Listar lembretes futuros de um paciente
  async getUpcomingReminders(patientId: string, limit: number = 10) {
    const reminders = await prisma.medicationSchedule.findMany({
      where: {
        patientId,
        scheduledFor: {
          gte: new Date(),
        },
      },
      orderBy: { scheduledFor: 'asc' },
      take: limit,
      include: {
        medication: true,
      },
    })

    return reminders.map((r) => ({
      id: r.id,
      medicationId: r.medicationId,
      medicationName: r.medication.name,
      patientId: r.patientId,
      dosage: r.medication.dosage,
      scheduledFor: r.scheduledFor.toISOString(),
      taken: r.taken,
      takenAt: r.takenAt?.toISOString(),
      notes: r.notes,
    }))
  }

  // Obter lembretes de hoje
  async getTodayReminders(patientId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const reminders = await prisma.medicationSchedule.findMany({
      where: {
        patientId,
        scheduledFor: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: { scheduledFor: 'asc' },
      include: {
        medication: true,
      },
    })

    return reminders.map((r) => ({
      id: r.id,
      medicationId: r.medicationId,
      medicationName: r.medication.name,
      dosage: r.medication.dosage,
      scheduledFor: r.scheduledFor.toISOString(),
      taken: r.taken,
      takenAt: r.takenAt?.toISOString(),
    }))
  }

  // Marcar lembrete como tomado
  async markAsTaken(reminderId: string, userId: string, notes?: string) {
    const reminder = await prisma.medicationSchedule.findUnique({
      where: { id: reminderId },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        medication: true,
      },
    })

    if (!reminder) {
      throw new Error('Lembrete não encontrado')
    }

    // Verificar acesso
    await this.verifyReminderAccess(reminder.patientId, userId)

    // Atualizar lembrete
    const updated = await prisma.medicationSchedule.update({
      where: { id: reminderId },
      data: {
        taken: true,
        takenAt: new Date(),
        notes,
      },
    })

    // Criar notificação de sucesso
    await notificationsService.createNotification({
      userId: reminder.patient.user.id,
      title: 'Medicamento tomado',
      message: `${reminder.medication.name} foi registrado como tomado`,
      type: 'SUCCESS',
    })

    return {
      id: updated.id,
      taken: updated.taken,
      takenAt: updated.takenAt?.toISOString(),
    }
  }

  // Criar lembrete manual
  async createReminder(data: {
    medicationId: string
    patientId: string
    scheduledFor: string
  }) {
    const medication = await prisma.medication.findUnique({
      where: { id: data.medicationId },
    })

    if (!medication) {
      throw new Error('Medicamento não encontrado')
    }

    if (medication.patientId !== data.patientId) {
      throw new Error('Medicamento não pertence a esse paciente')
    }

    const reminder = await prisma.medicationSchedule.create({
      data: {
        medicationId: data.medicationId,
        patientId: data.patientId,
        scheduledFor: new Date(data.scheduledFor),
        taken: false,
      },
    })

    return {
      id: reminder.id,
      medicationId: reminder.medicationId,
      patientId: reminder.patientId,
      scheduledFor: reminder.scheduledFor.toISOString(),
      taken: reminder.taken,
    }
  }

  // Deletar lembrete
  async deleteReminder(reminderId: string, userId: string) {
    const reminder = await prisma.medicationSchedule.findUnique({
      where: { id: reminderId },
    })

    if (!reminder) {
      throw new Error('Lembrete não encontrado')
    }

    await this.verifyReminderAccess(reminder.patientId, userId)

    await prisma.medicationSchedule.delete({
      where: { id: reminderId },
    })

    return { success: true }
  }

  // Verificar acesso ao lembrete
  private async verifyReminderAccess(patientId: string, userId: string) {
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

    if (user.patient && user.patient.id === patientId) {
      return true
    }

    if (user.caregiver && user.caregiver.patients.length > 0) {
      return true
    }

    if (user.professional && user.professional.patients.length > 0) {
      return true
    }

    throw new Error('Acesso negado')
  }
}

export const remindersService = new RemindersService()
