import { Request, Response } from 'express'
import { gamificationService } from './gamification.service'

export class GamificationController {
  // GET /api/gamification/achievements
  async getAchievements(req: Request, res: Response) {
    try {
      const patientId = (req as any).patientId

      if (!patientId) {
        return res.status(401).json({ error: 'Patient not authenticated' })
      }

      const achievements = await gamificationService.getAchievements(patientId)

      return res.json({ achievements })
    } catch (error) {
      console.error('Error getting achievements:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // GET /api/gamification/streak
  async getStreak(req: Request, res: Response) {
    try {
      const patientId = (req as any).patientId

      if (!patientId) {
        return res.status(401).json({ error: 'Patient not authenticated' })
      }

      const streak = await gamificationService.getStreak(patientId)

      return res.json(streak)
    } catch (error) {
      console.error('Error getting streak:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // GET /api/gamification/level
  async getLevel(req: Request, res: Response) {
    try {
      const patientId = (req as any).patientId

      if (!patientId) {
        return res.status(401).json({ error: 'Patient not authenticated' })
      }

      const level = await gamificationService.getLevel(patientId)

      return res.json(level)
    } catch (error) {
      console.error('Error getting level:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // POST /api/gamification/achievements/:id/unlock
  async unlockAchievement(req: Request, res: Response) {
    try {
      const patientId = (req as any).patientId
      const { id } = req.params

      if (!patientId) {
        return res.status(401).json({ error: 'Patient not authenticated' })
      }

      const userAchievement = await gamificationService.unlockAchievement(patientId, id)

      return res.json({
        message: 'Achievement unlocked successfully',
        userAchievement,
      })
    } catch (error: any) {
      console.error('Error unlocking achievement:', error)

      if (error.message === 'Achievement not found') {
        return res.status(404).json({ error: 'Achievement not found' })
      }

      if (error.message === 'Achievement already unlocked') {
        return res.status(400).json({ error: 'Achievement already unlocked' })
      }

      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // POST /api/gamification/xp
  async addXP(req: Request, res: Response) {
    try {
      const patientId = (req as any).patientId
      const { xp } = req.body

      if (!patientId) {
        return res.status(401).json({ error: 'Patient not authenticated' })
      }

      if (!xp || typeof xp !== 'number' || xp <= 0) {
        return res.status(400).json({ error: 'Invalid XP value' })
      }

      const result = await gamificationService.addXP(patientId, xp)

      return res.json(result)
    } catch (error) {
      console.error('Error adding XP:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // POST /api/gamification/activity
  async logActivity(req: Request, res: Response) {
    try {
      const patientId = (req as any).patientId
      const { type, metadata } = req.body

      if (!patientId) {
        return res.status(401).json({ error: 'Patient not authenticated' })
      }

      if (!type) {
        return res.status(400).json({ error: 'Activity type is required' })
      }

      await gamificationService.logActivity(patientId, type, metadata)

      return res.json({ message: 'Activity logged successfully' })
    } catch (error) {
      console.error('Error logging activity:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export const gamificationController = new GamificationController()
