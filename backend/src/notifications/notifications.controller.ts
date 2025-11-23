import { Request, Response, NextFunction } from 'express'
import { notificationsService } from './notifications.service'

export class NotificationsController {
  // GET /api/notifications
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const onlyUnread = req.query.unread === 'true'
      const notifications = await notificationsService.getNotifications(userId, onlyUnread)

      res.status(200).json({ success: true, data: notifications })
    } catch (error) {
      next(error)
    }
  }

  // POST /api/notifications/:id/read
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const result = await notificationsService.markAsRead(id, userId)

      res.status(200).json({ success: true, data: result })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      next(error)
    }
  }

  // POST /api/notifications/read-all
  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const result = await notificationsService.markAllAsRead(userId)

      res.status(200).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  // DELETE /api/notifications/:id
  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const result = await notificationsService.deleteNotification(id, userId)

      res.status(200).json({ success: true, data: result })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      next(error)
    }
  }

  // GET /api/notifications/unread-count
  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const result = await notificationsService.getUnreadCount(userId)

      res.status(200).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }
}

export const notificationsController = new NotificationsController()
