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
exports.medicationPhotosService = exports.MedicationPhotosService = void 0;
var prisma_1 = require("../database/prisma");
var promises_1 = require("fs/promises");
var MedicationPhotosService = /** @class */ (function () {
    function MedicationPhotosService() {
    }
    // Verificar se o usuário tem permissão para acessar o medicamento
    MedicationPhotosService.prototype.verifyMedicationAccess = function (medicationId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var medication, isCaregiver, isProfessional;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.medication.findUnique({
                            where: { id: medicationId },
                            include: {
                                patient: {
                                    include: {
                                        user: true,
                                        caregivers: {
                                            include: {
                                                caregiver: {
                                                    include: { user: true },
                                                },
                                            },
                                        },
                                        professionals: {
                                            include: {
                                                professional: {
                                                    include: { user: true },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        medication = _a.sent();
                        if (!medication) {
                            throw new Error('Medicamento não encontrado');
                        }
                        // Verificar se é o próprio paciente
                        if (medication.patient.userId === userId) {
                            return [2 /*return*/];
                        }
                        isCaregiver = medication.patient.caregivers.some(function (pc) { return pc.caregiver.userId === userId; });
                        if (isCaregiver) {
                            return [2 /*return*/];
                        }
                        isProfessional = medication.patient.professionals.some(function (pp) { return pp.professional.userId === userId; });
                        if (isProfessional) {
                            return [2 /*return*/];
                        }
                        throw new Error('Você não tem permissão para acessar este medicamento');
                }
            });
        });
    };
    // GET /api/medications/:medicationId/photos?type=MEDICATION_BOX
    MedicationPhotosService.prototype.getMedicationPhotos = function (medicationId, type, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var photos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.verifyMedicationAccess(medicationId, userId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, prisma_1.prisma.medicationPhoto.findMany({
                            where: __assign({ medicationId: medicationId }, (type && { type: type })),
                            orderBy: { takenAt: 'desc' },
                            include: {
                                medication: {
                                    select: {
                                        id: true,
                                        name: true,
                                        dosage: true,
                                    },
                                },
                                prescription: {
                                    select: {
                                        id: true,
                                        date: true,
                                        professional: {
                                            select: {
                                                name: true,
                                                specialty: true,
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                    case 3:
                        photos = _a.sent();
                        return [2 /*return*/, photos];
                }
            });
        });
    };
    // GET /api/medications/photos/:photoId
    MedicationPhotosService.prototype.getMedicationPhotoById = function (photoId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var photo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.medicationPhoto.findUnique({
                            where: { id: photoId },
                            include: {
                                medication: {
                                    select: {
                                        id: true,
                                        name: true,
                                        dosage: true,
                                        patient: {
                                            select: {
                                                id: true,
                                                name: true,
                                                userId: true,
                                            },
                                        },
                                    },
                                },
                                prescription: {
                                    select: {
                                        id: true,
                                        date: true,
                                        professional: {
                                            select: {
                                                name: true,
                                                specialty: true,
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        photo = _a.sent();
                        if (!photo) {
                            throw new Error('Foto não encontrada');
                        }
                        if (!userId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.verifyMedicationAccess(photo.medicationId, userId)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, photo];
                }
            });
        });
    };
    // POST /api/medications/:medicationId/photos
    MedicationPhotosService.prototype.uploadMedicationPhoto = function (medicationId, file, data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var medication, prescription, photo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar acesso
                    return [4 /*yield*/, this.verifyMedicationAccess(medicationId, userId)
                        // Buscar o paciente do medicamento
                    ];
                    case 1:
                        // Verificar acesso
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.medication.findUnique({
                                where: { id: medicationId },
                                select: { patientId: true },
                            })];
                    case 2:
                        medication = _a.sent();
                        if (!medication) {
                            throw new Error('Medicamento não encontrado');
                        }
                        if (!data.prescriptionId) return [3 /*break*/, 4];
                        return [4 /*yield*/, prisma_1.prisma.prescription.findUnique({
                                where: { id: data.prescriptionId },
                            })];
                    case 3:
                        prescription = _a.sent();
                        if (!prescription || prescription.patientId !== medication.patientId) {
                            throw new Error('Prescrição inválida para este paciente');
                        }
                        _a.label = 4;
                    case 4: return [4 /*yield*/, prisma_1.prisma.medicationPhoto.create({
                            data: {
                                patientId: medication.patientId,
                                medicationId: medicationId,
                                prescriptionId: data.prescriptionId || null,
                                type: data.type,
                                filename: file.filename,
                                filepath: file.path,
                                mimetype: file.mimetype,
                                size: file.size,
                                takenAt: data.takenAt ? new Date(data.takenAt) : new Date(),
                                notes: data.notes || null,
                            },
                            include: {
                                medication: {
                                    select: {
                                        id: true,
                                        name: true,
                                        dosage: true,
                                    },
                                },
                            },
                        })];
                    case 5:
                        photo = _a.sent();
                        return [2 /*return*/, photo];
                }
            });
        });
    };
    // PUT /api/medications/photos/:photoId
    MedicationPhotosService.prototype.updateMedicationPhoto = function (photoId, data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var photo, updatedPhoto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMedicationPhotoById(photoId)
                        // Verificar acesso
                    ];
                    case 1:
                        photo = _a.sent();
                        // Verificar acesso
                        return [4 /*yield*/, this.verifyMedicationAccess(photo.medicationId, userId)];
                    case 2:
                        // Verificar acesso
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.medicationPhoto.update({
                                where: { id: photoId },
                                data: __assign(__assign(__assign({}, (data.type && { type: data.type })), (data.notes !== undefined && { notes: data.notes })), (data.ocrText !== undefined && { ocrText: data.ocrText })),
                                include: {
                                    medication: {
                                        select: {
                                            id: true,
                                            name: true,
                                            dosage: true,
                                        },
                                    },
                                },
                            })];
                    case 3:
                        updatedPhoto = _a.sent();
                        return [2 /*return*/, updatedPhoto];
                }
            });
        });
    };
    // DELETE /api/medications/photos/:photoId
    MedicationPhotosService.prototype.deleteMedicationPhoto = function (photoId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var photo, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMedicationPhotoById(photoId)
                        // Verificar acesso
                    ];
                    case 1:
                        photo = _a.sent();
                        // Verificar acesso
                        return [4 /*yield*/, this.verifyMedicationAccess(photo.medicationId, userId)
                            // Deletar arquivo físico
                        ];
                    case 2:
                        // Verificar acesso
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
                        console.error('Erro ao deletar arquivo:', error_1);
                        return [3 /*break*/, 6];
                    case 6: 
                    // Deletar registro do banco
                    return [4 /*yield*/, prisma_1.prisma.medicationPhoto.delete({
                            where: { id: photoId },
                        })];
                    case 7:
                        // Deletar registro do banco
                        _a.sent();
                        return [2 /*return*/, { message: 'Foto deletada com sucesso' }];
                }
            });
        });
    };
    // GET /api/patients/:patientId/medication-photos - Listar todas as fotos de medicamentos do paciente
    MedicationPhotosService.prototype.getPatientMedicationPhotos = function (patientId, type, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var patient, isOwner, isCaregiver, isProfessional, photos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, prisma_1.prisma.patient.findUnique({
                                where: { id: patientId },
                                include: {
                                    user: true,
                                    caregivers: {
                                        include: {
                                            caregiver: {
                                                include: { user: true },
                                            },
                                        },
                                    },
                                    professionals: {
                                        include: {
                                            professional: {
                                                include: { user: true },
                                            },
                                        },
                                    },
                                },
                            })];
                    case 1:
                        patient = _a.sent();
                        if (!patient) {
                            throw new Error('Paciente não encontrado');
                        }
                        isOwner = patient.userId === userId;
                        isCaregiver = patient.caregivers.some(function (pc) { return pc.caregiver.userId === userId; });
                        isProfessional = patient.professionals.some(function (pp) { return pp.professional.userId === userId; });
                        if (!isOwner && !isCaregiver && !isProfessional) {
                            throw new Error('Você não tem permissão para acessar este paciente');
                        }
                        _a.label = 2;
                    case 2: return [4 /*yield*/, prisma_1.prisma.medicationPhoto.findMany({
                            where: __assign({ patientId: patientId }, (type && { type: type })),
                            orderBy: { takenAt: 'desc' },
                            include: {
                                medication: {
                                    select: {
                                        id: true,
                                        name: true,
                                        dosage: true,
                                        active: true,
                                    },
                                },
                                prescription: {
                                    select: {
                                        id: true,
                                        date: true,
                                        professional: {
                                            select: {
                                                name: true,
                                                specialty: true,
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                    case 3:
                        photos = _a.sent();
                        return [2 /*return*/, photos];
                }
            });
        });
    };
    return MedicationPhotosService;
}());
exports.MedicationPhotosService = MedicationPhotosService;
exports.medicationPhotosService = new MedicationPhotosService();
