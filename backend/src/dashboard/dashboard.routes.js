"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dashboard_controller_1 = require("./dashboard.controller");
var auth_middleware_1 = require("../auth/auth.middleware");
var client_1 = require("@prisma/client");
var router = (0, express_1.Router)();
// Todas as rotas requerem autenticação
router.use(auth_middleware_1.authenticate);
// GET /api/dashboard/patient - Dashboard do paciente
router.get('/patient', (0, auth_middleware_1.authorize)(client_1.UserRole.PATIENT), function (req, res, next) { return dashboard_controller_1.dashboardController.getPatientDashboard(req, res, next); });
// GET /api/dashboard/caregiver - Dashboard do cuidador
router.get('/caregiver', (0, auth_middleware_1.authorize)(client_1.UserRole.CAREGIVER), function (req, res, next) { return dashboard_controller_1.dashboardController.getCaregiverDashboard(req, res, next); });
// GET /api/dashboard/professional - Dashboard do profissional
router.get('/professional', (0, auth_middleware_1.authorize)(client_1.UserRole.PROFESSIONAL), function (req, res, next) { return dashboard_controller_1.dashboardController.getProfessionalDashboard(req, res, next); });
// ============================================================================
// DASHBOARD CONFIG ROUTES
// ============================================================================
// GET /api/dashboard/config - Get dashboard configuration
router.get('/config', (0, auth_middleware_1.authorize)(client_1.UserRole.PATIENT), function (req, res) { return dashboard_controller_1.dashboardController.getConfig(req, res); });
// POST /api/dashboard/config - Save dashboard configuration
router.post('/config', (0, auth_middleware_1.authorize)(client_1.UserRole.PATIENT), function (req, res) { return dashboard_controller_1.dashboardController.saveConfig(req, res); });
// ============================================================================
// WIDGET DATA ROUTES
// ============================================================================
// GET /api/dashboard/widgets/stats
router.get('/widgets/stats', (0, auth_middleware_1.authorize)(client_1.UserRole.PATIENT), function (req, res) { return dashboard_controller_1.dashboardController.getStatsWidget(req, res); });
// GET /api/dashboard/widgets/medications
router.get('/widgets/medications', (0, auth_middleware_1.authorize)(client_1.UserRole.PATIENT), function (req, res) { return dashboard_controller_1.dashboardController.getMedicationsWidget(req, res); });
// GET /api/dashboard/widgets/vitals
router.get('/widgets/vitals', (0, auth_middleware_1.authorize)(client_1.UserRole.PATIENT), function (req, res) { return dashboard_controller_1.dashboardController.getVitalsWidget(req, res); });
// GET /api/dashboard/widgets/consultations
router.get('/widgets/consultations', (0, auth_middleware_1.authorize)(client_1.UserRole.PATIENT), function (req, res) { return dashboard_controller_1.dashboardController.getConsultationsWidget(req, res); });
// GET /api/dashboard/widgets/exams
router.get('/widgets/exams', (0, auth_middleware_1.authorize)(client_1.UserRole.PATIENT), function (req, res) { return dashboard_controller_1.dashboardController.getExamsWidget(req, res); });
exports.default = router;
