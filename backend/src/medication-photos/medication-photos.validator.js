"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMedicationPhotoSchema = exports.uploadMedicationPhotoSchema = void 0;
var zod_1 = require("zod");
var client_1 = require("@prisma/client");
exports.uploadMedicationPhotoSchema = zod_1.z.object({
    medicationId: zod_1.z.string().uuid('medicationId deve ser um UUID válido'),
    type: zod_1.z.nativeEnum(client_1.MedicationPhotoType, {
        errorMap: function () { return ({
            message: 'type deve ser MEDICATION_BOX, BOTTLE, LEAFLET ou PRESCRIPTION',
        }); },
    }),
    prescriptionId: zod_1.z.string().uuid().optional().nullable(),
    notes: zod_1.z.string().max(500).optional().nullable(),
    takenAt: zod_1.z.string().datetime().optional().nullable(),
});
exports.updateMedicationPhotoSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(client_1.MedicationPhotoType).optional(),
    notes: zod_1.z.string().max(500).optional().nullable(),
    ocrText: zod_1.z.string().optional().nullable(),
});
