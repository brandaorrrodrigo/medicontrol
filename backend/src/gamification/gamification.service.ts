import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// XP rewards configuration
export const XP_REWARDS = {
  medicationTaken: 10,
  medicationOnTime: 20,
  vitalSigned: 10,
  examRegistered: 15,
  consultationAttended: 20,
  weeklyStreak: 50,
  monthlyStreak: 200,
}

// XP required for each level
export const XP_PER_LEVEL = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  800,    // Level 5
  1200,   // Level 6
  1700,   // Level 7
  2300,   // Level 8
  3000,   // Level 9
  3800,   // Level 10
  4700,   // Level 11
  5700,   // Level 12
  6800,   // Level 13
  8000,   // Level 14
  9300,   // Level 15
  10700,  // Level 16
  12200,  // Level 17
  13800,  // Level 18
  15500,  // Level 19
  17300,  // Level 20
]

export class GamificationService {
  // Calculate current level and XP from total XP
  calculateLevel(totalXP: number): { level: number; currentXP: number; xpToNextLevel: number } {
    let level = 1
    let remainingXP = totalXP

    for (let i = 1; i < XP_PER_LEVEL.length; i++) {
      if (remainingXP >= XP_PER_LEVEL[i]) {
        remainingXP -= XP_PER_LEVEL[i]
        level++
      } else {
        break
      }
    }

    const xpToNextLevel = level < XP_PER_LEVEL.length ? XP_PER_LEVEL[level] : 5000

    return {
      level,
      currentXP: remainingXP,
      xpToNextLevel,
    }
  }

  // Calculate current streak for a patient
  async calculateStreak(patientId: string): Promise<number> {
    const activities = await prisma.activityLog.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
      select: { date: true },
    })

    if (activities.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if has activity today or yesterday
    const lastActivity = new Date(activities[0].date)
    lastActivity.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff > 1) {
      // Streak broken
      return 0
    }

    // Get unique dates
    const uniqueDates = new Set<string>()
    activities.forEach(activity => {
      const date = new Date(activity.date)
      date.setHours(0, 0, 0, 0)
      uniqueDates.add(date.toISOString())
    })

    const sortedDates = Array.from(uniqueDates).sort().reverse()

    // Count consecutive days
    let currentDate = new Date(sortedDates[0])

    for (let i = 0; i < sortedDates.length; i++) {
      const activityDate = new Date(sortedDates[i])

      if (activityDate.getTime() === currentDate.getTime()) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        // Day skipped, streak broken
        break
      }
    }

    return streak
  }

  // Get or create gamification profile
  async getOrCreateGamification(patientId: string) {
    let gamification = await prisma.userGamification.findUnique({
      where: { patientId },
    })

    if (!gamification) {
      gamification = await prisma.userGamification.create({
        data: {
          patientId,
          level: 1,
          currentXP: 0,
          totalXP: 0,
          currentStreak: 0,
          bestStreak: 0,
          totalDays: 0,
        },
      })
    }

    return gamification
  }

  // Get streak data
  async getStreak(patientId: string) {
    const gamification = await this.getOrCreateGamification(patientId)
    const currentStreak = await this.calculateStreak(patientId)

    // Update if changed
    if (currentStreak !== gamification.currentStreak) {
      await prisma.userGamification.update({
        where: { patientId },
        data: {
          currentStreak,
          bestStreak: Math.max(currentStreak, gamification.bestStreak),
        },
      })
    }

    return {
      current: currentStreak,
      longest: Math.max(currentStreak, gamification.bestStreak),
      lastActivityDate: gamification.lastActive,
      totalDays: gamification.totalDays,
    }
  }

  // Get level data
  async getLevel(patientId: string) {
    const gamification = await this.getOrCreateGamification(patientId)
    const levelData = this.calculateLevel(gamification.totalXP)

    return {
      level: levelData.level,
      currentXP: levelData.currentXP,
      xpToNextLevel: levelData.xpToNextLevel,
      totalXP: gamification.totalXP,
    }
  }

  // Get achievements with progress
  async getAchievements(patientId: string) {
    // Get all achievements
    const achievements = await prisma.achievement.findMany({
      orderBy: [
        { rarity: 'asc' },
        { xp: 'asc' },
      ],
    })

    // Get user achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { patientId },
      include: { achievement: true },
    })

    // Create a map for quick lookup
    const userAchievementMap = new Map(
      userAchievements.map(ua => [ua.achievementId, ua])
    )

    // Combine data
    return achievements.map(achievement => {
      const userAchievement = userAchievementMap.get(achievement.id)

      return {
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        category: achievement.category,
        rarity: achievement.rarity,
        icon: achievement.icon,
        total: achievement.total,
        xp: achievement.xp,
        progress: userAchievement?.progress || 0,
        unlocked: userAchievement?.unlocked || false,
        unlockedAt: userAchievement?.unlockedAt || null,
      }
    })
  }

  // Add XP to user
  async addXP(patientId: string, xp: number) {
    const gamification = await this.getOrCreateGamification(patientId)
    const newTotalXP = gamification.totalXP + xp

    const oldLevel = this.calculateLevel(gamification.totalXP).level
    const newLevel = this.calculateLevel(newTotalXP).level

    await prisma.userGamification.update({
      where: { patientId },
      data: {
        totalXP: newTotalXP,
        level: newLevel,
        lastActive: new Date(),
      },
    })

    return {
      xpAdded: xp,
      totalXP: newTotalXP,
      leveledUp: newLevel > oldLevel,
      newLevel,
    }
  }

  // Log activity
  async logActivity(patientId: string, type: string, metadata?: any) {
    await prisma.activityLog.create({
      data: {
        patientId,
        type,
        metadata,
        date: new Date(),
      },
    })
  }

  // Unlock achievement
  async unlockAchievement(patientId: string, achievementId: string) {
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    })

    if (!achievement) {
      throw new Error('Achievement not found')
    }

    // Get or create user achievement
    let userAchievement = await prisma.userAchievement.findUnique({
      where: {
        patientId_achievementId: {
          patientId,
          achievementId,
        },
      },
    })

    if (!userAchievement) {
      userAchievement = await prisma.userAchievement.create({
        data: {
          patientId,
          achievementId,
          progress: achievement.total,
          unlocked: true,
          unlockedAt: new Date(),
        },
      })
    } else if (!userAchievement.unlocked) {
      userAchievement = await prisma.userAchievement.update({
        where: {
          patientId_achievementId: {
            patientId,
            achievementId,
          },
        },
        data: {
          progress: achievement.total,
          unlocked: true,
          unlockedAt: new Date(),
        },
      })
    } else {
      throw new Error('Achievement already unlocked')
    }

    // Add XP
    await this.addXP(patientId, achievement.xp)

    return userAchievement
  }

  // Update achievement progress
  async updateAchievementProgress(patientId: string, achievementId: string, progress: number) {
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    })

    if (!achievement) {
      throw new Error('Achievement not found')
    }

    // Get or create user achievement
    const userAchievement = await prisma.userAchievement.upsert({
      where: {
        patientId_achievementId: {
          patientId,
          achievementId,
        },
      },
      update: {
        progress,
      },
      create: {
        patientId,
        achievementId,
        progress,
      },
    })

    // Auto-unlock if progress >= total
    if (progress >= achievement.total && !userAchievement.unlocked) {
      await this.unlockAchievement(patientId, achievementId)
    }

    return userAchievement
  }
}

export const gamificationService = new GamificationService()
