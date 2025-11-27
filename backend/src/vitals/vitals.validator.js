"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVitalSignSchema = void 0;
var zod_1 = require("zod");
var client_1 = require("@prisma/client");
exports.createVitalSignSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    type: zod_1.z.nativeEnum(client_1.VitalSignType),
    value: zod_1.z.string().min(1),
    unit: zod_1.z.string().min(1),
    notes: zod_1.z.string().optional(),
    recordedBy: zod_1.z.string().optional(),
    timestamp: zod_1.z.string().datetime().optional(),
});
