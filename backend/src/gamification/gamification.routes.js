"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var gamification_controller_1 = require("./gamification.controller");
var auth_middleware_1 = require("../auth/auth.middleware");
var client_1 = require("@prisma/client");
var router = (0, express_1.Router)();
// All routes require authentication as PATIENT
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorize)(client_1.UserRole.PATIENT));
// GET /api/gamification/achievements - Get all achievements with progress
router.get('/achievements', function (req, res) {
    return gamification_controller_1.gamificationController.getAchievements(req, res);
});
// GET /api/gamification/streak - Get current streak
router.get('/streak', function (req, res) {
    return gamification_controller_1.gamificationController.getStreak(req, res);
});
// GET /api/gamification/level - Get current level and XP
router.get('/level', function (req, res) {
    return gamification_controller_1.gamificationController.getLevel(req, res);
});
// POST /api/gamification/achievements/:id/unlock - Unlock achievement
router.post('/achievements/:id/unlock', function (req, res) {
    return gamification_controller_1.gamificationController.unlockAchievement(req, res);
});
// POST /api/gamification/xp - Add XP manually
router.post('/xp', function (req, res) {
    return gamification_controller_1.gamificationController.addXP(req, res);
});
// POST /api/gamification/activity - Log activity
router.post('/activity', function (req, res) {
    return gamification_controller_1.gamificationController.logActivity(req, res);
});
exports.default = router;
