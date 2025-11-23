import cron from 'node-cron'
import { prisma } from '../database/prisma'
import { notificationsService } from '../notifications/notifications.service'

export class MedicationRemindersCron {
  private task: cron.ScheduledTask | null = null

  // Iniciar cron job
  start() {
    // Rodar a cada 30 minutos
    this.task = cron.schedule('*/30 * * * *', async () => {
      console.log('[CRON] Verificando lembretes de medicamentos...')
      await this.checkUpcomingMedications()
    })

    console.log('[CRON] Sistema de lembretes automatizados iniciado')
  }

  // Parar cron job
  stop() {
    if (this.task) {
      this.task.stop()
      console.log('[CRON] Sistema de lembretes automatizados parado')
    }
  }

  // Verificar medicamentos próximos
  private async checkUpcomingMedications() {
    try {
      const now = new Date()
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)

      // Buscar schedules que estão próximos de serem tomados
      const upcomingSchedules = await prisma.medicationSchedule.findMany({
        where: {
          scheduledFor: {
            gte: now,
            lte: oneHourFromNow,
          },
          taken: false,
        },
        include: {
          medication: {
            include: {
              patient: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      })

      console.log(`[CRON] ${upcomingSchedules.length} lembretes encontrados`)

      // Criar notificações para cada schedule
      for (const schedule of upcomingSchedules) {
        // Verificar se já existe uma notificação recente para este lembrete
        const recentNotification = await prisma.notification.findFirst({
          where: {
            userId: schedule.medication.patient.user.id,
            title: 'Lembrete de Medicamento',
            createdAt: {
              gte: new Date(now.getTime() - 30 * 60 * 1000), // Últimos 30 minutos
            },
          },
        })

        // Só criar notificação se não houver uma recente
        if (!recentNotification) {
          const timeUntil = this.getTimeUntilDescription(schedule.scheduledFor)

          await notificationsService.createNotification({
            userId: schedule.medication.patient.user.id,
            title: 'Lembrete de Medicamento',
            message: `${timeUntil}: ${schedule.medication.name} - ${schedule.medication.dosage}`,
            type: 'WARNING',
          })

          console.log(`[CRON] Notificação criada para ${schedule.medication.patient.user.email}`)
        }
      }
    } catch (error) {
      console.error('[CRON] Erro ao verificar lembretes:', error)
    }
  }

  // Calcular descrição do tempo até o lembrete
  private getTimeUntilDescription(scheduledFor: Date): string {
    const now = new Date()
    const diffMs = scheduledFor.getTime() - now.getTime()
    const diffMinutes = Math.round(diffMs / (1000 * 60))

    if (diffMinutes <= 0) {
      return 'Agora'
    } else if (diffMinutes <= 15) {
      return `Em ${diffMinutes} minutos`
    } else if (diffMinutes <= 45) {
      return `Em ${diffMinutes} minutos`
    } else {
      return 'Em aproximadamente 1 hora'
    }
  }
}

export const medicationRemindersCron = new MedicationRemindersCron()
