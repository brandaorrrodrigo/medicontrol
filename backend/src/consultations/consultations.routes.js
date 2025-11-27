"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var consultations_controller_1 = require("./consultations.controller");
var auth_middleware_1 = require("../auth/auth.middleware");
var router = (0, express_1.Router)();
// Todas as rotas requerem autenticação
router.use(auth_middleware_1.authenticate);
// GET /api/consultations?patientId=xxx OR ?professionalId=xxx
router.get('/', function (req, res, next) { return consultations_controller_1.consultationsController.getConsultations(req, res, next); });
// GET /api/consultations/:id
router.get('/:id', function (req, res, next) { return consultations_controller_1.consultationsController.getConsultationById(req, res, next); });
// POST /api/consultations
router.post('/', function (req, res, next) { return consultations_controller_1.consultationsController.createConsultation(req, res, next); });
// PUT /api/consultations/:id
router.put('/:id', function (req, res, next) { return consultations_controller_1.consultationsController.updateConsultation(req, res, next); });
// PATCH /api/consultations/:id/status
router.patch('/:id/status', function (req, res, next) { return consultations_controller_1.consultationsController.updateStatus(req, res, next); });
// DELETE /api/consultations/:id
router.delete('/:id', function (req, res, next) { return consultations_controller_1.consultationsController.deleteConsultation(req, res, next); });
exports.default = router;
