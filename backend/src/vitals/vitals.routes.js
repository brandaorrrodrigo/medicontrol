"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var vitals_controller_1 = require("./vitals.controller");
var auth_middleware_1 = require("../auth/auth.middleware");
var router = (0, express_1.Router)();
// Todas as rotas requerem autenticação
router.use(auth_middleware_1.authenticate);
// GET /api/vitals/stats?patientId=xxx&type=BLOOD_PRESSURE&days=30
router.get('/stats', function (req, res, next) { return vitals_controller_1.vitalsController.getStats(req, res, next); });
// GET /api/vitals?patientId=xxx&type=BLOOD_PRESSURE&limit=50
router.get('/', function (req, res, next) { return vitals_controller_1.vitalsController.getVitalSigns(req, res, next); });
// POST /api/vitals
router.post('/', function (req, res, next) { return vitals_controller_1.vitalsController.createVitalSign(req, res, next); });
// DELETE /api/vitals/:id
router.delete('/:id', function (req, res, next) { return vitals_controller_1.vitalsController.deleteVitalSign(req, res, next); });
exports.default = router;
