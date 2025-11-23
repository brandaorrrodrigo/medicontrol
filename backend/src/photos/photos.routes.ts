import { Router } from 'express'
import { photosController } from './photos.controller'
import { authenticate } from '../auth/auth.middleware'
import { uploadPhoto } from '../common/upload.config'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

// GET /api/photos/compare?patientId=xxx&before=xxx&after=xxx
router.get('/compare', (req, res, next) => photosController.comparePhotos(req, res, next))

// GET /api/photos?patientId=xxx&type=BEFORE
router.get('/', (req, res, next) => photosController.getPhotos(req, res, next))

// POST /api/photos - Upload de foto
router.post('/', uploadPhoto.single('photo'), (req, res, next) => photosController.uploadPhoto(req, res, next))

// PUT /api/photos/:id
router.put('/:id', (req, res, next) => photosController.updatePhoto(req, res, next))

// DELETE /api/photos/:id
router.delete('/:id', (req, res, next) => photosController.deletePhoto(req, res, next))

export default router
