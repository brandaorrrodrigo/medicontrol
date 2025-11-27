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
exports.authController = exports.AuthController = void 0;
var auth_service_1 = require("./auth.service");
var auth_validator_1 = require("./auth.validator");
var zod_1 = require("zod");
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    // POST /api/auth/register
    AuthController.prototype.register = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = auth_validator_1.registerSchema.parse(req.body);
                        return [4 /*yield*/, auth_service_1.authService.register(data)
                            // Definir refresh token como httpOnly cookie
                        ];
                    case 1:
                        result = _a.sent();
                        // Definir refresh token como httpOnly cookie
                        res.cookie('refreshToken', result.refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
                        });
                        return [2 /*return*/, res.status(201).json({
                                success: true,
                                data: {
                                    user: result.user,
                                    accessToken: result.accessToken,
                                },
                            })];
                    case 2:
                        error_1 = _a.sent();
                        if (error_1 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Validation error',
                                    details: error_1.errors,
                                })];
                        }
                        if (error_1 instanceof Error) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: error_1.message,
                                })];
                        }
                        return [2 /*return*/, next(error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/auth/login
    AuthController.prototype.login = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = auth_validator_1.loginSchema.parse(req.body);
                        return [4 /*yield*/, auth_service_1.authService.login(data)
                            // Definir refresh token como httpOnly cookie
                        ];
                    case 1:
                        result = _a.sent();
                        // Definir refresh token como httpOnly cookie
                        res.cookie('refreshToken', result.refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
                        });
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: {
                                    user: result.user,
                                    accessToken: result.accessToken,
                                },
                            })];
                    case 2:
                        error_2 = _a.sent();
                        if (error_2 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Validation error',
                                    details: error_2.errors,
                                })];
                        }
                        if (error_2 instanceof Error) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    error: error_2.message,
                                })];
                        }
                        return [2 /*return*/, next(error_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/auth/refresh
    AuthController.prototype.refresh = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var refreshToken, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        refreshToken = req.cookies.refreshToken || req.body.refreshToken;
                        if (!refreshToken) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    error: 'Refresh token não fornecido',
                                })];
                        }
                        return [4 /*yield*/, auth_service_1.authService.refreshToken(refreshToken)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: result,
                            })];
                    case 2:
                        error_3 = _a.sent();
                        if (error_3 instanceof Error) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    error: error_3.message,
                                })];
                        }
                        return [2 /*return*/, next(error_3)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/auth/logout
    AuthController.prototype.logout = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var refreshToken, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        refreshToken = req.cookies.refreshToken || req.body.refreshToken;
                        if (!refreshToken) return [3 /*break*/, 2];
                        return [4 /*yield*/, auth_service_1.authService.logout(refreshToken)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        res.clearCookie('refreshToken');
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: 'Logout realizado com sucesso',
                            })];
                    case 3:
                        error_4 = _a.sent();
                        return [2 /*return*/, next(error_4)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/auth/forgot-password
    AuthController.prototype.forgotPassword = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = auth_validator_1.forgotPasswordSchema.parse(req.body);
                        return [4 /*yield*/, auth_service_1.authService.forgotPassword(data.email)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: 'Se o email existir, você receberá instruções para redefinir sua senha',
                            })];
                    case 2:
                        error_5 = _a.sent();
                        if (error_5 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Validation error',
                                    details: error_5.errors,
                                })];
                        }
                        return [2 /*return*/, next(error_5)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/auth/reset-password
    AuthController.prototype.resetPassword = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = auth_validator_1.resetPasswordSchema.parse(req.body);
                        return [4 /*yield*/, auth_service_1.authService.resetPassword(data.token, data.password)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: 'Senha redefinida com sucesso',
                            })];
                    case 2:
                        error_6 = _a.sent();
                        if (error_6 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Validation error',
                                    details: error_6.errors,
                                })];
                        }
                        if (error_6 instanceof Error) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: error_6.message,
                                })];
                        }
                        return [2 /*return*/, next(error_6)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/auth/me
    AuthController.prototype.me = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, error_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    error: 'Não autenticado',
                                })];
                        }
                        return [4 /*yield*/, auth_service_1.authService.getMe(userId)];
                    case 1:
                        user = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: user,
                            })];
                    case 2:
                        error_7 = _b.sent();
                        if (error_7 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: error_7.message,
                                })];
                        }
                        return [2 /*return*/, next(error_7)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports.AuthController = AuthController;
exports.authController = new AuthController();
