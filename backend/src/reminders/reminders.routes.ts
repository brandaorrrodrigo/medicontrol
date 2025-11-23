import { Router } from 'express'
import { remindersController } from './reminders.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

// GET /api/reminders/upcoming?patientId=xxx&limit=10
router.get('/upcoming', (req, res, next) => remindersController.getUpcomingReminders(req, res, next))

// GET /api/reminders/today?patientId=xxx
router.get('/today', (req, res, next) => remindersController.getTodayReminders(req, res, next))

// POST /api/reminders
router.post('/', (req, res, next) => remindersController.createReminder(req, res, next))

// POST /api/reminders/:id/mark-taken
router.post('/:id/mark-taken', (req, res, next) => remindersController.markAsTaken(req, res, next))

// DELETE /api/reminders/:id
router.delete('/:id', (req, res, next) => remindersController.deleteReminder(req, res, next))

export default router
