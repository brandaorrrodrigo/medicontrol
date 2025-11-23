import { Router } from 'express'
import { consultationsController } from './consultations.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

// GET /api/consultations?patientId=xxx OR ?professionalId=xxx
router.get('/', (req, res, next) => consultationsController.getConsultations(req, res, next))

// GET /api/consultations/:id
router.get('/:id', (req, res, next) => consultationsController.getConsultationById(req, res, next))

// POST /api/consultations
router.post('/', (req, res, next) => consultationsController.createConsultation(req, res, next))

// PUT /api/consultations/:id
router.put('/:id', (req, res, next) => consultationsController.updateConsultation(req, res, next))

// PATCH /api/consultations/:id/status
router.patch('/:id/status', (req, res, next) => consultationsController.updateStatus(req, res, next))

// DELETE /api/consultations/:id
router.delete('/:id', (req, res, next) => consultationsController.deleteConsultation(req, res, next))

export default router
