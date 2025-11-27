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

// ============================================================================
// DASHBOARD CONFIG ROUTES
// ============================================================================

// GET /api/dashboard/config - Get dashboard configuration
router.get(
  '/config',
  authorize(UserRole.PATIENT),
  (req, res) => dashboardController.getConfig(req, res)
)

// POST /api/dashboard/config - Save dashboard configuration
router.post(
  '/config',
  authorize(UserRole.PATIENT),
  (req, res) => dashboardController.saveConfig(req, res)
)

// ============================================================================
// WIDGET DATA ROUTES
// ============================================================================

// GET /api/dashboard/widgets/stats
router.get(
  '/widgets/stats',
  authorize(UserRole.PATIENT),
  (req, res) => dashboardController.getStatsWidget(req, res)
)

// GET /api/dashboard/widgets/medications
router.get(
  '/widgets/medications',
  authorize(UserRole.PATIENT),
  (req, res) => dashboardController.getMedicationsWidget(req, res)
)

// GET /api/dashboard/widgets/vitals
router.get(
  '/widgets/vitals',
  authorize(UserRole.PATIENT),
  (req, res) => dashboardController.getVitalsWidget(req, res)
)

// GET /api/dashboard/widgets/consultations
router.get(
  '/widgets/consultations',
  authorize(UserRole.PATIENT),
  (req, res) => dashboardController.getConsultationsWidget(req, res)
)

// GET /api/dashboard/widgets/exams
router.get(
  '/widgets/exams',
  authorize(UserRole.PATIENT),
  (req, res) => dashboardController.getExamsWidget(req, res)
)

export default router
