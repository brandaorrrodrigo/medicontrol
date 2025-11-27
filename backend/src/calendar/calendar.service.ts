import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class CalendarService {
  async getMonthEvents(userId: string, month?: number, year?: number) {
    // Get patient from user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patient: true },
    })

    if (!user || !user.patient) {
      throw new Error('Patient not found')
    }

    const patientId = user.patient.id

    // Get current date or use provided month/year
    const now = new Date()
    const targetMonth = month !== undefined ? month : now.getMonth()
    const targetYear = year !== undefined ? year : now.getFullYear()

    // Calculate start and end of month
    const startOfMonth = new Date(targetYear, targetMonth, 1)
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59)

    // Fetch medications for the month
    const medications = await prisma.medicationSchedule.findMany({
      where: {
        patientId,
        scheduledFor: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        medication: true,
      },
      orderBy: { scheduledFor: 'asc' },
    })

    // Fetch consultations for the month
    const consultations = await prisma.consultation.findMany({
      where: {
        patientId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        professional: true,
      },
      orderBy: { date: 'asc' },
    })

    // Calculate current streak
    const currentStreak = await this.calculateStreak(patientId)

    // Organize events by date
    const events: Record<string, any> = {}

    // Add medications
    medications.forEach((med) => {
      const dateKey = med.scheduledFor.toISOString().split('T')[0]

      if (!events[dateKey]) {
        events[dateKey] = {
          date: med.scheduledFor,
          medications: [],
          consultations: [],
          hasStreak: false,
          isToday: this.isToday(med.scheduledFor),
        }
      }

      events[dateKey].medications.push({
        id: med.id,
        name: med.medication.name,
        time: med.scheduledFor.toTimeString().slice(0, 5),
        taken: med.taken,
        missed: this.isMissed(med.scheduledFor, med.taken),
        dosage: med.medication.dosage,
      })
    })

    // Add consultations
    consultations.forEach((cons) => {
      const dateKey = cons.date.toISOString().split('T')[0]

      if (!events[dateKey]) {
        events[dateKey] = {
          date: cons.date,
          medications: [],
          consultations: [],
          hasStreak: false,
          isToday: this.isToday(cons.date),
        }
      }

      events[dateKey].consultations.push({
        id: cons.id,
        time: cons.date.toTimeString().slice(0, 5),
        doctor: cons.professional.name,
        type: cons.type,
        status: cons.status,
        location: cons.location,
      })
    })

    // Mark streak days
    const streakDays = await this.getStreakDays(patientId)
    streakDays.forEach((day) => {
      const dateKey = day.toISOString().split('T')[0]
      if (events[dateKey]) {
        events[dateKey].hasStreak = true
      }
    })

    return {
      events,
      currentStreak,
      month: targetMonth,
      year: targetYear,
    }
  }

  // Calculate current streak
  private async calculateStreak(patientId: string): Promise<number> {
    const activities = await prisma.activityLog.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
      select: { date: true },
    })

    if (activities.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if has activity today or yesterday
    const lastActivity = new Date(activities[0].date)
    lastActivity.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff > 1) {
      return 0
    }

    // Get unique dates
    const uniqueDates = new Set<string>()
    activities.forEach((activity) => {
      const date = new Date(activity.date)
      date.setHours(0, 0, 0, 0)
      uniqueDates.add(date.toISOString())
    })

    const sortedDates = Array.from(uniqueDates).sort().reverse()

    // Count consecutive days
    let currentDate = new Date(sortedDates[0])

    for (let i = 0; i < sortedDates.length; i++) {
      const activityDate = new Date(sortedDates[i])

      if (activityDate.getTime() === currentDate.getTime()) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  // Get all days with streak
  private async getStreakDays(patientId: string): Promise<Date[]> {
    const activities = await prisma.activityLog.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
      select: { date: true },
    })

    if (activities.length === 0) return []

    const uniqueDates = new Set<string>()
    activities.forEach((activity) => {
      const date = new Date(activity.date)
      date.setHours(0, 0, 0, 0)
      uniqueDates.add(date.toISOString())
    })

    const sortedDates = Array.from(uniqueDates).sort().reverse()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lastActivity = new Date(sortedDates[0])
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff > 1) {
      return []
    }

    const streakDays: Date[] = []
    let currentDate = new Date(sortedDates[0])

    for (let i = 0; i < sortedDates.length; i++) {
      const activityDate = new Date(sortedDates[i])

      if (activityDate.getTime() === currentDate.getTime()) {
        streakDays.push(new Date(activityDate))
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streakDays
  }

  // Check if date is today
  private isToday(date: Date): boolean {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Check if medication is missed
  private isMissed(scheduledFor: Date, taken: boolean): boolean {
    if (taken) return false

    const now = new Date()
    return scheduledFor < now
  }
}

export const calendarService = new CalendarService()
