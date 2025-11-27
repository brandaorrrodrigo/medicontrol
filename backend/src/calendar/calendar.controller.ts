import { Request, Response } from 'express'
import { calendarService } from './calendar.service'

export class CalendarController {
  // GET /api/calendar/events?month=X&year=Y
  async getEvents(req: Request, res: Response) {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      const month = req.query.month ? parseInt(req.query.month as string) : undefined
      const year = req.query.year ? parseInt(req.query.year as string) : undefined

      const events = await calendarService.getMonthEvents(userId, month, year)

      return res.json(events)
    } catch (error) {
      console.error('Error getting calendar events:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export const calendarController = new CalendarController()
