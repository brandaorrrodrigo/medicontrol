import { Request, Response, NextFunction } from 'express'
import { remindersService } from './reminders.service'

export class RemindersController {
  // GET /api/reminders/upcoming?patientId=xxx&limit=10
  async getUpcomingReminders(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { patientId, limit } = req.query

      if (!patientId || typeof patientId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'patientId é obrigatório',
        })
      }

      const limitNum = limit ? parseInt(limit as string) : 10
      const reminders = await remindersService.getUpcomingReminders(patientId, limitNum)

      return res.status(200).json({ success: true, data: reminders })
    } catch (error) {
      return next(error)
    }
  }

  // GET /api/reminders/today?patientId=xxx
  async getTodayReminders(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { patientId } = req.query

      if (!patientId || typeof patientId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'patientId é obrigatório',
        })
      }

      const reminders = await remindersService.getTodayReminders(patientId)

      return res.status(200).json({ success: true, data: reminders })
    } catch (error) {
      return next(error)
    }
  }

  // POST /api/reminders/:id/mark-taken
  async markAsTaken(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const { notes } = req.body

      const result = await remindersService.markAsTaken(id, userId, notes)

      return res.status(200).json({ success: true, data: result })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }

  // POST /api/reminders
  async createReminder(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { medicationId, patientId, scheduledFor } = req.body

      if (!medicationId || !patientId || !scheduledFor) {
        return res.status(400).json({
          success: false,
          error: 'medicationId, patientId e scheduledFor são obrigatórios',
        })
      }

      const reminder = await remindersService.createReminder({
        medicationId,
        patientId,
        scheduledFor,
      })

      return res.status(201).json({ success: true, data: reminder })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }

  // DELETE /api/reminders/:id
  async deleteReminder(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const result = await remindersService.deleteReminder(id, userId)

      return res.status(200).json({ success: true, data: result })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }
}

export const remindersController = new RemindersController()
