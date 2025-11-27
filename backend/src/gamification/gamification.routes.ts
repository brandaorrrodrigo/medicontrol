import { Router } from 'express'
import { gamificationController } from './gamification.controller'
import { authenticate, authorize } from '../auth/auth.middleware'
import { UserRole } from '@prisma/client'

const router = Router()

// All routes require authentication as PATIENT
router.use(authenticate)
router.use(authorize(UserRole.PATIENT))

// GET /api/gamification/achievements - Get all achievements with progress
router.get('/achievements', (req, res) =>
  gamificationController.getAchievements(req, res)
)

// GET /api/gamification/streak - Get current streak
router.get('/streak', (req, res) =>
  gamificationController.getStreak(req, res)
)

// GET /api/gamification/level - Get current level and XP
router.get('/level', (req, res) =>
  gamificationController.getLevel(req, res)
)

// POST /api/gamification/achievements/:id/unlock - Unlock achievement
router.post('/achievements/:id/unlock', (req, res) =>
  gamificationController.unlockAchievement(req, res)
)

// POST /api/gamification/xp - Add XP manually
router.post('/xp', (req, res) =>
  gamificationController.addXP(req, res)
)

// POST /api/gamification/activity - Log activity
router.post('/activity', (req, res) =>
  gamificationController.logActivity(req, res)
)

export default router
