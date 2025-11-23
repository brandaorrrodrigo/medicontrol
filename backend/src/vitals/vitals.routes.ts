import { Router } from 'express'
import { vitalsController } from './vitals.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

// GET /api/vitals/stats?patientId=xxx&type=BLOOD_PRESSURE&days=30
router.get('/stats', (req, res, next) => vitalsController.getStats(req, res, next))

// GET /api/vitals?patientId=xxx&type=BLOOD_PRESSURE&limit=50
router.get('/', (req, res, next) => vitalsController.getVitalSigns(req, res, next))

// POST /api/vitals
router.post('/', (req, res, next) => vitalsController.createVitalSign(req, res, next))

// DELETE /api/vitals/:id
router.delete('/:id', (req, res, next) => vitalsController.deleteVitalSign(req, res, next))

export default router
