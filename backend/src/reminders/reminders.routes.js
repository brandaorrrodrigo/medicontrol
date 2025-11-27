"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var reminders_controller_1 = require("./reminders.controller");
var auth_middleware_1 = require("../auth/auth.middleware");
var router = (0, express_1.Router)();
// Todas as rotas requerem autenticação
router.use(auth_middleware_1.authenticate);
// GET /api/reminders/upcoming?patientId=xxx&limit=10
router.get('/upcoming', function (req, res, next) { return reminders_controller_1.remindersController.getUpcomingReminders(req, res, next); });
// GET /api/reminders/today?patientId=xxx
router.get('/today', function (req, res, next) { return reminders_controller_1.remindersController.getTodayReminders(req, res, next); });
// POST /api/reminders
router.post('/', function (req, res, next) { return reminders_controller_1.remindersController.createReminder(req, res, next); });
// POST /api/reminders/:id/mark-taken
router.post('/:id/mark-taken', function (req, res, next) { return reminders_controller_1.remindersController.markAsTaken(req, res, next); });
// DELETE /api/reminders/:id
router.delete('/:id', function (req, res, next) { return reminders_controller_1.remindersController.deleteReminder(req, res, next); });
exports.default = router;
