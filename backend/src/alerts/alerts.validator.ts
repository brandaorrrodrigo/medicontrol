import { z } from 'zod'
import { MedicationAlertType, AlertSeverity } from '@prisma/client'

/**
 * VALIDADORES PARA O MÓDULO DE ALERTAS
 *
 * Schemas Zod para validação de requests do sistema de alertas.
 */

// ============================================================================
// GET /api/alerts - Listar alertas com filtros
// ============================================================================

export const listAlertsQuerySchema = z.object({
  type: z
    .nativeEnum(MedicationAlertType)
    .optional()
    .describe('Filtrar por tipo de alerta'),
  severity: z
    .nativeEnum(AlertSeverity)
    .optional()
    .describe('Filtrar por severidade'),
  read: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined))
    .describe('Filtrar por status de leitura'),
  resolved: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined))
    .describe('Filtrar por status de resolução'),
  medicationId: z
    .string()
    .uuid()
    .optional()
    .describe('Filtrar por medicamento específico'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 50))
    .pipe(z.number().min(1).max(100))
    .describe('Limite de resultados (padrão: 50)'),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .pipe(z.number().min(0))
    .describe('Offset para paginação (padrão: 0)'),
})

export type ListAlertsQuery = z.infer<typeof listAlertsQuerySchema>

// ============================================================================
// POST /api/alerts/refresh - Regenerar alertas (debug/admin)
// ============================================================================

export const refreshAlertsBodySchema = z.object({
  medicationId: z
    .string()
    .uuid()
    .optional()
    .describe('Regenerar alertas apenas para este medicamento'),
  types: z
    .array(z.nativeEnum(MedicationAlertType))
    .optional()
    .describe('Regenerar apenas tipos específicos de alertas'),
})

export type RefreshAlertsBody = z.infer<typeof refreshAlertsBodySchema>

// ============================================================================
// PATCH /api/alerts/:id/read - Marcar alerta como lido
// ============================================================================

export const markAlertReadParamSchema = z.object({
  id: z.string().uuid().describe('ID do alerta'),
})

export type MarkAlertReadParam = z.infer<typeof markAlertReadParamSchema>

// ============================================================================
// PATCH /api/alerts/:id/resolve - Marcar alerta como resolvido
// ============================================================================

export const resolveAlertParamSchema = z.object({
  id: z.string().uuid().describe('ID do alerta'),
})

export type ResolveAlertParam = z.infer<typeof resolveAlertParamSchema>

// ============================================================================
// POST /api/alerts/read-all - Marcar todos alertas como lidos
// ============================================================================

export const readAllAlertsBodySchema = z.object({
  type: z
    .nativeEnum(MedicationAlertType)
    .optional()
    .describe('Marcar como lido apenas alertas deste tipo'),
})

export type ReadAllAlertsBody = z.infer<typeof readAllAlertsBodySchema>

// ============================================================================
// STOCK - Criar/Atualizar estoque
// ============================================================================

export const createStockBodySchema = z.object({
  medicationId: z.string().uuid(),
  currentQuantity: z.number().min(0),
  initialQuantity: z.number().min(0),
  unitType: z.enum([
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
  lowStockThreshold: z.number().min(0).max(100).optional().default(30),
  criticalStockThreshold: z.number().min(0).max(100).optional().default(10),
  lastRestockDate: z.string().datetime().optional().nullable(),
  nextRestockDate: z.string().datetime().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
})

export type CreateStockBody = z.infer<typeof createStockBodySchema>

export const updateStockBodySchema = z.object({
  currentQuantity: z.number().min(0).optional(),
  lowStockThreshold: z.number().min(0).max(100).optional(),
  criticalStockThreshold: z.number().min(0).max(100).optional(),
  lastRestockDate: z.string().datetime().optional().nullable(),
  nextRestockDate: z.string().datetime().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
})

export type UpdateStockBody = z.infer<typeof updateStockBodySchema>

// ============================================================================
// INTERACTIONS - Criar interações
// ============================================================================

export const createDrugInteractionSchema = z.object({
  drugA: z.string().min(1).max(200),
  drugB: z.string().min(1).max(200),
  severity: z.nativeEnum(AlertSeverity),
  description: z.string().min(10),
  recommendation: z.string().optional().nullable(),
  source: z.string().max(200).optional().nullable(),
})

export type CreateDrugInteraction = z.infer<typeof createDrugInteractionSchema>

export const createDrugFoodInteractionSchema = z.object({
  drugName: z.string().min(1).max(200),
  foodName: z.string().min(1).max(200),
  severity: z.nativeEnum(AlertSeverity),
  description: z.string().min(10),
  recommendation: z.string().optional().nullable(),
  source: z.string().max(200).optional().nullable(),
})

export type CreateDrugFoodInteraction = z.infer<
  typeof createDrugFoodInteractionSchema
>
