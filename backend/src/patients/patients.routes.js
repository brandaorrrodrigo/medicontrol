"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var patients_controller_1 = require("./patients.controller");
var medication_photos_controller_1 = require("../medication-photos/medication-photos.controller");
var auth_middleware_1 = require("../auth/auth.middleware");
var router = (0, express_1.Router)();
// Todas as rotas requerem autenticação
router.use(auth_middleware_1.authenticate);
// GET /api/patients
router.get('/', function (req, res, next) { return patients_controller_1.patientsController.getPatients(req, res, next); });
// GET /api/patients/:id
router.get('/:id', function (req, res, next) { return patients_controller_1.patientsController.getPatientById(req, res, next); });
// PUT /api/patients/:id
router.put('/:id', function (req, res, next) { return patients_controller_1.patientsController.updatePatient(req, res, next); });
// GET /api/patients/:patientId/medication-photos?type=MEDICATION_BOX
router.get('/:patientId/medication-photos', function (req, res, next) {
    return medication_photos_controller_1.medicationPhotosController.getPatientMedicationPhotos(req, res, next);
});
// POST /api/patients/:id/link-caregiver
router.post('/:id/link-caregiver', function (req, res, next) { return patients_controller_1.patientsController.linkCaregiver(req, res, next); });
// DELETE /api/patients/:id/unlink-caregiver/:caregiverId
router.delete('/:id/unlink-caregiver/:caregiverId', function (req, res, next) { return patients_controller_1.patientsController.unlinkCaregiver(req, res, next); });
// POST /api/patients/:id/link-professional
router.post('/:id/link-professional', function (req, res, next) { return patients_controller_1.patientsController.linkProfessional(req, res, next); });
// DELETE /api/patients/:id/unlink-professional/:professionalId
router.delete('/:id/unlink-professional/:professionalId', function (req, res, next) { return patients_controller_1.patientsController.unlinkProfessional(req, res, next); });
exports.default = router;
