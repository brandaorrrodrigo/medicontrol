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
exports.vitalsService = exports.VitalsService = void 0;
var prisma_1 = require("../database/prisma");
var client_1 = require("@prisma/client");
var VitalsService = /** @class */ (function () {
    function VitalsService() {
    }
    // Listar sinais vitais de um paciente
    VitalsService.prototype.getVitalSigns = function (patientId_1, type_1) {
        return __awaiter(this, arguments, void 0, function (patientId, type, limit) {
            var vitalSigns;
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.vitalSign.findMany({
                            where: __assign({ patientId: patientId }, (type && { type: type })),
                            orderBy: { timestamp: 'desc' },
                            take: limit,
                        })];
                    case 1:
                        vitalSigns = _a.sent();
                        return [2 /*return*/, vitalSigns.map(function (v) { return ({
                                id: v.id,
                                patientId: v.patientId,
                                type: v.type,
                                value: v.value,
                                unit: v.unit,
                                status: v.status,
                                notes: v.notes,
                                recordedBy: v.recordedBy,
                                timestamp: v.timestamp.toISOString(),
                                createdAt: v.createdAt.toISOString(),
                            }); })];
                }
            });
        });
    };
    // Criar sinal vital
    VitalsService.prototype.createVitalSign = function (data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var status, vitalSign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar acesso
                    return [4 /*yield*/, this.verifyPatientAccess(data.patientId, userId)
                        // Calcular status baseado nos valores
                    ];
                    case 1:
                        // Verificar acesso
                        _a.sent();
                        status = this.calculateStatus(data.type, data.value);
                        return [4 /*yield*/, prisma_1.prisma.vitalSign.create({
                                data: {
                                    patientId: data.patientId,
                                    type: data.type,
                                    value: data.value,
                                    unit: data.unit,
                                    status: status,
                                    notes: data.notes,
                                    recordedBy: data.recordedBy,
                                    timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
                                },
                            })];
                    case 2:
                        vitalSign = _a.sent();
                        return [2 /*return*/, {
                                id: vitalSign.id,
                                patientId: vitalSign.patientId,
                                type: vitalSign.type,
                                value: vitalSign.value,
                                unit: vitalSign.unit,
                                status: vitalSign.status,
                                timestamp: vitalSign.timestamp.toISOString(),
                                createdAt: vitalSign.createdAt.toISOString(),
                            }];
                }
            });
        });
    };
    // Deletar sinal vital
    VitalsService.prototype.deleteVitalSign = function (vitalSignId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var vitalSign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.vitalSign.findUnique({
                            where: { id: vitalSignId },
                        })];
                    case 1:
                        vitalSign = _a.sent();
                        if (!vitalSign) {
                            throw new Error('Sinal vital não encontrado');
                        }
                        return [4 /*yield*/, this.verifyPatientAccess(vitalSign.patientId, userId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.vitalSign.delete({
                                where: { id: vitalSignId },
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    // Obter estatísticas
    VitalsService.prototype.getStats = function (patientId_1, type_1) {
        return __awaiter(this, arguments, void 0, function (patientId, type, days) {
            var since, vitalSigns;
            if (days === void 0) { days = 30; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        since = new Date();
                        since.setDate(since.getDate() - days);
                        return [4 /*yield*/, prisma_1.prisma.vitalSign.findMany({
                                where: {
                                    patientId: patientId,
                                    type: type,
                                    timestamp: { gte: since },
                                },
                                orderBy: { timestamp: 'asc' },
                            })];
                    case 1:
                        vitalSigns = _a.sent();
                        return [2 /*return*/, vitalSigns.map(function (v) { return ({
                                value: v.value,
                                timestamp: v.timestamp.toISOString(),
                                status: v.status,
                            }); })];
                }
            });
        });
    };
    // Calcular status baseado no tipo e valor
    VitalsService.prototype.calculateStatus = function (type, value) {
        try {
            switch (type) {
                case client_1.VitalSignType.BLOOD_PRESSURE: {
                    var _a = value.split('/').map(Number), systolic = _a[0], diastolic = _a[1];
                    if (systolic >= 140 || diastolic >= 90)
                        return client_1.VitalSignStatus.DANGER;
                    if (systolic >= 130 || diastolic >= 85)
                        return client_1.VitalSignStatus.WARNING;
                    return client_1.VitalSignStatus.NORMAL;
                }
                case client_1.VitalSignType.HEART_RATE: {
                    var hr = parseInt(value);
                    if (hr < 60 || hr > 100)
                        return client_1.VitalSignStatus.WARNING;
                    if (hr < 40 || hr > 120)
                        return client_1.VitalSignStatus.DANGER;
                    return client_1.VitalSignStatus.NORMAL;
                }
                case client_1.VitalSignType.GLUCOSE: {
                    var glucose = parseInt(value);
                    if (glucose < 70 || glucose > 140)
                        return client_1.VitalSignStatus.WARNING;
                    if (glucose < 50 || glucose > 200)
                        return client_1.VitalSignStatus.DANGER;
                    return client_1.VitalSignStatus.NORMAL;
                }
                case client_1.VitalSignType.TEMPERATURE: {
                    var temp = parseFloat(value);
                    if (temp < 36 || temp > 37.5)
                        return client_1.VitalSignStatus.WARNING;
                    if (temp < 35 || temp > 39)
                        return client_1.VitalSignStatus.DANGER;
                    return client_1.VitalSignStatus.NORMAL;
                }
                case client_1.VitalSignType.OXYGEN_SATURATION: {
                    var oxygen = parseInt(value);
                    if (oxygen < 95)
                        return client_1.VitalSignStatus.WARNING;
                    if (oxygen < 90)
                        return client_1.VitalSignStatus.DANGER;
                    return client_1.VitalSignStatus.NORMAL;
                }
                default:
                    return client_1.VitalSignStatus.NORMAL;
            }
        }
        catch (_b) {
            return client_1.VitalSignStatus.NORMAL;
        }
    };
    // Verificar acesso ao paciente
    VitalsService.prototype.verifyPatientAccess = function (patientId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                            where: { id: userId },
                            include: {
                                patient: true,
                                caregiver: {
                                    include: {
                                        patients: {
                                            where: { patientId: patientId },
                                        },
                                    },
                                },
                                professional: {
                                    include: {
                                        patients: {
                                            where: { patientId: patientId },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('Usuário não encontrado');
                        }
                        if (user.patient && user.patient.id === patientId)
                            return [2 /*return*/, true];
                        if (user.caregiver && user.caregiver.patients.length > 0)
                            return [2 /*return*/, true];
                        if (user.professional && user.professional.patients.length > 0)
                            return [2 /*return*/, true];
                        throw new Error('Acesso negado');
                }
            });
        });
    };
    return VitalsService;
}());
exports.VitalsService = VitalsService;
exports.vitalsService = new VitalsService();
