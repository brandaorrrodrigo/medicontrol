import { Router } from 'express'
import { dashboardController } from './dashboard.controller'
import { authenticate, authorize } from '../auth/auth.middleware'
import { UserRole } from '@prisma/client'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

// GET /api/dashboard/patient - Dashboard do paciente
router.get(
  '/patient',
  authorize(UserRole.PATIENT),
  (req, res, next) => dashboardController.getPatientDashboard(req, res, next)
)

// GET /api/dashboard/caregiver - Dashboard do cuidador
router.get(
  '/caregiver',
  authorize(UserRole.CAREGIVER),
  (req, res, next) => dashboardController.getCaregiverDashboard(req, res, next)
)

// GET /api/dashboard/professional - Dashboard do profissional
router.get(
  '/professional',
  authorize(UserRole.PROFESSIONAL),
  (req, res, next) => dashboardController.getProfessionalDashboard(req, res, next)
)

export default router
