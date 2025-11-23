import { Router } from 'express'
import { medicationsController } from './medications.controller'
import { medicationPhotosController } from '../medication-photos/medication-photos.controller'
import { authenticate } from '../auth/auth.middleware'
import { uploadPhoto } from '../common/upload.config'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

// ============================================================================
// MEDICATION ROUTES
// ============================================================================

// GET /api/medications?patientId=xxx&active=true
router.get('/', (req, res, next) => medicationsController.getMedications(req, res, next))

// GET /api/medications/:id
router.get('/:id', (req, res, next) => medicationsController.getMedicationById(req, res, next))

// POST /api/medications
router.post('/', (req, res, next) => medicationsController.createMedication(req, res, next))

// PUT /api/medications/:id
router.put('/:id', (req, res, next) => medicationsController.updateMedication(req, res, next))

// DELETE /api/medications/:id
router.delete('/:id', (req, res, next) => medicationsController.deleteMedication(req, res, next))

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

export default router
