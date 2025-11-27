import { Router } from 'express'
import { calendarController } from './calendar.controller'
import { authenticate, authorize } from '../auth/auth.middleware'
import { UserRole } from '@prisma/client'

const router = Router()

// All routes require authentication as PATIENT
router.use(authenticate)
router.use(authorize(UserRole.PATIENT))

// GET /api/calendar/events?month=X&year=Y - Get calendar events for a month
router.get('/events', (req, res) => calendarController.getEvents(req, res))

export default router
