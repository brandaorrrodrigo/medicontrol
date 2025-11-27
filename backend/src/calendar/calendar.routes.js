"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var calendar_controller_1 = require("./calendar.controller");
var auth_middleware_1 = require("../auth/auth.middleware");
var client_1 = require("@prisma/client");
var router = (0, express_1.Router)();
// All routes require authentication as PATIENT
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorize)(client_1.UserRole.PATIENT));
// GET /api/calendar/events?month=X&year=Y - Get calendar events for a month
router.get('/events', function (req, res) { return calendar_controller_1.calendarController.getEvents(req, res); });
exports.default = router;
