import { Router } from 'express'
import { patientsController } from './patients.controller'
import { medicationPhotosController } from '../medication-photos/medication-photos.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

// GET /api/patients
router.get('/', (req, res, next) => patientsController.getPatients(req, res, next))

// GET /api/patients/:id
router.get('/:id', (req, res, next) => patientsController.getPatientById(req, res, next))

// PUT /api/patients/:id
router.put('/:id', (req, res, next) => patientsController.updatePatient(req, res, next))

// GET /api/patients/:patientId/medication-photos?type=MEDICATION_BOX
router.get('/:patientId/medication-photos', (req, res, next) =>
  medicationPhotosController.getPatientMedicationPhotos(req, res, next)
)

// POST /api/patients/:id/link-caregiver
router.post('/:id/link-caregiver', (req, res, next) => patientsController.linkCaregiver(req, res, next))

// DELETE /api/patients/:id/unlink-caregiver/:caregiverId
router.delete('/:id/unlink-caregiver/:caregiverId', (req, res, next) => patientsController.unlinkCaregiver(req, res, next))

// POST /api/patients/:id/link-professional
router.post('/:id/link-professional', (req, res, next) => patientsController.linkProfessional(req, res, next))

// DELETE /api/patients/:id/unlink-professional/:professionalId
router.delete('/:id/unlink-professional/:professionalId', (req, res, next) => patientsController.unlinkProfessional(req, res, next))

export default router
