import cron from 'node-cron'
import { prisma } from '../database/prisma'
import { notificationsService } from '../notifications/notifications.service'

export class ConsultationRemindersCron {
  private task: cron.ScheduledTask | null = null

  // Iniciar cron job
  start() {
    // Rodar a cada 1 hora
    this.task = cron.schedule('0 * * * *', async () => {
      console.log('[CRON] Verificando lembretes de consultas...')
      await this.checkUpcomingConsultations()
    })

    console.log('[CRON] Sistema de lembretes de consultas iniciado')
  }

  // Parar cron job
  stop() {
    if (this.task) {
      this.task.stop()
      console.log('[CRON] Sistema de lembretes de consultas parado')
    }
  }

  // Verificar consultas próximas
  private async checkUpcomingConsultations() {
    try {
      const now = new Date()
      const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      // Buscar consultas confirmadas ou agendadas nas próximas 24 horas
      const upcomingConsultations = await prisma.consultation.findMany({
        where: {
          date: {
            gte: now,
            lte: twentyFourHoursFromNow,
          },
          status: {
            in: ['SCHEDULED', 'CONFIRMED'],
          },
        },
        include: {
          patient: {
            include: {
              user: true,
            },
          },
          professional: {
            include: {
              user: true,
            },
          },
        },
      })

      console.log(`[CRON] ${upcomingConsultations.length} consultas próximas encontradas`)

      // Criar notificações para cada consulta
      for (const consultation of upcomingConsultations) {
        const timeUntil = this.getTimeUntilDescription(consultation.date)

        // Verificar se já existe uma notificação recente para esta consulta (para o paciente)
        const recentPatientNotification = await prisma.notification.findFirst({
          where: {
            userId: consultation.patient.user.id,
            title: 'Lembrete de Consulta',
            createdAt: {
              gte: new Date(now.getTime() - 2 * 60 * 60 * 1000), // Últimas 2 horas
            },
          },
        })

        // Notificar paciente
        if (!recentPatientNotification) {
          await notificationsService.createNotification({
            userId: consultation.patient.user.id,
            title: 'Lembrete de Consulta',
            message: `${timeUntil}: Consulta com ${consultation.professional.name}`,
            type: 'WARNING',
          })

          console.log(`[CRON] Notificação criada para paciente ${consultation.patient.user.email}`)
        }

        // Verificar se já existe uma notificação recente para esta consulta (para o profissional)
        const recentProfessionalNotification = await prisma.notification.findFirst({
          where: {
            userId: consultation.professional.user.id,
            title: 'Lembrete de Consulta',
            createdAt: {
              gte: new Date(now.getTime() - 2 * 60 * 60 * 1000), // Últimas 2 horas
            },
          },
        })

        // Notificar profissional
        if (!recentProfessionalNotification) {
          await notificationsService.createNotification({
            userId: consultation.professional.user.id,
            title: 'Lembrete de Consulta',
            message: `${timeUntil}: Consulta com ${consultation.patient.name}`,
            type: 'INFO',
          })

          console.log(`[CRON] Notificação criada para profissional ${consultation.professional.user.email}`)
        }
      }
    } catch (error) {
      console.error('[CRON] Erro ao verificar lembretes de consultas:', error)
    }
  }

  // Calcular descrição do tempo até a consulta
  private getTimeUntilDescription(date: Date): string {
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))

    if (diffHours <= 1) {
      return 'Em menos de 1 hora'
    } else if (diffHours <= 3) {
      return `Em ${diffHours} horas`
    } else if (diffHours <= 12) {
      return `Hoje em ${diffHours} horas`
    } else {
      return 'Amanhã'
    }
  }
}

export const consultationRemindersCron = new ConsultationRemindersCron()
