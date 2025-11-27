"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var helmet_1 = require("helmet");
var cookie_parser_1 = require("cookie-parser");
var express_rate_limit_1 = require("express-rate-limit");
var env_1 = require("./config/env");
// Importar rotas
var auth_routes_1 = require("./auth/auth.routes");
var dashboard_routes_1 = require("./dashboard/dashboard.routes");
var notifications_routes_1 = require("./notifications/notifications.routes");
var medications_routes_1 = require("./medications/medications.routes");
var reminders_routes_1 = require("./reminders/reminders.routes");
var vitals_routes_1 = require("./vitals/vitals.routes");
var patients_routes_1 = require("./patients/patients.routes");
var exams_routes_1 = require("./exams/exams.routes");
var photos_routes_1 = require("./photos/photos.routes");
var prescriptions_routes_1 = require("./prescriptions/prescriptions.routes");
var consultations_routes_1 = require("./consultations/consultations.routes");
var alerts_routes_1 = require("./alerts/alerts.routes");
var gamification_routes_1 = require("./gamification/gamification.routes");
var calendar_routes_1 = require("./calendar/calendar.routes");
var app = (0, express_1.default)();
// Middleware de segurança
app.use((0, helmet_1.default)());
// CORS
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
}));
// Rate limiting
var limiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.env.RATE_LIMIT_WINDOW_MS,
    max: env_1.env.RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);
// Body parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Health check
app.get('/health', function (_req, res) {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: env_1.env.NODE_ENV,
    });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/notifications', notifications_routes_1.default);
app.use('/api/medications', medications_routes_1.default);
app.use('/api/reminders', reminders_routes_1.default);
app.use('/api/vitals', vitals_routes_1.default);
app.use('/api/patients', patients_routes_1.default);
app.use('/api/exams', exams_routes_1.default);
app.use('/api/photos', photos_routes_1.default);
app.use('/api/prescriptions', prescriptions_routes_1.default);
app.use('/api/consultations', consultations_routes_1.default);
app.use('/api/alerts', alerts_routes_1.default);
app.use('/api/gamification', gamification_routes_1.default);
app.use('/api/calendar', calendar_routes_1.default);
// 404 Handler
app.use(function (req, res) {
    res.status(404).json({
        error: 'Not Found',
        message: "Route ".concat(req.method, " ").concat(req.path, " not found"),
    });
});
// Error Handler
app.use(function (err, _req, res, _next) {
    console.error('Error:', err);
    res.status(500).json(__assign({ error: 'Internal Server Error', message: env_1.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' }, (env_1.env.NODE_ENV === 'development' && { stack: err.stack })));
});
exports.default = app;
