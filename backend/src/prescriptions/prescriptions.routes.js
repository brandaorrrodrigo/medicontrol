"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var prescriptions_controller_1 = require("./prescriptions.controller");
var auth_middleware_1 = require("../auth/auth.middleware");
var router = (0, express_1.Router)();
// Todas as rotas requerem autenticação
router.use(auth_middleware_1.authenticate);
// GET /api/prescriptions?patientId=xxx
router.get('/', function (req, res, next) { return prescriptions_controller_1.prescriptionsController.getPrescriptions(req, res, next); });
// GET /api/prescriptions/:id
router.get('/:id', function (req, res, next) { return prescriptions_controller_1.prescriptionsController.getPrescriptionById(req, res, next); });
// POST /api/prescriptions
router.post('/', function (req, res, next) { return prescriptions_controller_1.prescriptionsController.createPrescription(req, res, next); });
// PUT /api/prescriptions/:id
router.put('/:id', function (req, res, next) { return prescriptions_controller_1.prescriptionsController.updatePrescription(req, res, next); });
// POST /api/prescriptions/:id/items
router.post('/:id/items', function (req, res, next) { return prescriptions_controller_1.prescriptionsController.addItem(req, res, next); });
// DELETE /api/prescriptions/items/:itemId
router.delete('/items/:itemId', function (req, res, next) { return prescriptions_controller_1.prescriptionsController.removeItem(req, res, next); });
// DELETE /api/prescriptions/:id
router.delete('/:id', function (req, res, next) { return prescriptions_controller_1.prescriptionsController.deletePrescription(req, res, next); });
exports.default = router;
