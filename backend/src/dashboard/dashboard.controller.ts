import { Request, Response, NextFunction } from 'express'
import { dashboardService } from './dashboard.service'

export class DashboardController {
  // GET /api/dashboard/patient
  async getPatientDashboard(req: Request, res: Response, next: NextFunction) {
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

      res.status(200).json({
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

      next(error)
    }
  }

  // GET /api/dashboard/caregiver
  async getCaregiverDashboard(req: Request, res: Response, next: NextFunction) {
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

      res.status(200).json({
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

      next(error)
    }
  }

  // GET /api/dashboard/professional
  async getProfessionalDashboard(req: Request, res: Response, next: NextFunction) {
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

      res.status(200).json({
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

      next(error)
    }
  }
}

export const dashboardController = new DashboardController()
