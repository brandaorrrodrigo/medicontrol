import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { examsController } from './exams.controller'
import { examUploadController } from './exam-upload.controller'
import { examPhotoUploadController } from './exam-photo-upload.controller'
import { examManualController } from './exam-manual.controller'
import { examVoiceController } from './exam-voice.controller'
import { trendsController } from './trends.controller'
import { authenticate } from '../auth/auth.middleware'
import { uploadExam } from '../common/upload.config'

const router = Router()

// ============================================================================
// CONFIGURAÇÃO DO MULTER PARA UPLOAD DE PDFs
// ============================================================================

// Criar diretório de uploads se não existir
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'exams')
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

// Configuração do storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR)
  },
  filename: (_req, file, cb) => {
    // Gerar nome único: timestamp-uuid-original.pdf
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')
    cb(null, `${uniqueSuffix}-${sanitizedName}`)
  }
})

// Filtro de arquivo - aceitar apenas PDFs
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Apenas arquivos PDF são permitidos'))
  }
}

// Configuração do multer para PDFs
const uploadPDF = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
})

// ============================================================================
// CONFIGURAÇÃO DO MULTER PARA UPLOAD DE FOTOS
// ============================================================================

// Filtro para fotos - aceitar apenas imagens
const photoFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (validImageTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos (JPEG, PNG, WebP)'))
  }
}

// Configuração do multer para fotos
const uploadPhoto = multer({
  storage,
  fileFilter: photoFilter,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB max (fotos podem ser maiores que PDFs)
  }
})

// ============================================================================
// CONFIGURAÇÃO DO MULTER PARA UPLOAD DE ÁUDIO (VOZ)
// ============================================================================

// Filtro para áudio - aceitar apenas arquivos de áudio
const audioFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const validAudioTypes = [
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/mpeg',
    'audio/mp3',
    'audio/mp4',
    'audio/m4a',
    'audio/x-m4a',
    'audio/webm',
    'audio/ogg'
  ]
  if (validAudioTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Apenas arquivos de áudio são permitidos (WAV, MP3, M4A, OGG, WebM)'))
  }
}

// Configuração do multer para áudio
const uploadAudio = multer({
  storage,
  fileFilter: audioFilter,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB max (limite do Whisper API)
  }
})

// ============================================================================
// ROTAS
// ============================================================================

// Todas as rotas requerem autenticação
router.use(authenticate)

// ============================================================================
// ROTAS DE PDF UPLOAD E PROCESSAMENTO (NOVO)
// ============================================================================

// POST /api/exams/upload-pdf
// Upload e processamento automático de PDF de exame
router.post(
  '/upload-pdf',
  uploadPDF.single('pdf'),
  examUploadController.uploadPDF.bind(examUploadController)
)

// GET /api/exams/patient/:patientId/all
// Listar todos os exames de um paciente (incluindo PDFs processados)
router.get(
  '/patient/:patientId/all',
  examUploadController.listPatientExams.bind(examUploadController)
)

// ============================================================================
// ROTAS DE FOTO UPLOAD E OCR (NOVO)
// ============================================================================

// POST /api/exams/upload-photo
// Upload e processamento automático de foto de exame com OCR
router.post(
  '/upload-photo',
  uploadPhoto.single('photo'),
  examPhotoUploadController.uploadPhoto.bind(examPhotoUploadController)
)

// GET /api/exams/patient/:patientId/photos
// Listar todos os exames de foto de um paciente
router.get(
  '/patient/:patientId/photos',
  examPhotoUploadController.listPatientPhotoExams.bind(examPhotoUploadController)
)

// GET /api/exams/:examId/photo-results
// Buscar exame de foto com resultados detalhados
router.get(
  '/:examId/photo-results',
  examPhotoUploadController.getPhotoResults.bind(examPhotoUploadController)
)

// GET /api/exams/:examId/photo
// Download da foto original
router.get(
  '/:examId/photo',
  examPhotoUploadController.downloadPhoto.bind(examPhotoUploadController)
)

// GET /api/exams/:examId/processed-photo
// Download da foto processada (com pré-processamento para OCR)
router.get(
  '/:examId/processed-photo',
  examPhotoUploadController.downloadProcessedPhoto.bind(examPhotoUploadController)
)

// ============================================================================
// ROTAS DE ENTRADA MANUAL (NOVO)
// ============================================================================

// POST /api/exams/manual
// Entrada manual individual de resultado de exame
router.post(
  '/manual',
  examManualController.createManualEntry.bind(examManualController)
)

// POST /api/exams/manual/batch
// Entrada manual em lote (múltiplos marcadores)
router.post(
  '/manual/batch',
  examManualController.createManualBatch.bind(examManualController)
)

// GET /api/exams/markers
// Listar todos os marcadores disponíveis
router.get(
  '/markers',
  examManualController.listMarkers.bind(examManualController)
)

// GET /api/exams/markers/:markerCode
// Obter informações detalhadas de um marcador
router.get(
  '/markers/:markerCode',
  examManualController.getMarkerInfo.bind(examManualController)
)

// ============================================================================
// ROTAS DE ENTRADA POR VOZ (NOVO)
// ============================================================================

// POST /api/exams/voice
// Upload e processamento de áudio com STT + interpretação
router.post(
  '/voice',
  uploadAudio.single('audio'),
  examVoiceController.uploadVoice.bind(examVoiceController)
)

// GET /api/exams/patient/:patientId/voice
// Listar exames de voz de um paciente
router.get(
  '/patient/:patientId/voice',
  examVoiceController.listPatientVoiceExams.bind(examVoiceController)
)

// ============================================================================
// ROTAS DE ANÁLISE DE TENDÊNCIAS (NOVO)
// ============================================================================

// GET /api/exams/trends/:patientId/summary
// Obter resumo geral de saúde do paciente baseado em tendências
router.get(
  '/trends/:patientId/summary',
  trendsController.getPatientTrendsSummary.bind(trendsController)
)

// GET /api/exams/trends/:patientId/critical
// Obter apenas marcadores com alertas críticos
router.get(
  '/trends/:patientId/critical',
  trendsController.getCriticalMarkers.bind(trendsController)
)

// GET /api/exams/trends/:patientId/:markerCode/statistics
// Obter apenas estatísticas (sem interpretação médica)
router.get(
  '/trends/:patientId/:markerCode/statistics',
  trendsController.getMarkerStatistics.bind(trendsController)
)

// GET /api/exams/trends/:patientId/:markerCode/compare
// Comparar tendência com população (futuro)
router.get(
  '/trends/:patientId/:markerCode/compare',
  trendsController.compareWithPopulation.bind(trendsController)
)

// GET /api/exams/trends/:patientId/:markerCode
// Obter tendência completa de um marcador específico
router.get(
  '/trends/:patientId/:markerCode',
  trendsController.getMarkerTrend.bind(trendsController)
)

// GET /api/exams/trends/:patientId
// Obter todas as tendências de marcadores do paciente
router.get(
  '/trends/:patientId',
  trendsController.getAllPatientTrends.bind(trendsController)
)

// ============================================================================
// ROTAS CRUD BÁSICAS (ORIGINAL)
// ============================================================================

// GET /api/exams?patientId=xxx&status=SCHEDULED
router.get('/', (req, res, next) => examsController.getExams(req, res, next))

// GET /api/exams/:id
router.get('/:id', (req, res, next) => examsController.getExamById(req, res, next))

// GET /api/exams/:examId/results
// Buscar exame com resultados detalhados (PDFs processados)
router.get(
  '/:examId/results',
  examUploadController.getExamResults.bind(examUploadController)
)

// GET /api/exams/:examId/pdf
// Download do PDF original
router.get(
  '/:examId/pdf',
  examUploadController.downloadPDF.bind(examUploadController)
)

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
