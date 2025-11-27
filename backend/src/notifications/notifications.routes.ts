import { Router } from 'express'
import { notificationsController } from './notifications.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

// ============================================================================
// TODAS AS ROTAS REQUEREM AUTENTICAÇÃO
// ============================================================================

router.use(authenticate)

// ============================================================================
// NOTIFICAÇÕES GERAIS
// ============================================================================

// GET /api/notifications?category=EXAM_ALERT&read=false&limit=50&offset=0
// Buscar notificações com filtros
router.get(
  '/',
  notificationsController.getNotifications.bind(notificationsController)
)

// GET /api/notifications/unread-count
// Obter contagem de não lidas
router.get(
  '/unread-count',
  notificationsController.getUnreadCount.bind(notificationsController)
)

// PATCH /api/notifications/:id/read
// Marcar notificação como lida
router.patch(
  '/:id/read',
  notificationsController.markAsRead.bind(notificationsController)
)

// PATCH /api/notifications/read-all
// Marcar todas como lidas
router.patch(
  '/read-all',
  notificationsController.markAllAsRead.bind(notificationsController)
)

// ============================================================================
// PREFERÊNCIAS DE NOTIFICAÇÃO
// ============================================================================

// GET /api/notifications/preferences
// Obter preferências do usuário
router.get(
  '/preferences',
  notificationsController.getPreferences.bind(notificationsController)
)

// PATCH /api/notifications/preferences
// Atualizar preferências
router.patch(
  '/preferences',
  notificationsController.updatePreferences.bind(notificationsController)
)

// ============================================================================
// ALERTAS DE EXAME
// ============================================================================

// GET /api/notifications/exam-alerts/:patientId?severity=CRITICAL&acknowledged=false&resolved=false
// Buscar alertas de exame do paciente
router.get(
  '/exam-alerts/:patientId',
  notificationsController.getExamAlerts.bind(notificationsController)
)

// PATCH /api/notifications/exam-alerts/:alertId/acknowledge
// Reconhecer um alerta (acknowledge)
router.patch(
  '/exam-alerts/:alertId/acknowledge',
  notificationsController.acknowledgeAlert.bind(notificationsController)
)

// PATCH /api/notifications/exam-alerts/:alertId/resolve
// Resolver um alerta (marcar como resolvido)
router.patch(
  '/exam-alerts/:alertId/resolve',
  notificationsController.resolveAlert.bind(notificationsController)
)

export default router
