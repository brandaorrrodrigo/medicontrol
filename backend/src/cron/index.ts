import { medicationRemindersCron } from './medication-reminders.cron'
import { consultationRemindersCron } from './consultation-reminders.cron'

export class CronService {
  // Iniciar todos os cron jobs
  startAll() {
    console.log('[CRON] Iniciando sistema de cron jobs...')
    medicationRemindersCron.start()
    consultationRemindersCron.start()
    console.log('[CRON] Todos os cron jobs iniciados com sucesso')
  }

  // Parar todos os cron jobs
  stopAll() {
    console.log('[CRON] Parando sistema de cron jobs...')
    medicationRemindersCron.stop()
    consultationRemindersCron.stop()
    console.log('[CRON] Todos os cron jobs parados')
  }
}

export const cronService = new CronService()
