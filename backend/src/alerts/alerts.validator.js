"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDrugFoodInteractionSchema = exports.createDrugInteractionSchema = exports.updateStockBodySchema = exports.createStockBodySchema = exports.readAllAlertsBodySchema = exports.resolveAlertParamSchema = exports.markAlertReadParamSchema = exports.refreshAlertsBodySchema = exports.listAlertsQuerySchema = void 0;
var zod_1 = require("zod");
var client_1 = require("@prisma/client");
/**
 * VALIDADORES PARA O MÓDULO DE ALERTAS
 *
 * Schemas Zod para validação de requests do sistema de alertas.
 */
// ============================================================================
// GET /api/alerts - Listar alertas com filtros
// ============================================================================
exports.listAlertsQuerySchema = zod_1.z.object({
    type: zod_1.z
        .nativeEnum(client_1.MedicationAlertType)
        .optional()
        .describe('Filtrar por tipo de alerta'),
    severity: zod_1.z
        .nativeEnum(client_1.AlertSeverity)
        .optional()
        .describe('Filtrar por severidade'),
    read: zod_1.z
        .string()
        .optional()
        .transform(function (val) { return (val === 'true' ? true : val === 'false' ? false : undefined); })
        .describe('Filtrar por status de leitura'),
    resolved: zod_1.z
        .string()
        .optional()
        .transform(function (val) { return (val === 'true' ? true : val === 'false' ? false : undefined); })
        .describe('Filtrar por status de resolução'),
    medicationId: zod_1.z
        .string()
        .uuid()
        .optional()
        .describe('Filtrar por medicamento específico'),
    limit: zod_1.z
        .string()
        .optional()
        .transform(function (val) { return (val ? parseInt(val, 10) : 50); })
        .pipe(zod_1.z.number().min(1).max(100))
        .describe('Limite de resultados (padrão: 50)'),
    offset: zod_1.z
        .string()
        .optional()
        .transform(function (val) { return (val ? parseInt(val, 10) : 0); })
        .pipe(zod_1.z.number().min(0))
        .describe('Offset para paginação (padrão: 0)'),
});
// ============================================================================
// POST /api/alerts/refresh - Regenerar alertas (debug/admin)
// ============================================================================
exports.refreshAlertsBodySchema = zod_1.z.object({
    medicationId: zod_1.z
        .string()
        .uuid()
        .optional()
        .describe('Regenerar alertas apenas para este medicamento'),
    types: zod_1.z
        .array(zod_1.z.nativeEnum(client_1.MedicationAlertType))
        .optional()
        .describe('Regenerar apenas tipos específicos de alertas'),
});
// ============================================================================
// PATCH /api/alerts/:id/read - Marcar alerta como lido
// ============================================================================
exports.markAlertReadParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().describe('ID do alerta'),
});
// ============================================================================
// PATCH /api/alerts/:id/resolve - Marcar alerta como resolvido
// ============================================================================
exports.resolveAlertParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().describe('ID do alerta'),
});
// ============================================================================
// POST /api/alerts/read-all - Marcar todos alertas como lidos
// ============================================================================
exports.readAllAlertsBodySchema = zod_1.z.object({
    type: zod_1.z
        .nativeEnum(client_1.MedicationAlertType)
        .optional()
        .describe('Marcar como lido apenas alertas deste tipo'),
});
// ============================================================================
// STOCK - Criar/Atualizar estoque
// ============================================================================
exports.createStockBodySchema = zod_1.z.object({
    medicationId: zod_1.z.string().uuid(),
    currentQuantity: zod_1.z.number().min(0),
    initialQuantity: zod_1.z.number().min(0),
    unitType: zod_1.z.enum([
        'PILL',
        'TABLET',
        'CAPSULE',
        'ML',
        'MG',
        'G',
        'DROP',
        'SPRAY',
        'PATCH',
        'AMPULE',
        'VIAL',
        'UNIT',
    ]),
    lowStockThreshold: zod_1.z.number().min(0).max(100).optional().default(30),
    criticalStockThreshold: zod_1.z.number().min(0).max(100).optional().default(10),
    lastRestockDate: zod_1.z.string().datetime().optional().nullable(),
    nextRestockDate: zod_1.z.string().datetime().optional().nullable(),
    notes: zod_1.z.string().max(500).optional().nullable(),
});
exports.updateStockBodySchema = zod_1.z.object({
    currentQuantity: zod_1.z.number().min(0).optional(),
    lowStockThreshold: zod_1.z.number().min(0).max(100).optional(),
    criticalStockThreshold: zod_1.z.number().min(0).max(100).optional(),
    lastRestockDate: zod_1.z.string().datetime().optional().nullable(),
    nextRestockDate: zod_1.z.string().datetime().optional().nullable(),
    notes: zod_1.z.string().max(500).optional().nullable(),
});
// ============================================================================
// INTERACTIONS - Criar interações
// ============================================================================
exports.createDrugInteractionSchema = zod_1.z.object({
    drugA: zod_1.z.string().min(1).max(200),
    drugB: zod_1.z.string().min(1).max(200),
    severity: zod_1.z.nativeEnum(client_1.AlertSeverity),
    description: zod_1.z.string().min(10),
    recommendation: zod_1.z.string().optional().nullable(),
    source: zod_1.z.string().max(200).optional().nullable(),
});
exports.createDrugFoodInteractionSchema = zod_1.z.object({
    drugName: zod_1.z.string().min(1).max(200),
    foodName: zod_1.z.string().min(1).max(200),
    severity: zod_1.z.nativeEnum(client_1.AlertSeverity),
    description: zod_1.z.string().min(10),
    recommendation: zod_1.z.string().optional().nullable(),
    source: zod_1.z.string().max(200).optional().nullable(),
});
