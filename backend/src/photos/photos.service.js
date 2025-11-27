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
exports.photosService = exports.PhotosService = void 0;
var prisma_1 = require("../database/prisma");
var promises_1 = require("fs/promises");
var PhotosService = /** @class */ (function () {
    function PhotosService() {
    }
    // Listar fotos de um paciente
    PhotosService.prototype.getPhotos = function (patientId, type) {
        return __awaiter(this, void 0, void 0, function () {
            var photos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.photo.findMany({
                            where: __assign({ patientId: patientId }, (type && { type: type })),
                            orderBy: { date: 'desc' },
                        })];
                    case 1:
                        photos = _a.sent();
                        return [2 /*return*/, photos.map(function (photo) { return ({
                                id: photo.id,
                                patientId: photo.patientId,
                                type: photo.type,
                                filename: photo.filename,
                                mimetype: photo.mimetype,
                                size: photo.size,
                                date: photo.date.toISOString(),
                                treatmentPhase: photo.treatmentPhase,
                                notes: photo.notes,
                                createdAt: photo.createdAt.toISOString(),
                            }); })];
                }
            });
        });
    };
    // Upload de foto
    PhotosService.prototype.uploadPhoto = function (patientId, file, data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var photo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar acesso
                    return [4 /*yield*/, this.verifyPatientAccess(patientId, userId)];
                    case 1:
                        // Verificar acesso
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.photo.create({
                                data: {
                                    patientId: patientId,
                                    type: data.type,
                                    filename: file.filename,
                                    filepath: file.path,
                                    mimetype: file.mimetype,
                                    size: file.size,
                                    treatmentPhase: data.treatmentPhase,
                                    notes: data.notes,
                                },
                            })];
                    case 2:
                        photo = _a.sent();
                        return [2 /*return*/, {
                                id: photo.id,
                                patientId: photo.patientId,
                                type: photo.type,
                                filename: photo.filename,
                                size: photo.size,
                                date: photo.date.toISOString(),
                                treatmentPhase: photo.treatmentPhase,
                                notes: photo.notes,
                                createdAt: photo.createdAt.toISOString(),
                            }];
                }
            });
        });
    };
    // Atualizar metadados da foto
    PhotosService.prototype.updatePhoto = function (photoId, data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var photo, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.photo.findUnique({
                            where: { id: photoId },
                        })];
                    case 1:
                        photo = _a.sent();
                        if (!photo) {
                            throw new Error('Foto não encontrada');
                        }
                        return [4 /*yield*/, this.verifyPatientAccess(photo.patientId, userId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.photo.update({
                                where: { id: photoId },
                                data: __assign(__assign(__assign({}, (data.type && { type: data.type })), (data.treatmentPhase !== undefined && { treatmentPhase: data.treatmentPhase })), (data.notes !== undefined && { notes: data.notes })),
                            })];
                    case 3:
                        updated = _a.sent();
                        return [2 /*return*/, {
                                id: updated.id,
                                type: updated.type,
                                treatmentPhase: updated.treatmentPhase,
                                notes: updated.notes,
                            }];
                }
            });
        });
    };
    // Deletar foto
    PhotosService.prototype.deletePhoto = function (photoId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var photo, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.photo.findUnique({
                            where: { id: photoId },
                        })];
                    case 1:
                        photo = _a.sent();
                        if (!photo) {
                            throw new Error('Foto não encontrada');
                        }
                        return [4 /*yield*/, this.verifyPatientAccess(photo.patientId, userId)
                            // Deletar arquivo físico
                        ];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, promises_1.default.unlink(photo.filepath)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.error('Erro ao deletar arquivo físico:', error_1);
                        return [3 /*break*/, 6];
                    case 6: 
                    // Deletar registro
                    return [4 /*yield*/, prisma_1.prisma.photo.delete({
                            where: { id: photoId },
                        })];
                    case 7:
                        // Deletar registro
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    // Comparar fotos antes/depois
    PhotosService.prototype.comparePhotos = function (patientId, beforePhotoId, afterPhotoId) {
        return __awaiter(this, void 0, void 0, function () {
            var before, after;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.photo.findUnique({
                            where: { id: beforePhotoId },
                        })];
                    case 1:
                        before = _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.photo.findUnique({
                                where: { id: afterPhotoId },
                            })];
                    case 2:
                        after = _a.sent();
                        if (!before || !after) {
                            throw new Error('Foto não encontrada');
                        }
                        if (before.patientId !== patientId || after.patientId !== patientId) {
                            throw new Error('Fotos não pertencem ao mesmo paciente');
                        }
                        return [2 /*return*/, {
                                before: {
                                    id: before.id,
                                    type: before.type,
                                    filename: before.filename,
                                    date: before.date.toISOString(),
                                    treatmentPhase: before.treatmentPhase,
                                    notes: before.notes,
                                },
                                after: {
                                    id: after.id,
                                    type: after.type,
                                    filename: after.filename,
                                    date: after.date.toISOString(),
                                    treatmentPhase: after.treatmentPhase,
                                    notes: after.notes,
                                },
                            }];
                }
            });
        });
    };
    // Verificar acesso ao paciente
    PhotosService.prototype.verifyPatientAccess = function (patientId, userId) {
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
    return PhotosService;
}());
exports.PhotosService = PhotosService;
exports.photosService = new PhotosService();
