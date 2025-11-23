import { Router } from 'express'
import { notificationsController } from './notifications.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

// GET /api/notifications?unread=true
router.get('/', (req, res, next) => notificationsController.getNotifications(req, res, next))

// GET /api/notifications/unread-count
router.get('/unread-count', (req, res, next) => notificationsController.getUnreadCount(req, res, next))

// POST /api/notifications/read-all
router.post('/read-all', (req, res, next) => notificationsController.markAllAsRead(req, res, next))

// POST /api/notifications/:id/read
router.post('/:id/read', (req, res, next) => notificationsController.markAsRead(req, res, next))

// DELETE /api/notifications/:id
router.delete('/:id', (req, res, next) => notificationsController.deleteNotification(req, res, next))

export default router
