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
exports.medicationPhotosController = exports.MedicationPhotosController = void 0;
var medication_photos_service_1 = require("./medication-photos.service");
var medication_photos_validator_1 = require("./medication-photos.validator");
var zod_1 = require("zod");
var MedicationPhotosController = /** @class */ (function () {
    function MedicationPhotosController() {
    }
    // GET /api/medications/:medicationId/photos?type=MEDICATION_BOX
    MedicationPhotosController.prototype.getMedicationPhotos = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var medicationId, type, userId, photoType, photos, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        medicationId = req.params.medicationId;
                        type = req.query.type;
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        photoType = type;
                        return [4 /*yield*/, medication_photos_service_1.medicationPhotosService.getMedicationPhotos(medicationId, photoType, userId)];
                    case 1:
                        photos = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: photos })];
                    case 2:
                        error_1 = _b.sent();
                        if (error_1 instanceof Error) {
                            return [2 /*return*/, res.status(403).json({ success: false, error: error_1.message })];
                        }
                        return [2 /*return*/, next(error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/medications/photos/:photoId
    MedicationPhotosController.prototype.getMedicationPhotoById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var photoId, userId, photo, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        photoId = req.params.photoId;
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        return [4 /*yield*/, medication_photos_service_1.medicationPhotosService.getMedicationPhotoById(photoId, userId)];
                    case 1:
                        photo = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: photo })];
                    case 2:
                        error_2 = _b.sent();
                        if (error_2 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({ success: false, error: error_2.message })];
                        }
                        return [2 /*return*/, next(error_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/medications/:medicationId/photos
    MedicationPhotosController.prototype.uploadMedicationPhoto = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, medicationId, data, photo, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, error: 'Não autenticado' })];
                        }
                        medicationId = req.params.medicationId;
                        if (!req.file) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Nenhuma imagem enviada',
                                })];
                        }
                        data = medication_photos_validator_1.uploadMedicationPhotoSchema.parse({
                            medicationId: medicationId,
                            type: req.body.type,
                            prescriptionId: req.body.prescriptionId || null,
                            notes: req.body.notes || null,
                            takenAt: req.body.takenAt || null,
                        });
                        return [4 /*yield*/, medication_photos_service_1.medicationPhotosService.uploadMedicationPhoto(medicationId, req.file, data, userId)];
                    case 1:
                        photo = _b.sent();
                        return [2 /*return*/, res.status(201).json({ success: true, data: photo })];
                    case 2:
                        error_3 = _b.sent();
                        if (error_3 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Validation error',
                                    details: error_3.errors,
                                })];
                        }
                        if (error_3 instanceof Error) {
                            return [2 /*return*/, res.status(403).json({ success: false, error: error_3.message })];
                        }
                        return [2 /*return*/, next(error_3)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /api/medications/photos/:photoId
    MedicationPhotosController.prototype.updateMedicationPhoto = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, photoId, data, photo, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, error: 'Não autenticado' })];
                        }
                        photoId = req.params.photoId;
                        data = medication_photos_validator_1.updateMedicationPhotoSchema.parse(req.body);
                        return [4 /*yield*/, medication_photos_service_1.medicationPhotosService.updateMedicationPhoto(photoId, data, userId)];
                    case 1:
                        photo = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: photo })];
                    case 2:
                        error_4 = _b.sent();
                        if (error_4 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Validation error',
                                    details: error_4.errors,
                                })];
                        }
                        if (error_4 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({ success: false, error: error_4.message })];
                        }
                        return [2 /*return*/, next(error_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // DELETE /api/medications/photos/:photoId
    MedicationPhotosController.prototype.deleteMedicationPhoto = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, photoId, result, error_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, error: 'Não autenticado' })];
                        }
                        photoId = req.params.photoId;
                        return [4 /*yield*/, medication_photos_service_1.medicationPhotosService.deleteMedicationPhoto(photoId, userId)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: result })];
                    case 2:
                        error_5 = _b.sent();
                        if (error_5 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({ success: false, error: error_5.message })];
                        }
                        return [2 /*return*/, next(error_5)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/patients/:patientId/medication-photos?type=MEDICATION_BOX
    MedicationPhotosController.prototype.getPatientMedicationPhotos = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var patientId, type, userId, photoType, photos, error_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        patientId = req.params.patientId;
                        type = req.query.type;
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        photoType = type;
                        return [4 /*yield*/, medication_photos_service_1.medicationPhotosService.getPatientMedicationPhotos(patientId, photoType, userId)];
                    case 1:
                        photos = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: photos })];
                    case 2:
                        error_6 = _b.sent();
                        if (error_6 instanceof Error) {
                            return [2 /*return*/, res.status(403).json({ success: false, error: error_6.message })];
                        }
                        return [2 /*return*/, next(error_6)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return MedicationPhotosController;
}());
exports.MedicationPhotosController = MedicationPhotosController;
exports.medicationPhotosController = new MedicationPhotosController();
