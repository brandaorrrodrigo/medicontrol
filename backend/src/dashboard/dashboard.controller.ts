import { Request, Response, NextFunction } from 'express'
import { dashboardService } from './dashboard.service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class DashboardController {
  // GET /api/dashboard/patient
  async getPatientDashboard(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        })
      }

      // Verificar se é um paciente
      if (req.user?.role !== 'PATIENT') {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado. Apenas pacientes podem acessar este endpoint.',
        })
      }

      const data = await dashboardService.getPatientDashboard(userId)

      return res.status(200).json({
        success: true,
        data,
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({
          success: false,
          error: error.message,
        })
      }

      return next(error)
    }
  }

  // GET /api/dashboard/caregiver
  async getCaregiverDashboard(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        })
      }

      // Verificar se é um cuidador
      if (req.user?.role !== 'CAREGIVER') {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado. Apenas cuidadores podem acessar este endpoint.',
        })
      }

      const data = await dashboardService.getCaregiverDashboard(userId)

      return res.status(200).json({
        success: true,
        data,
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({
          success: false,
          error: error.message,
        })
      }

      return next(error)
    }
  }

  // GET /api/dashboard/professional
  async getProfessionalDashboard(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        })
      }

      // Verificar se é um profissional
      if (req.user?.role !== 'PROFESSIONAL') {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado. Apenas profissionais podem acessar este endpoint.',
        })
      }

      const data = await dashboardService.getProfessionalDashboard(userId)

      return res.status(200).json({
        success: true,
        data,
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({
          success: false,
          error: error.message,
        })
      }

      return next(error)
    }
  }

  // ============================================================================
  // DASHBOARD CONFIG ENDPOINTS
  // ============================================================================

  // GET /api/dashboard/config
  async getConfig(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      // Get patient from user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { patient: true },
      })

      if (!user || !user.patient) {
        return res.status(404).json({ error: 'Patient not found' })
      }

      const config = await prisma.dashboardConfig.findUnique({
        where: { patientId: user.patient.id },
      })

      if (!config) {
        return res.status(404).json({ error: 'Dashboard config not found' })
      }

      return res.json(config)
    } catch (error) {
      console.error('Error getting dashboard config:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // POST /api/dashboard/config
  async saveConfig(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user?.userId
      const { widgets, layout } = req.body

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      // Get patient from user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { patient: true },
      })

      if (!user || !user.patient) {
        return res.status(404).json({ error: 'Patient not found' })
      }

      const config = await prisma.dashboardConfig.upsert({
        where: { patientId: user.patient.id },
        update: { widgets, layout },
        create: { patientId: user.patient.id, widgets, layout },
      })

      return res.json({ message: 'Dashboard config saved successfully', config })
    } catch (error) {
      console.error('Error saving dashboard config:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // ============================================================================
  // WIDGET DATA ENDPOINTS
  // ============================================================================

  // GET /api/dashboard/widgets/stats
  async getStatsWidget(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      // Get patient from user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { patient: true },
      })

      if (!user || !user.patient) {
        return res.status(404).json({ error: 'Patient not found' })
      }

      const patientId = user.patient.id

      const [medications, vitals, consultations, exams] = await Promise.all([
        prisma.medication.count({ where: { patientId, active: true } }),
        prisma.vitalSign.count({ where: { patientId } }),
        prisma.consultation.count({ where: { patientId } }),
        prisma.exam.count({ where: { patientId } }),
      ])

      return res.json({
        medications,
        vitals,
        consultations,
        exams,
      })
    } catch (error) {
      console.error('Error getting stats widget:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // GET /api/dashboard/widgets/medications
  async getMedicationsWidget(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      // Get patient from user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { patient: true },
      })

      if (!user || !user.patient) {
        return res.status(404).json({ error: 'Patient not found' })
      }

      const patientId = user.patient.id
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const medications = await prisma.medicationSchedule.findMany({
        where: {
          patientId,
          scheduledFor: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        include: {
          medication: true,
        },
        orderBy: { scheduledFor: 'asc' },
        take: 5,
      })

      const formatted = medications.map((med) => ({
        id: med.id,
        name: med.medication.name,
        time: med.scheduledFor.toTimeString().slice(0, 5),
        taken: med.taken || false,
        dosage: med.medication.dosage,
      }))

      return res.json({ medications: formatted })
    } catch (error) {
      console.error('Error getting medications widget:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // GET /api/dashboard/widgets/vitals
  async getVitalsWidget(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      // Get patient from user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { patient: true },
      })

      if (!user || !user.patient) {
        return res.status(404).json({ error: 'Patient not found' })
      }

      const patientId = user.patient.id

      // Get latest vitals
      const latestVitals = await prisma.vitalSign.findMany({
        where: { patientId },
        orderBy: { timestamp: 'desc' },
        take: 10,
      })

      // Organize by type
      const vitalsMap: any = {}
      latestVitals.forEach((vital) => {
        if (!vitalsMap[vital.type]) {
          vitalsMap[vital.type] = vital
        }
      })

      return res.json({
        bloodPressure: vitalsMap.BLOOD_PRESSURE?.value || null,
        heartRate: vitalsMap.HEART_RATE?.value || null,
        weight: vitalsMap.WEIGHT?.value || null,
        glucose: vitalsMap.GLUCOSE?.value || null,
        lastMeasurement: latestVitals[0]?.timestamp || null,
      })
    } catch (error) {
      console.error('Error getting vitals widget:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // GET /api/dashboard/widgets/consultations
  async getConsultationsWidget(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      // Get patient from user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { patient: true },
      })

      if (!user || !user.patient) {
        return res.status(404).json({ error: 'Patient not found' })
      }

      const patientId = user.patient.id
      const now = new Date()

      const consultations = await prisma.consultation.findMany({
        where: {
          patientId,
          date: { gte: now },
          status: { in: ['SCHEDULED', 'CONFIRMED'] },
        },
        include: {
          professional: true,
        },
        orderBy: { date: 'asc' },
        take: 3,
      })

      const formatted = consultations.map((cons) => ({
        id: cons.id,
        date: cons.date,
        doctor: cons.professional.name,
        type: cons.type,
        location: cons.location,
      }))

      return res.json({ consultations: formatted })
    } catch (error) {
      console.error('Error getting consultations widget:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // GET /api/dashboard/widgets/exams
  async getExamsWidget(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      // Get patient from user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { patient: true },
      })

      if (!user || !user.patient) {
        return res.status(404).json({ error: 'Patient not found' })
      }

      const patientId = user.patient.id

      const exams = await prisma.exam.findMany({
        where: { patientId },
        orderBy: { date: 'desc' },
        take: 5,
      })

      const formatted = exams.map((exam) => ({
        id: exam.id,
        name: exam.name,
        date: exam.date,
        status: exam.status,
        type: exam.type,
      }))

      return res.json({ exams: formatted })
    } catch (error) {
      console.error('Error getting exams widget:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export const dashboardController = new DashboardController()
