import { Router } from 'express'
import { authenticate } from '../auth/auth.middleware'
import {
  listAlerts,
  countUnreadAlerts,
  markAlertAsRead,
  resolveAlert,
  readAllAlerts,
  refreshAlerts,
} from './alerts.controller'

const router = Router()

// Todas as rotas de alertas exigem usuário autenticado
router.use(authenticate)

// GET /api/alerts - listar alertas do usuário logado
router.get('/', listAlerts)

// GET /api/alerts/count - contar alertas não lidos
router.get('/count', countUnreadAlerts)

// PATCH /api/alerts/:id/read - marcar alerta como lido
router.patch('/:id/read', markAlertAsRead)

// PATCH /api/alerts/:id/resolve - marcar alerta como resolvido
router.patch('/:id/resolve', resolveAlert)

// POST /api/alerts/read-all - marcar todos como lidos
router.post('/read-all', readAllAlerts)

// POST /api/alerts/refresh - regenerar alertas (DEBUG)
router.post('/refresh', refreshAlerts)

export default router
