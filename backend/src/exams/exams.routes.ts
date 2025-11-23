import { Router } from 'express'
import { examsController } from './exams.controller'
import { authenticate } from '../auth/auth.middleware'
import { uploadExam } from '../common/upload.config'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

// GET /api/exams?patientId=xxx&status=SCHEDULED
router.get('/', (req, res, next) => examsController.getExams(req, res, next))

// GET /api/exams/:id
router.get('/:id', (req, res, next) => examsController.getExamById(req, res, next))

// POST /api/exams
router.post('/', (req, res, next) => examsController.createExam(req, res, next))

// PUT /api/exams/:id
router.put('/:id', (req, res, next) => examsController.updateExam(req, res, next))

// POST /api/exams/:id/upload - Upload de arquivo
router.post('/:id/upload', uploadExam.single('file'), (req, res, next) => examsController.uploadFile(req, res, next))

// DELETE /api/exams/files/:fileId
router.delete('/files/:fileId', (req, res, next) => examsController.deleteFile(req, res, next))

// DELETE /api/exams/:id
router.delete('/:id', (req, res, next) => examsController.deleteExam(req, res, next))

export default router
