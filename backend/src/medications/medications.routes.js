"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var medications_controller_1 = require("./medications.controller");
var medication_photos_controller_1 = require("../medication-photos/medication-photos.controller");
var stockController = require("../alerts/stock.controller");
var auth_middleware_1 = require("../auth/auth.middleware");
var upload_config_1 = require("../common/upload.config");
var router = (0, express_1.Router)();
// Todas as rotas requerem autenticação
router.use(auth_middleware_1.authenticate);
// ============================================================================
// MEDICATION ROUTES
// ============================================================================
// GET /api/medications?patientId=xxx&active=true
router.get('/', function (req, res, _next) { return medications_controller_1.medicationsController.getMedications(req, res, _next); });
// GET /api/medications/:id
router.get('/:id', function (req, res, _next) { return medications_controller_1.medicationsController.getMedicationById(req, res, _next); });
// POST /api/medications
router.post('/', function (req, res, _next) { return medications_controller_1.medicationsController.createMedication(req, res, _next); });
// PUT /api/medications/:id
router.put('/:id', function (req, res, _next) { return medications_controller_1.medicationsController.updateMedication(req, res, _next); });
// DELETE /api/medications/:id
router.delete('/:id', function (req, res, _next) { return medications_controller_1.medicationsController.deleteMedication(req, res, _next); });
// ============================================================================
// MEDICATION PHOTOS ROUTES
// ============================================================================
// GET /api/medications/photos/:photoId - DEVE VIR ANTES DE /:medicationId/photos
router.get('/photos/:photoId', function (req, res, next) {
    return medication_photos_controller_1.medicationPhotosController.getMedicationPhotoById(req, res, next);
});
// PUT /api/medications/photos/:photoId
router.put('/photos/:photoId', function (req, res, next) {
    return medication_photos_controller_1.medicationPhotosController.updateMedicationPhoto(req, res, next);
});
// DELETE /api/medications/photos/:photoId
router.delete('/photos/:photoId', function (req, res, next) {
    return medication_photos_controller_1.medicationPhotosController.deleteMedicationPhoto(req, res, next);
});
// GET /api/medications/:medicationId/photos?type=MEDICATION_BOX
router.get('/:medicationId/photos', function (req, res, next) {
    return medication_photos_controller_1.medicationPhotosController.getMedicationPhotos(req, res, next);
});
// POST /api/medications/:medicationId/photos - Upload de foto
router.post('/:medicationId/photos', upload_config_1.uploadPhoto.single('photo'), function (req, res, next) {
    return medication_photos_controller_1.medicationPhotosController.uploadMedicationPhoto(req, res, next);
});
// ============================================================================
// STOCK MANAGEMENT ROUTES
// ============================================================================
// GET /api/medications/:medicationId/stock
router.get('/:medicationId/stock', function (req, res, _next) {
    return stockController.getStock(req, res);
});
// POST /api/medications/:medicationId/stock
router.post('/:medicationId/stock', function (req, res, _next) {
    return stockController.createStock(req, res);
});
// PUT /api/medications/:medicationId/stock
router.put('/:medicationId/stock', function (req, res, _next) {
    return stockController.updateStock(req, res);
});
// DELETE /api/medications/:medicationId/stock
router.delete('/:medicationId/stock', function (req, res, _next) {
    return stockController.deleteStock(req, res);
});
// POST /api/medications/:medicationId/stock/consume
router.post('/:medicationId/stock/consume', function (req, res, _next) {
    return stockController.consumeStock(req, res);
});
// POST /api/medications/:medicationId/stock/restock
router.post('/:medicationId/stock/restock', function (req, res, _next) {
    return stockController.restockMedication(req, res);
});
exports.default = router;
