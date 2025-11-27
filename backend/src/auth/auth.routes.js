"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_controller_1 = require("./auth.controller");
var auth_middleware_1 = require("./auth.middleware");
var router = (0, express_1.Router)();
// Rotas públicas
router.post('/register', function (req, res, next) { return auth_controller_1.authController.register(req, res, next); });
router.post('/login', function (req, res, next) { return auth_controller_1.authController.login(req, res, next); });
router.post('/refresh', function (req, res, next) { return auth_controller_1.authController.refresh(req, res, next); });
router.post('/logout', function (req, res, next) { return auth_controller_1.authController.logout(req, res, next); });
router.post('/forgot-password', function (req, res, next) { return auth_controller_1.authController.forgotPassword(req, res, next); });
router.post('/reset-password', function (req, res, next) { return auth_controller_1.authController.resetPassword(req, res, next); });
// Rotas protegidas
router.get('/me', auth_middleware_1.authenticate, function (req, res, next) { return auth_controller_1.authController.me(req, res, next); });
exports.default = router;
