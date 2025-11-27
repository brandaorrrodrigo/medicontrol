# 🎮 Gamification & Dashboard Backend Setup Guide

## ✅ What Was Implemented

### New Database Models (Prisma Schema)
- ✅ `DashboardConfig` - Store user dashboard customization
- ✅ `UserGamification` - Track XP, levels, and streaks
- ✅ `Achievement` - Catalog of all achievements
- ✅ `UserAchievement` - User progress on achievements
- ✅ `ActivityLog` - Log user activities for streak calculation

### New API Endpoints

#### Gamification Endpoints
- ✅ `GET /api/gamification/achievements` - Get all achievements with progress
- ✅ `GET /api/gamification/streak` - Get current streak data
- ✅ `GET /api/gamification/level` - Get current level and XP
- ✅ `POST /api/gamification/achievements/:id/unlock` - Unlock achievement
- ✅ `POST /api/gamification/xp` - Add XP to user
- ✅ `POST /api/gamification/activity` - Log user activity

#### Dashboard Endpoints
- ✅ `GET /api/dashboard/config` - Get dashboard configuration
- ✅ `POST /api/dashboard/config` - Save dashboard configuration
- ✅ `GET /api/dashboard/widgets/stats` - Get stats widget data
- ✅ `GET /api/dashboard/widgets/medications` - Get medications widget data
- ✅ `GET /api/dashboard/widgets/vitals` - Get vitals widget data
- ✅ `GET /api/dashboard/widgets/consultations` - Get consultations widget data
- ✅ `GET /api/dashboard/widgets/exams` - Get exams widget data

#### Calendar Endpoints
- ✅ `GET /api/calendar/events?month=X&year=Y` - Get calendar events

### New Files Created

**Services:**
- `src/gamification/gamification.service.ts` - Gamification business logic
- `src/calendar/calendar.service.ts` - Calendar business logic

**Controllers:**
- `src/gamification/gamification.controller.ts` - Gamification endpoints
- `src/dashboard/dashboard.controller.ts` - Updated with new endpoints
- `src/calendar/calendar.controller.ts` - Calendar endpoints

**Routes:**
- `src/gamification/gamification.routes.ts` - Gamification routes
- `src/dashboard/dashboard.routes.ts` - Updated with new routes
- `src/calendar/calendar.routes.ts` - Calendar routes

**Seeds:**
- `prisma/seed-achievements.ts` - Seed 19 pre-built achievements

---

## 🚀 Setup Instructions

### 1. Ensure Database is Running

Make sure PostgreSQL is running and accessible:

```bash
# Check if PostgreSQL is running
pg_isready

# If not running, start it (Windows)
net start postgresql-x64-14

# Or using Docker
docker start postgres
```

### 2. Run Database Migration

```bash
cd backend

# Run migration to create new tables
npx prisma migrate dev --name add_dashboard_and_gamification

# Generate Prisma client
npx prisma generate
```

This will create the following tables:
- `DashboardConfig`
- `UserGamification`
- `Achievement`
- `UserAchievement`
- `ActivityLog`

### 3. Seed Achievements

```bash
# Seed the achievements catalog
npx tsx prisma/seed-achievements.ts
```

This will create 19 achievements across 5 categories:
- **Medication**: 4 achievements
- **Consistency (Streaks)**: 4 achievements
- **Exams**: 3 achievements
- **Vitals**: 3 achievements
- **Special**: 5 achievements

### 4. Verify Installation

```bash
# Open Prisma Studio to view the new tables
npx prisma studio
```

Navigate to:
- `Achievement` table - Should see 19 achievements
- `DashboardConfig` - Empty (will be populated by users)
- `UserGamification` - Empty (will be created on first user activity)
- `UserAchievement` - Empty (will be created as users earn achievements)
- `ActivityLog` - Empty (will be populated with user activities)

---

## 🧪 Testing the Endpoints

### Test with an authenticated user

**1. Login as a patient:**
```bash
POST http://localhost:3001/api/auth/login
{
  "email": "patient@example.com",
  "password": "password"
}
```

**2. Get achievements:**
```bash
GET http://localhost:3001/api/gamification/achievements
Authorization: Bearer <token>
```

**3. Get streak:**
```bash
GET http://localhost:3001/api/gamification/streak
Authorization: Bearer <token>
```

**4. Get level:**
```bash
GET http://localhost:3001/api/gamification/level
Authorization: Bearer <token>
```

**5. Get dashboard config:**
```bash
GET http://localhost:3001/api/dashboard/config
Authorization: Bearer <token>
```

**6. Save dashboard config:**
```bash
POST http://localhost:3001/api/dashboard/config
Authorization: Bearer <token>
{
  "widgets": [
    { "id": "1", "type": "stats", "size": "medium", "visible": true },
    { "id": "2", "type": "medications", "size": "large", "visible": true }
  ],
  "layout": "grid"
}
```

**7. Get calendar events:**
```bash
GET http://localhost:3001/api/calendar/events?month=10&year=2024
Authorization: Bearer <token>
```

---

## 📊 How the Gamification System Works

### XP and Levels

**XP Rewards:**
- Medication taken: 10 XP
- Medication taken on time: 20 XP
- Vital sign recorded: 10 XP
- Exam registered: 15 XP
- Consultation attended: 20 XP
- 7-day streak bonus: 50 XP
- 30-day streak bonus: 200 XP

**Level Progression:**
- Level 1: 0 XP
- Level 2: 100 XP
- Level 3: 250 XP
- Level 4: 500 XP
- Level 5: 800 XP
- ... up to Level 20: 17,300 XP

### Streak Calculation

The streak is calculated based on consecutive days with activity:

1. Check `ActivityLog` for patient activities
2. Count consecutive days from today backwards
3. If more than 1 day gap, streak is broken
4. Update `UserGamification.currentStreak` and `bestStreak`

### Activity Logging

To maintain streaks, log activities whenever a user:
- Takes a medication
- Records a vital sign
- Registers an exam
- Attends a consultation

**Example:**
```typescript
await gamificationService.logActivity(patientId, 'medication', {
  medicationId: 'abc123',
  scheduledFor: new Date(),
  takenAt: new Date(),
})
```

---

## 🔄 Integration with Existing Code

### When a medication is taken:

```typescript
// In medications.controller.ts or medications.service.ts
import { gamificationService } from '../gamification/gamification.service'

// After marking medication as taken
await gamificationService.logActivity(patientId, 'medication', {
  medicationId,
  scheduledFor,
  takenAt: new Date(),
})

// Award XP
const onTime = isTakenOnTime(scheduledFor, new Date())
const xp = onTime ? XP_REWARDS.medicationOnTime : XP_REWARDS.medicationTaken
await gamificationService.addXP(patientId, xp)

// Check and update streak-based achievements
await checkStreakAchievements(patientId)
```

### When an exam is registered:

```typescript
import { gamificationService } from '../gamification/gamification.service'

// After creating exam
await gamificationService.logActivity(patientId, 'exam', { examId })
await gamificationService.addXP(patientId, XP_REWARDS.examRegistered)

// Check exam-based achievements
await checkExamAchievements(patientId)
```

---

## 📝 Achievement Auto-Unlock Logic

You can implement automatic achievement unlocking by:

1. **Counting user progress** (medications taken, exams, etc.)
2. **Updating achievement progress** in `UserAchievement`
3. **Auto-unlocking** when progress reaches total

**Example implementation:**

```typescript
async function checkMedicationAchievements(patientId: string) {
  // Count total medications taken
  const totalTaken = await prisma.medicationSchedule.count({
    where: { patientId, taken: true },
  })

  // Get medication achievements
  const medAchievements = await prisma.achievement.findMany({
    where: { category: 'medication' },
  })

  for (const achievement of medAchievements) {
    await gamificationService.updateAchievementProgress(
      patientId,
      achievement.id,
      totalTaken
    )
  }
}
```

---

## ✅ Checklist

- [ ] Database is running
- [ ] Migration executed successfully
- [ ] Prisma client generated
- [ ] Achievements seeded (19 achievements)
- [ ] Endpoints tested with Postman/Insomnia
- [ ] Frontend can fetch achievements
- [ ] Frontend can fetch/save dashboard config
- [ ] Frontend can fetch calendar events
- [ ] Activity logging integrated in medications
- [ ] Activity logging integrated in exams
- [ ] Activity logging integrated in vitals
- [ ] XP rewards integrated
- [ ] Achievement auto-unlock logic implemented

---

## 🎯 Next Steps

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test the frontend integration:**
   - Visit `/paciente/conquistas` to see achievements
   - Visit `/paciente/calendario` to see calendar
   - Visit `/dashboard-novo` to see customizable dashboard

3. **Implement activity logging** in existing medication/exam/vitals endpoints

4. **Add achievement unlock notifications** using the notifications system

---

**Backend integration complete! 🚀**
