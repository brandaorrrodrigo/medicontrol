"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamificationService = exports.GamificationService = exports.XP_PER_LEVEL = exports.XP_REWARDS = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
// XP rewards configuration
exports.XP_REWARDS = {
    medicationTaken: 10,
    medicationOnTime: 20,
    vitalSigned: 10,
    examRegistered: 15,
    consultationAttended: 20,
    weeklyStreak: 50,
    monthlyStreak: 200,
};
// XP required for each level
exports.XP_PER_LEVEL = [
    0, // Level 1
    100, // Level 2
    250, // Level 3
    500, // Level 4
    800, // Level 5
    1200, // Level 6
    1700, // Level 7
    2300, // Level 8
    3000, // Level 9
    3800, // Level 10
    4700, // Level 11
    5700, // Level 12
    6800, // Level 13
    8000, // Level 14
    9300, // Level 15
    10700, // Level 16
    12200, // Level 17
    13800, // Level 18
    15500, // Level 19
    17300, // Level 20
];
var GamificationService = /** @class */ (function () {
    function GamificationService() {
    }
    // Calculate current level and XP from total XP
    GamificationService.prototype.calculateLevel = function (totalXP) {
        var level = 1;
        var remainingXP = totalXP;
        for (var i = 1; i < exports.XP_PER_LEVEL.length; i++) {
            if (remainingXP >= exports.XP_PER_LEVEL[i]) {
                remainingXP -= exports.XP_PER_LEVEL[i];
                level++;
            }
            else {
                break;
            }
        }
        var xpToNextLevel = level < exports.XP_PER_LEVEL.length ? exports.XP_PER_LEVEL[level] : 5000;
        return {
            level: level,
            currentXP: remainingXP,
            xpToNextLevel: xpToNextLevel,
        };
    };
    // Calculate current streak for a patient
    GamificationService.prototype.calculateStreak = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var activities, streak, today, lastActivity, daysDiff, uniqueDates, sortedDates, currentDate, i, activityDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.activityLog.findMany({
                            where: { patientId: patientId },
                            orderBy: { date: 'desc' },
                            select: { date: true },
                        })];
                    case 1:
                        activities = _a.sent();
                        if (activities.length === 0)
                            return [2 /*return*/, 0];
                        streak = 0;
                        today = new Date();
                        today.setHours(0, 0, 0, 0);
                        lastActivity = new Date(activities[0].date);
                        lastActivity.setHours(0, 0, 0, 0);
                        daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
                        if (daysDiff > 1) {
                            // Streak broken
                            return [2 /*return*/, 0];
                        }
                        uniqueDates = new Set();
                        activities.forEach(function (activity) {
                            var date = new Date(activity.date);
                            date.setHours(0, 0, 0, 0);
                            uniqueDates.add(date.toISOString());
                        });
                        sortedDates = Array.from(uniqueDates).sort().reverse();
                        currentDate = new Date(sortedDates[0]);
                        for (i = 0; i < sortedDates.length; i++) {
                            activityDate = new Date(sortedDates[i]);
                            if (activityDate.getTime() === currentDate.getTime()) {
                                streak++;
                                currentDate.setDate(currentDate.getDate() - 1);
                            }
                            else {
                                // Day skipped, streak broken
                                break;
                            }
                        }
                        return [2 /*return*/, streak];
                }
            });
        });
    };
    // Get or create gamification profile
    GamificationService.prototype.getOrCreateGamification = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var gamification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.userGamification.findUnique({
                            where: { patientId: patientId },
                        })];
                    case 1:
                        gamification = _a.sent();
                        if (!!gamification) return [3 /*break*/, 3];
                        return [4 /*yield*/, prisma.userGamification.create({
                                data: {
                                    patientId: patientId,
                                    level: 1,
                                    currentXP: 0,
                                    totalXP: 0,
                                    currentStreak: 0,
                                    bestStreak: 0,
                                    totalDays: 0,
                                },
                            })];
                    case 2:
                        gamification = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, gamification];
                }
            });
        });
    };
    // Get streak data
    GamificationService.prototype.getStreak = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var gamification, currentStreak;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getOrCreateGamification(patientId)];
                    case 1:
                        gamification = _a.sent();
                        return [4 /*yield*/, this.calculateStreak(patientId)
                            // Update if changed
                        ];
                    case 2:
                        currentStreak = _a.sent();
                        if (!(currentStreak !== gamification.currentStreak)) return [3 /*break*/, 4];
                        return [4 /*yield*/, prisma.userGamification.update({
                                where: { patientId: patientId },
                                data: {
                                    currentStreak: currentStreak,
                                    bestStreak: Math.max(currentStreak, gamification.bestStreak),
                                },
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, {
                            current: currentStreak,
                            longest: Math.max(currentStreak, gamification.bestStreak),
                            lastActivityDate: gamification.lastActive,
                            totalDays: gamification.totalDays,
                        }];
                }
            });
        });
    };
    // Get level data
    GamificationService.prototype.getLevel = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var gamification, levelData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getOrCreateGamification(patientId)];
                    case 1:
                        gamification = _a.sent();
                        levelData = this.calculateLevel(gamification.totalXP);
                        return [2 /*return*/, {
                                level: levelData.level,
                                currentXP: levelData.currentXP,
                                xpToNextLevel: levelData.xpToNextLevel,
                                totalXP: gamification.totalXP,
                            }];
                }
            });
        });
    };
    // Get achievements with progress
    GamificationService.prototype.getAchievements = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var achievements, userAchievements, userAchievementMap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.achievement.findMany({
                            orderBy: [
                                { rarity: 'asc' },
                                { xp: 'asc' },
                            ],
                        })
                        // Get user achievements
                    ];
                    case 1:
                        achievements = _a.sent();
                        return [4 /*yield*/, prisma.userAchievement.findMany({
                                where: { patientId: patientId },
                                include: { achievement: true },
                            })
                            // Create a map for quick lookup
                        ];
                    case 2:
                        userAchievements = _a.sent();
                        userAchievementMap = new Map(userAchievements.map(function (ua) { return [ua.achievementId, ua]; }));
                        // Combine data
                        return [2 /*return*/, achievements.map(function (achievement) {
                                var userAchievement = userAchievementMap.get(achievement.id);
                                return {
                                    id: achievement.id,
                                    title: achievement.title,
                                    description: achievement.description,
                                    category: achievement.category,
                                    rarity: achievement.rarity,
                                    icon: achievement.icon,
                                    total: achievement.total,
                                    xp: achievement.xp,
                                    progress: (userAchievement === null || userAchievement === void 0 ? void 0 : userAchievement.progress) || 0,
                                    unlocked: (userAchievement === null || userAchievement === void 0 ? void 0 : userAchievement.unlocked) || false,
                                    unlockedAt: (userAchievement === null || userAchievement === void 0 ? void 0 : userAchievement.unlockedAt) || null,
                                };
                            })];
                }
            });
        });
    };
    // Add XP to user
    GamificationService.prototype.addXP = function (patientId, xp) {
        return __awaiter(this, void 0, void 0, function () {
            var gamification, newTotalXP, oldLevel, newLevel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getOrCreateGamification(patientId)];
                    case 1:
                        gamification = _a.sent();
                        newTotalXP = gamification.totalXP + xp;
                        oldLevel = this.calculateLevel(gamification.totalXP).level;
                        newLevel = this.calculateLevel(newTotalXP).level;
                        return [4 /*yield*/, prisma.userGamification.update({
                                where: { patientId: patientId },
                                data: {
                                    totalXP: newTotalXP,
                                    level: newLevel,
                                    lastActive: new Date(),
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                xpAdded: xp,
                                totalXP: newTotalXP,
                                leveledUp: newLevel > oldLevel,
                                newLevel: newLevel,
                            }];
                }
            });
        });
    };
    // Log activity
    GamificationService.prototype.logActivity = function (patientId, type, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.activityLog.create({
                            data: {
                                patientId: patientId,
                                type: type,
                                metadata: metadata,
                                date: new Date(),
                            },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Unlock achievement
    GamificationService.prototype.unlockAchievement = function (patientId, achievementId) {
        return __awaiter(this, void 0, void 0, function () {
            var achievement, userAchievement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.achievement.findUnique({
                            where: { id: achievementId },
                        })];
                    case 1:
                        achievement = _a.sent();
                        if (!achievement) {
                            throw new Error('Achievement not found');
                        }
                        return [4 /*yield*/, prisma.userAchievement.findUnique({
                                where: {
                                    patientId_achievementId: {
                                        patientId: patientId,
                                        achievementId: achievementId,
                                    },
                                },
                            })];
                    case 2:
                        userAchievement = _a.sent();
                        if (!!userAchievement) return [3 /*break*/, 4];
                        return [4 /*yield*/, prisma.userAchievement.create({
                                data: {
                                    patientId: patientId,
                                    achievementId: achievementId,
                                    progress: achievement.total,
                                    unlocked: true,
                                    unlockedAt: new Date(),
                                },
                            })];
                    case 3:
                        userAchievement = _a.sent();
                        return [3 /*break*/, 7];
                    case 4:
                        if (!!userAchievement.unlocked) return [3 /*break*/, 6];
                        return [4 /*yield*/, prisma.userAchievement.update({
                                where: {
                                    patientId_achievementId: {
                                        patientId: patientId,
                                        achievementId: achievementId,
                                    },
                                },
                                data: {
                                    progress: achievement.total,
                                    unlocked: true,
                                    unlockedAt: new Date(),
                                },
                            })];
                    case 5:
                        userAchievement = _a.sent();
                        return [3 /*break*/, 7];
                    case 6: throw new Error('Achievement already unlocked');
                    case 7: 
                    // Add XP
                    return [4 /*yield*/, this.addXP(patientId, achievement.xp)];
                    case 8:
                        // Add XP
                        _a.sent();
                        return [2 /*return*/, userAchievement];
                }
            });
        });
    };
    // Update achievement progress
    GamificationService.prototype.updateAchievementProgress = function (patientId, achievementId, progress) {
        return __awaiter(this, void 0, void 0, function () {
            var achievement, userAchievement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.achievement.findUnique({
                            where: { id: achievementId },
                        })];
                    case 1:
                        achievement = _a.sent();
                        if (!achievement) {
                            throw new Error('Achievement not found');
                        }
                        return [4 /*yield*/, prisma.userAchievement.upsert({
                                where: {
                                    patientId_achievementId: {
                                        patientId: patientId,
                                        achievementId: achievementId,
                                    },
                                },
                                update: {
                                    progress: progress,
                                },
                                create: {
                                    patientId: patientId,
                                    achievementId: achievementId,
                                    progress: progress,
                                },
                            })
                            // Auto-unlock if progress >= total
                        ];
                    case 2:
                        userAchievement = _a.sent();
                        if (!(progress >= achievement.total && !userAchievement.unlocked)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.unlockAchievement(patientId, achievementId)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, userAchievement];
                }
            });
        });
    };
    return GamificationService;
}());
exports.GamificationService = GamificationService;
exports.gamificationService = new GamificationService();
