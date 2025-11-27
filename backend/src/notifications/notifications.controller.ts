import { Request, Response, NextFunction } from 'express'
import { notificationsService } from './notifications.service'
import {
  validateGetNotificationsQuery,
  validateUpdatePreferences,
  validateGetExamAlertsQuery,
  validateResolveAlert
} from './notifications.validator'

// ============================================================================
// NOTIFICATIONS CONTROLLER
// ============================================================================

export class NotificationsController {
  // ==========================================================================
  // GET /api/notifications
  // Obter notificações do usuário com filtros
  // ==========================================================================

  async getNotifications(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id

      // Validar query parameters
      const validation = validateGetNotificationsQuery(req.query)
      if (!validation.success) {
        res.status(400).json({
          error: 'Parâmetros inválidos',
          details: validation.error.errors
        })
        return
      }

      const { category, read, limit, offset } = validation.data

      const notifications = await notificationsService.getUserNotifications(userId, {
        category,
        read,
        limit,
        offset
      })

      res.json({
        success: true,
        data: {
          count: notifications.length,
          notifications
        }
      })
    } catch (error: any) {
      console.error('Erro ao buscar notificações:', error)
      res.status(500).json({
        error: 'Erro ao buscar notificações'
      })
    }
  }

  // ==========================================================================
  // GET /api/notifications/unread-count
  // Obter contagem de não lidas
  // ==========================================================================

  async getUnreadCount(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id

      const count = await notificationsService.getUnreadCount(userId)

      res.json({
        success: true,
        data: { count }
      })
    } catch (error: any) {
      console.error('Erro ao buscar contagem:', error)
      res.status(500).json({
        error: 'Erro ao buscar contagem de notificações'
      })
    }
  }

  // ==========================================================================
  // PATCH /api/notifications/:id/read
  // Marcar notificação como lida
  // ==========================================================================

  async markAsRead(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id
      const { id } = req.params

      const notification = await notificationsService.markAsRead(id, userId)

      res.json({
        success: true,
        data: notification
      })
    } catch (error: any) {
      console.error('Erro ao marcar como lida:', error)

      if (error.message.includes('não encontrada')) {
        res.status(404).json({ error: error.message })
        return
      }

      res.status(500).json({
        error: 'Erro ao marcar notificação como lida'
      })
    }
  }

  // ==========================================================================
  // PATCH /api/notifications/read-all
  // Marcar todas como lidas
  // ==========================================================================

  async markAllAsRead(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id

      const result = await notificationsService.markAllAsRead(userId)

      res.json({
        success: true,
        data: { count: result.count }
      })
    } catch (error: any) {
      console.error('Erro ao marcar todas como lidas:', error)
      res.status(500).json({
        error: 'Erro ao marcar todas notificações como lidas'
      })
    }
  }

  // ==========================================================================
  // GET /api/notifications/preferences
  // Obter preferências de notificação
  // ==========================================================================

  async getPreferences(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id

      const preferences = await notificationsService.getUserPreferences(userId)

      res.json({
        success: true,
        data: preferences
      })
    } catch (error: any) {
      console.error('Erro ao buscar preferências:', error)
      res.status(500).json({
        error: 'Erro ao buscar preferências de notificação'
      })
    }
  }

  // ==========================================================================
  // PATCH /api/notifications/preferences
  // Atualizar preferências de notificação
  // ==========================================================================

  async updatePreferences(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id

      // Validar body
      const validation = validateUpdatePreferences(req.body)
      if (!validation.success) {
        res.status(400).json({
          error: 'Dados inválidos',
          details: validation.error.errors
        })
        return
      }

      const preferences = await notificationsService.updateUserPreferences(
        userId,
        validation.data
      )

      res.json({
        success: true,
        data: preferences
      })
    } catch (error: any) {
      console.error('Erro ao atualizar preferências:', error)
      res.status(500).json({
        error: 'Erro ao atualizar preferências de notificação'
      })
    }
  }

  // ==========================================================================
  // GET /api/notifications/exam-alerts/:patientId
  // Obter alertas de exame de um paciente
  // ==========================================================================

  async getExamAlerts(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { patientId } = req.params

      // Validar query parameters
      const validation = validateGetExamAlertsQuery(req.query)
      if (!validation.success) {
        res.status(400).json({
          error: 'Parâmetros inválidos',
          details: validation.error.errors
        })
        return
      }

      const { severity, acknowledged, resolved, limit } = validation.data

      // TODO: Validar que usuário tem acesso ao paciente
      // Por enquanto, service já faz essa validação

      const alerts = await notificationsService.getPatientExamAlerts(patientId, {
        severity,
        acknowledged,
        resolved,
        limit
      })

      res.json({
        success: true,
        data: {
          patientId,
          count: alerts.length,
          alerts
        }
      })
    } catch (error: any) {
      console.error('Erro ao buscar alertas de exame:', error)
      res.status(500).json({
        error: 'Erro ao buscar alertas de exame'
      })
    }
  }

  // ==========================================================================
  // PATCH /api/notifications/exam-alerts/:alertId/acknowledge
  // Reconhecer um alerta (acknowledge)
  // ==========================================================================

  async acknowledgeAlert(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id
      const { alertId } = req.params

      const alert = await notificationsService.acknowledgeAlert(alertId, userId)

      res.json({
        success: true,
        data: alert
      })
    } catch (error: any) {
      console.error('Erro ao reconhecer alerta:', error)
      res.status(500).json({
        error: 'Erro ao reconhecer alerta'
      })
    }
  }

  // ==========================================================================
  // PATCH /api/notifications/exam-alerts/:alertId/resolve
  // Resolver um alerta
  // ==========================================================================

  async resolveAlert(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id
      const { alertId } = req.params

      // Validar body
      const validation = validateResolveAlert(req.body)
      if (!validation.success) {
        res.status(400).json({
          error: 'Dados inválidos',
          details: validation.error.errors
        })
        return
      }

      const alert = await notificationsService.resolveAlert(
        alertId,
        userId,
        validation.data.resolutionNotes
      )

      res.json({
        success: true,
        data: alert
      })
    } catch (error: any) {
      console.error('Erro ao resolver alerta:', error)
      res.status(500).json({
        error: 'Erro ao resolver alerta'
      })
    }
  }
}

export const notificationsController = new NotificationsController()
