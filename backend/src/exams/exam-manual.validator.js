"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manualExamBatchSchema = exports.manualExamEntrySchema = void 0;
var zod_1 = require("zod");
// ============================================================================
// SCHEMA DE VALIDAÇÃO PARA ENTRADA MANUAL DE EXAME
// ============================================================================
exports.manualExamEntrySchema = zod_1.z.object({
    // Identificação do paciente
    patientId: zod_1.z.string().uuid('ID do paciente inválido'),
    // Identificação do marcador
    markerCode: zod_1.z.string().min(1, 'Código do marcador é obrigatório'),
    // Valor e unidade
    value: zod_1.z.number({
        required_error: 'Valor é obrigatório',
        invalid_type_error: 'Valor deve ser numérico'
    }).finite('Valor deve ser um número válido'),
    unit: zod_1.z.string().min(1, 'Unidade é obrigatória'),
    // Data do exame
    date: zod_1.z.string().datetime('Data inválida').optional(),
    // Metadados opcionais
    laboratory: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional()
});
// ============================================================================
// SCHEMA PARA ENTRADA MÚLTIPLA (BATCH)
// ============================================================================
exports.manualExamBatchSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid('ID do paciente inválido'),
    date: zod_1.z.string().datetime('Data inválida').optional(),
    laboratory: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    // Array de marcadores
    markers: zod_1.z.array(zod_1.z.object({
        markerCode: zod_1.z.string().min(1, 'Código do marcador é obrigatório'),
        value: zod_1.z.number().finite('Valor deve ser um número válido'),
        unit: zod_1.z.string().min(1, 'Unidade é obrigatória')
    })).min(1, 'Pelo menos um marcador é necessário').max(100, 'Máximo de 100 marcadores por vez')
});
