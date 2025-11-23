import { Router } from 'express'
import { prescriptionsController } from './prescriptions.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

// GET /api/prescriptions?patientId=xxx
router.get('/', (req, res, next) => prescriptionsController.getPrescriptions(req, res, next))

// GET /api/prescriptions/:id
router.get('/:id', (req, res, next) => prescriptionsController.getPrescriptionById(req, res, next))

// POST /api/prescriptions
router.post('/', (req, res, next) => prescriptionsController.createPrescription(req, res, next))

// PUT /api/prescriptions/:id
router.put('/:id', (req, res, next) => prescriptionsController.updatePrescription(req, res, next))

// POST /api/prescriptions/:id/items
router.post('/:id/items', (req, res, next) => prescriptionsController.addItem(req, res, next))

// DELETE /api/prescriptions/items/:itemId
router.delete('/items/:itemId', (req, res, next) => prescriptionsController.removeItem(req, res, next))

// DELETE /api/prescriptions/:id
router.delete('/:id', (req, res, next) => prescriptionsController.deletePrescription(req, res, next))

export default router
