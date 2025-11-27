"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = require("multer");
var path_1 = require("path");
var fs_1 = require("fs");
var exams_controller_1 = require("./exams.controller");
var exam_upload_controller_1 = require("./exam-upload.controller");
var exam_photo_upload_controller_1 = require("./exam-photo-upload.controller");
var exam_manual_controller_1 = require("./exam-manual.controller");
var exam_voice_controller_1 = require("./exam-voice.controller");
var trends_controller_1 = require("./trends.controller");
var auth_middleware_1 = require("../auth/auth.middleware");
var upload_config_1 = require("../common/upload.config");
var router = (0, express_1.Router)();
// ============================================================================
// CONFIGURAÇÃO DO MULTER PARA UPLOAD DE PDFs
// ============================================================================
// Criar diretório de uploads se não existir
var UPLOAD_DIR = path_1.default.join(process.cwd(), 'uploads', 'exams');
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
// Configuração do storage
var storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (_req, file, cb) {
        // Gerar nome único: timestamp-uuid-original.pdf
        var uniqueSuffix = "".concat(Date.now(), "-").concat(Math.random().toString(36).substring(7));
        var sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, "".concat(uniqueSuffix, "-").concat(sanitizedName));
    }
});
// Filtro de arquivo - aceitar apenas PDFs
var fileFilter = function (_req, file, cb) {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    }
    else {
        cb(new Error('Apenas arquivos PDF são permitidos'));
    }
};
// Configuração do multer para PDFs
var uploadPDF = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    }
});
// ============================================================================
// CONFIGURAÇÃO DO MULTER PARA UPLOAD DE FOTOS
// ============================================================================
// Filtro para fotos - aceitar apenas imagens
var photoFilter = function (_req, file, cb) {
    var validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (validImageTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Apenas arquivos de imagem são permitidos (JPEG, PNG, WebP)'));
    }
};
// Configuração do multer para fotos
var uploadPhoto = (0, multer_1.default)({
    storage: storage,
    fileFilter: photoFilter,
    limits: {
        fileSize: 15 * 1024 * 1024 // 15MB max (fotos podem ser maiores que PDFs)
    }
});
// ============================================================================
// CONFIGURAÇÃO DO MULTER PARA UPLOAD DE ÁUDIO (VOZ)
// ============================================================================
// Filtro para áudio - aceitar apenas arquivos de áudio
var audioFilter = function (_req, file, cb) {
    var validAudioTypes = [
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
    ];
    if (validAudioTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Apenas arquivos de áudio são permitidos (WAV, MP3, M4A, OGG, WebM)'));
    }
};
// Configuração do multer para áudio
var uploadAudio = (0, multer_1.default)({
    storage: storage,
    fileFilter: audioFilter,
    limits: {
        fileSize: 25 * 1024 * 1024 // 25MB max (limite do Whisper API)
    }
});
// ============================================================================
// ROTAS
// ============================================================================
// Todas as rotas requerem autenticação
router.use(auth_middleware_1.authenticate);
// ============================================================================
// ROTAS DE PDF UPLOAD E PROCESSAMENTO (NOVO)
// ============================================================================
// POST /api/exams/upload-pdf
// Upload e processamento automático de PDF de exame
router.post('/upload-pdf', uploadPDF.single('pdf'), exam_upload_controller_1.examUploadController.uploadPDF.bind(exam_upload_controller_1.examUploadController));
// GET /api/exams/patient/:patientId/all
// Listar todos os exames de um paciente (incluindo PDFs processados)
router.get('/patient/:patientId/all', exam_upload_controller_1.examUploadController.listPatientExams.bind(exam_upload_controller_1.examUploadController));
// ============================================================================
// ROTAS DE FOTO UPLOAD E OCR (NOVO)
// ============================================================================
// POST /api/exams/upload-photo
// Upload e processamento automático de foto de exame com OCR
router.post('/upload-photo', uploadPhoto.single('photo'), exam_photo_upload_controller_1.examPhotoUploadController.uploadPhoto.bind(exam_photo_upload_controller_1.examPhotoUploadController));
// GET /api/exams/patient/:patientId/photos
// Listar todos os exames de foto de um paciente
router.get('/patient/:patientId/photos', exam_photo_upload_controller_1.examPhotoUploadController.listPatientPhotoExams.bind(exam_photo_upload_controller_1.examPhotoUploadController));
// GET /api/exams/:examId/photo-results
// Buscar exame de foto com resultados detalhados
router.get('/:examId/photo-results', exam_photo_upload_controller_1.examPhotoUploadController.getPhotoResults.bind(exam_photo_upload_controller_1.examPhotoUploadController));
// GET /api/exams/:examId/photo
// Download da foto original
router.get('/:examId/photo', exam_photo_upload_controller_1.examPhotoUploadController.downloadPhoto.bind(exam_photo_upload_controller_1.examPhotoUploadController));
// GET /api/exams/:examId/processed-photo
// Download da foto processada (com pré-processamento para OCR)
router.get('/:examId/processed-photo', exam_photo_upload_controller_1.examPhotoUploadController.downloadProcessedPhoto.bind(exam_photo_upload_controller_1.examPhotoUploadController));
// ============================================================================
// ROTAS DE ENTRADA MANUAL (NOVO)
// ============================================================================
// POST /api/exams/manual
// Entrada manual individual de resultado de exame
router.post('/manual', exam_manual_controller_1.examManualController.createManualEntry.bind(exam_manual_controller_1.examManualController));
// POST /api/exams/manual/batch
// Entrada manual em lote (múltiplos marcadores)
router.post('/manual/batch', exam_manual_controller_1.examManualController.createManualBatch.bind(exam_manual_controller_1.examManualController));
// GET /api/exams/markers
// Listar todos os marcadores disponíveis
router.get('/markers', exam_manual_controller_1.examManualController.listMarkers.bind(exam_manual_controller_1.examManualController));
// GET /api/exams/markers/:markerCode
// Obter informações detalhadas de um marcador
router.get('/markers/:markerCode', exam_manual_controller_1.examManualController.getMarkerInfo.bind(exam_manual_controller_1.examManualController));
// ============================================================================
// ROTAS DE ENTRADA POR VOZ (NOVO)
// ============================================================================
// POST /api/exams/voice
// Upload e processamento de áudio com STT + interpretação
router.post('/voice', uploadAudio.single('audio'), exam_voice_controller_1.examVoiceController.uploadVoice.bind(exam_voice_controller_1.examVoiceController));
// GET /api/exams/patient/:patientId/voice
// Listar exames de voz de um paciente
router.get('/patient/:patientId/voice', exam_voice_controller_1.examVoiceController.listPatientVoiceExams.bind(exam_voice_controller_1.examVoiceController));
// ============================================================================
// ROTAS DE ANÁLISE DE TENDÊNCIAS (NOVO)
// ============================================================================
// GET /api/exams/trends/:patientId/summary
// Obter resumo geral de saúde do paciente baseado em tendências
router.get('/trends/:patientId/summary', trends_controller_1.trendsController.getPatientTrendsSummary.bind(trends_controller_1.trendsController));
// GET /api/exams/trends/:patientId/critical
// Obter apenas marcadores com alertas críticos
router.get('/trends/:patientId/critical', trends_controller_1.trendsController.getCriticalMarkers.bind(trends_controller_1.trendsController));
// GET /api/exams/trends/:patientId/:markerCode/statistics
// Obter apenas estatísticas (sem interpretação médica)
router.get('/trends/:patientId/:markerCode/statistics', trends_controller_1.trendsController.getMarkerStatistics.bind(trends_controller_1.trendsController));
// GET /api/exams/trends/:patientId/:markerCode/compare
// Comparar tendência com população (futuro)
router.get('/trends/:patientId/:markerCode/compare', trends_controller_1.trendsController.compareWithPopulation.bind(trends_controller_1.trendsController));
// GET /api/exams/trends/:patientId/:markerCode
// Obter tendência completa de um marcador específico
router.get('/trends/:patientId/:markerCode', trends_controller_1.trendsController.getMarkerTrend.bind(trends_controller_1.trendsController));
// GET /api/exams/trends/:patientId
// Obter todas as tendências de marcadores do paciente
router.get('/trends/:patientId', trends_controller_1.trendsController.getAllPatientTrends.bind(trends_controller_1.trendsController));
// ============================================================================
// ROTAS CRUD BÁSICAS (ORIGINAL)
// ============================================================================
// GET /api/exams?patientId=xxx&status=SCHEDULED
router.get('/', function (req, res, next) { return exams_controller_1.examsController.getExams(req, res, next); });
// GET /api/exams/:id
router.get('/:id', function (req, res, next) { return exams_controller_1.examsController.getExamById(req, res, next); });
// GET /api/exams/:examId/results
// Buscar exame com resultados detalhados (PDFs processados)
router.get('/:examId/results', exam_upload_controller_1.examUploadController.getExamResults.bind(exam_upload_controller_1.examUploadController));
// GET /api/exams/:examId/pdf
// Download do PDF original
router.get('/:examId/pdf', exam_upload_controller_1.examUploadController.downloadPDF.bind(exam_upload_controller_1.examUploadController));
// POST /api/exams
router.post('/', function (req, res, next) { return exams_controller_1.examsController.createExam(req, res, next); });
// PUT /api/exams/:id
router.put('/:id', function (req, res, next) { return exams_controller_1.examsController.updateExam(req, res, next); });
// POST /api/exams/:id/upload - Upload de arquivo
router.post('/:id/upload', upload_config_1.uploadExam.single('file'), function (req, res, next) { return exams_controller_1.examsController.uploadFile(req, res, next); });
// DELETE /api/exams/files/:fileId
router.delete('/files/:fileId', function (req, res, next) { return exams_controller_1.examsController.deleteFile(req, res, next); });
// DELETE /api/exams/:id
router.delete('/:id', function (req, res, next) { return exams_controller_1.examsController.deleteExam(req, res, next); });
exports.default = router;
