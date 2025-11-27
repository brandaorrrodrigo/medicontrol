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
exports.authService = exports.AuthService = void 0;
var bcrypt_1 = require("bcrypt");
var jsonwebtoken_1 = require("jsonwebtoken");
var crypto_1 = require("crypto");
var prisma_1 = require("../database/prisma");
var env_1 = require("../config/env");
var client_1 = require("@prisma/client");
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    // Registrar novo usuário
    AuthService.prototype.register = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, hashedPassword, user, tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                            where: { email: data.email },
                        })];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new Error('Email já cadastrado');
                        }
                        return [4 /*yield*/, bcrypt_1.default.hash(data.password, 10)
                            // Criar usuário baseado no role
                        ];
                    case 2:
                        hashedPassword = _a.sent();
                        if (!(data.role === client_1.UserRole.PATIENT)) return [3 /*break*/, 4];
                        if (!data.dateOfBirth || !data.gender) {
                            throw new Error('Data de nascimento e gênero são obrigatórios para pacientes');
                        }
                        return [4 /*yield*/, prisma_1.prisma.user.create({
                                data: {
                                    email: data.email,
                                    password: hashedPassword,
                                    role: data.role,
                                    patient: {
                                        create: {
                                            name: data.name,
                                            phone: data.phone,
                                            dateOfBirth: new Date(data.dateOfBirth),
                                            gender: data.gender,
                                            bloodType: data.bloodType,
                                            conditions: [],
                                            allergies: [],
                                        },
                                    },
                                },
                                include: {
                                    patient: true,
                                },
                            })];
                    case 3:
                        user = _a.sent();
                        return [3 /*break*/, 9];
                    case 4:
                        if (!(data.role === client_1.UserRole.CAREGIVER)) return [3 /*break*/, 6];
                        return [4 /*yield*/, prisma_1.prisma.user.create({
                                data: {
                                    email: data.email,
                                    password: hashedPassword,
                                    role: data.role,
                                    caregiver: {
                                        create: {
                                            name: data.name,
                                            phone: data.phone,
                                            relationship: data.relationship,
                                        },
                                    },
                                },
                                include: {
                                    caregiver: true,
                                },
                            })];
                    case 5:
                        user = _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        if (!(data.role === client_1.UserRole.PROFESSIONAL)) return [3 /*break*/, 8];
                        if (!data.specialty || !data.crm) {
                            throw new Error('Especialidade e CRM são obrigatórios para profissionais');
                        }
                        return [4 /*yield*/, prisma_1.prisma.user.create({
                                data: {
                                    email: data.email,
                                    password: hashedPassword,
                                    role: data.role,
                                    professional: {
                                        create: {
                                            name: data.name,
                                            phone: data.phone,
                                            specialty: data.specialty,
                                            crm: data.crm,
                                        },
                                    },
                                },
                                include: {
                                    professional: true,
                                },
                            })];
                    case 7:
                        user = _a.sent();
                        return [3 /*break*/, 9];
                    case 8: throw new Error('Role inválido');
                    case 9: return [4 /*yield*/, this.generateTokens(user.id, user.email, user.role)];
                    case 10:
                        tokens = _a.sent();
                        return [2 /*return*/, __assign({ user: {
                                    id: user.id,
                                    email: user.email,
                                    role: user.role,
                                    name: data.name,
                                } }, tokens)];
                }
            });
        });
    };
    // Login
    AuthService.prototype.login = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isValidPassword, tokens, name;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                            where: { email: data.email },
                            include: {
                                patient: true,
                                caregiver: true,
                                professional: true,
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('Email ou senha inválidos');
                        }
                        if (!user.active) {
                            throw new Error('Usuário inativo');
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(data.password, user.password)];
                    case 2:
                        isValidPassword = _a.sent();
                        if (!isValidPassword) {
                            throw new Error('Email ou senha inválidos');
                        }
                        return [4 /*yield*/, this.generateTokens(user.id, user.email, user.role)
                            // Obter nome baseado no role
                        ];
                    case 3:
                        tokens = _a.sent();
                        name = '';
                        if (user.patient)
                            name = user.patient.name;
                        else if (user.caregiver)
                            name = user.caregiver.name;
                        else if (user.professional)
                            name = user.professional.name;
                        return [2 /*return*/, __assign({ user: {
                                    id: user.id,
                                    email: user.email,
                                    role: user.role,
                                    name: name,
                                } }, tokens)];
                }
            });
        });
    };
    // Refresh token
    AuthService.prototype.refreshToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var storedToken, accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.refreshToken.findUnique({
                            where: { token: refreshToken },
                            include: { user: true },
                        })];
                    case 1:
                        storedToken = _a.sent();
                        if (!storedToken) {
                            throw new Error('Refresh token inválido');
                        }
                        if (!(storedToken.expiresAt < new Date())) return [3 /*break*/, 3];
                        return [4 /*yield*/, prisma_1.prisma.refreshToken.delete({ where: { id: storedToken.id } })];
                    case 2:
                        _a.sent();
                        throw new Error('Refresh token expirado');
                    case 3:
                        accessToken = this.generateAccessToken(storedToken.user.id, storedToken.user.email, storedToken.user.role);
                        return [2 /*return*/, { accessToken: accessToken }];
                }
            });
        });
    };
    // Logout
    AuthService.prototype.logout = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.refreshToken.deleteMany({
                            where: { token: refreshToken },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Solicitar recuperação de senha
    AuthService.prototype.forgotPassword = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user, resetToken, hashedToken, sendPasswordResetEmail, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.user.findUnique({ where: { email: email } })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            // Por segurança, não revelar se o email existe
                            return [2 /*return*/];
                        }
                        resetToken = crypto_1.default.randomBytes(32).toString('hex');
                        hashedToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
                        // Salvar no banco com expiração de 1 hora
                        return [4 /*yield*/, prisma_1.prisma.passwordReset.create({
                                data: {
                                    email: user.email,
                                    token: hashedToken,
                                    expiresAt: new Date(Date.now() + 3600000), // 1 hora
                                },
                            })
                            // Enviar email com link de reset
                        ];
                    case 2:
                        // Salvar no banco com expiração de 1 hora
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('../common/email.service'); })];
                    case 4:
                        sendPasswordResetEmail = (_a.sent()).sendPasswordResetEmail;
                        return [4 /*yield*/, sendPasswordResetEmail(user.email, resetToken)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error('Erro ao enviar email de recuperação:', error_1);
                        // Mesmo se o email falhar, o token foi gerado
                        console.log("Reset token para ".concat(email, ": ").concat(resetToken));
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // Resetar senha
    AuthService.prototype.resetPassword = function (token, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var hashedToken, passwordReset, hashedPassword, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
                        return [4 /*yield*/, prisma_1.prisma.passwordReset.findUnique({
                                where: { token: hashedToken },
                            })];
                    case 1:
                        passwordReset = _a.sent();
                        if (!passwordReset || passwordReset.used) {
                            throw new Error('Token inválido ou já utilizado');
                        }
                        if (passwordReset.expiresAt < new Date()) {
                            throw new Error('Token expirado');
                        }
                        return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
                    case 2:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.user.update({
                                where: { email: passwordReset.email },
                                data: { password: hashedPassword },
                            })
                            // Marcar token como usado
                        ];
                    case 3:
                        _a.sent();
                        // Marcar token como usado
                        return [4 /*yield*/, prisma_1.prisma.passwordReset.update({
                                where: { id: passwordReset.id },
                                data: { used: true },
                            })
                            // Deletar todos os refresh tokens do usuário
                        ];
                    case 4:
                        // Marcar token como usado
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.user.findUnique({ where: { email: passwordReset.email } })];
                    case 5:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 7];
                        return [4 /*yield*/, prisma_1.prisma.refreshToken.deleteMany({ where: { userId: user.id } })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // Gerar access e refresh tokens
    AuthService.prototype.generateTokens = function (userId, email, role) {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken, refreshToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accessToken = this.generateAccessToken(userId, email, role);
                        refreshToken = this.generateRefreshToken();
                        // Salvar refresh token no banco
                        return [4 /*yield*/, prisma_1.prisma.refreshToken.create({
                                data: {
                                    token: refreshToken,
                                    userId: userId,
                                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
                                },
                            })];
                    case 1:
                        // Salvar refresh token no banco
                        _a.sent();
                        return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
                }
            });
        });
    };
    AuthService.prototype.generateAccessToken = function (userId, email, role) {
        var payload = { userId: userId, email: email, role: role };
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
    };
    AuthService.prototype.generateRefreshToken = function () {
        return crypto_1.default.randomBytes(64).toString('hex');
    };
    // Verificar access token
    AuthService.prototype.verifyAccessToken = function (token) {
        try {
            return jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        }
        catch (error) {
            throw new Error('Token inválido ou expirado');
        }
    };
    // Obter dados do usuário logado
    AuthService.prototype.getMe = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, profile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                            where: { id: userId },
                            include: {
                                patient: true,
                                caregiver: true,
                                professional: true,
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('Usuário não encontrado');
                        }
                        profile = null;
                        if (user.patient)
                            profile = user.patient;
                        else if (user.caregiver)
                            profile = user.caregiver;
                        else if (user.professional)
                            profile = user.professional;
                        return [2 /*return*/, {
                                id: user.id,
                                email: user.email,
                                role: user.role,
                                profile: profile,
                            }];
                }
            });
        });
    };
    return AuthService;
}());
exports.AuthService = AuthService;
exports.authService = new AuthService();
