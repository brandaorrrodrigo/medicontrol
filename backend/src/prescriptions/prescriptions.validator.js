"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addItemSchema = exports.updatePrescriptionSchema = exports.createPrescriptionSchema = void 0;
var zod_1 = require("zod");
exports.createPrescriptionSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    notes: zod_1.z.string().optional(),
    items: zod_1.z.array(zod_1.z.object({
        medicationName: zod_1.z.string().min(1),
        dosage: zod_1.z.string().min(1),
        frequency: zod_1.z.string().min(1),
        duration: zod_1.z.string().optional(),
        instructions: zod_1.z.string().optional(),
    })).min(1, 'Prescrição deve ter pelo menos um medicamento'),
});
exports.updatePrescriptionSchema = zod_1.z.object({
    notes: zod_1.z.string().optional().nullable(),
});
exports.addItemSchema = zod_1.z.object({
    medicationName: zod_1.z.string().min(1),
    dosage: zod_1.z.string().min(1),
    frequency: zod_1.z.string().min(1),
    duration: zod_1.z.string().optional(),
    instructions: zod_1.z.string().optional(),
});
