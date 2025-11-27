import { Router } from 'express'
import { medicationsController } from './medications.controller'
import { medicationPhotosController } from '../medication-photos/medication-photos.controller'
import * as stockController from '../alerts/stock.controller'
import { authenticate } from '../auth/auth.middleware'
import { uploadPhoto } from '../common/upload.config'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

// ============================================================================
// MEDICATION ROUTES
// ============================================================================

// GET /api/medications?patientId=xxx&active=true
router.get('/', (req, res, _next) => medicationsController.getMedications(req, res, _next))

// GET /api/medications/:id
router.get('/:id', (req, res, _next) => medicationsController.getMedicationById(req, res, _next))

// POST /api/medications
router.post('/', (req, res, _next) => medicationsController.createMedication(req, res, _next))

// PUT /api/medications/:id
router.put('/:id', (req, res, _next) => medicationsController.updateMedication(req, res, _next))

// DELETE /api/medications/:id
router.delete('/:id', (req, res, _next) => medicationsController.deleteMedication(req, res, _next))

// ============================================================================
// MEDICATION PHOTOS ROUTES
// ============================================================================

// GET /api/medications/photos/:photoId - DEVE VIR ANTES DE /:medicationId/photos
router.get('/photos/:photoId', (req, res, next) =>
  medicationPhotosController.getMedicationPhotoById(req, res, next)
)

// PUT /api/medications/photos/:photoId
router.put('/photos/:photoId', (req, res, next) =>
  medicationPhotosController.updateMedicationPhoto(req, res, next)
)

// DELETE /api/medications/photos/:photoId
router.delete('/photos/:photoId', (req, res, next) =>
  medicationPhotosController.deleteMedicationPhoto(req, res, next)
)

// GET /api/medications/:medicationId/photos?type=MEDICATION_BOX
router.get('/:medicationId/photos', (req, res, next) =>
  medicationPhotosController.getMedicationPhotos(req, res, next)
)

// POST /api/medications/:medicationId/photos - Upload de foto
router.post('/:medicationId/photos', uploadPhoto.single('photo'), (req, res, next) =>
  medicationPhotosController.uploadMedicationPhoto(req, res, next)
)

// ============================================================================
// STOCK MANAGEMENT ROUTES
// ============================================================================

// GET /api/medications/:medicationId/stock
router.get('/:medicationId/stock', (req, res, _next) =>
  stockController.getStock(req, res)
)

// POST /api/medications/:medicationId/stock
router.post('/:medicationId/stock', (req, res, _next) =>
  stockController.createStock(req, res)
)

// PUT /api/medications/:medicationId/stock
router.put('/:medicationId/stock', (req, res, _next) =>
  stockController.updateStock(req, res)
)

// DELETE /api/medications/:medicationId/stock
router.delete('/:medicationId/stock', (req, res, _next) =>
  stockController.deleteStock(req, res)
)

// POST /api/medications/:medicationId/stock/consume
router.post('/:medicationId/stock/consume', (req, res, _next) =>
  stockController.consumeStock(req, res)
)

// POST /api/medications/:medicationId/stock/restock
router.post('/:medicationId/stock/restock', (req, res, _next) =>
  stockController.restockMedication(req, res)
)

export default router
