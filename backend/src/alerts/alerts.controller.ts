import type { Request, Response } from 'express'
import { alertsService } from './alerts.service'
import {
  listAlertsQuerySchema,
  markAlertReadParamSchema,
  resolveAlertParamSchema,
  readAllAlertsBodySchema,
  refreshAlertsBodySchema,
} from './alerts.validator'

/**
 * CONTROLLER DE ALERTAS
 *
 * Handlers para os endpoints de alertas medicamentosos.
 */

// ============================================================================
// GET /api/alerts - Listar alertas do paciente
// ============================================================================

export async function listAlerts(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const patientId = (req as any).patientId

    // Validar query params
    const query = listAlertsQuerySchema.parse(req.query)

    const result = await alertsService.getPatientAlerts(
      patientId,
      userId,
      query
    )

    return res.json(result)
  } catch (error: any) {
    console.error('Erro ao listar alertas:', error)

    if (error.message === 'Acesso negado') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Parâmetros inválidos',
        details: error.errors,
      })
    }

    return res.status(500).json({ error: 'Erro ao listar alertas' })
  }
}

// ============================================================================
// GET /api/alerts/count - Contar alertas não lidos
// ============================================================================

export async function countUnreadAlerts(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const patientId = (req as any).patientId

    const count = await alertsService.countUnreadAlerts(patientId, userId)

    return res.json({ count })
  } catch (error: any) {
    console.error('Erro ao contar alertas:', error)

    if (error.message === 'Acesso negado') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    return res.status(500).json({ error: 'Erro ao contar alertas' })
  }
}

// ============================================================================
// PATCH /api/alerts/:id/read - Marcar alerta como lido
// ============================================================================

export async function markAlertAsRead(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { id } = markAlertReadParamSchema.parse(req.params)

    await alertsService.markAlertAsRead(id, userId)

    return res.json({ message: 'Alerta marcado como lido' })
  } catch (error: any) {
    console.error('Erro ao marcar alerta como lido:', error)

    if (error.message === 'Alerta não encontrado') {
      return res.status(404).json({ error: 'Alerta não encontrado' })
    }

    if (error.message === 'Acesso negado') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'ID inválido',
        details: error.errors,
      })
    }

    return res.status(500).json({ error: 'Erro ao marcar alerta' })
  }
}

// ============================================================================
// PATCH /api/alerts/:id/resolve - Marcar alerta como resolvido
// ============================================================================

export async function resolveAlert(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { id } = resolveAlertParamSchema.parse(req.params)

    await alertsService.resolveAlert(id, userId)

    return res.json({ message: 'Alerta resolvido' })
  } catch (error: any) {
    console.error('Erro ao resolver alerta:', error)

    if (error.message === 'Alerta não encontrado') {
      return res.status(404).json({ error: 'Alerta não encontrado' })
    }

    if (error.message === 'Acesso negado') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'ID inválido',
        details: error.errors,
      })
    }

    return res.status(500).json({ error: 'Erro ao resolver alerta' })
  }
}

// ============================================================================
// POST /api/alerts/read-all - Marcar todos como lidos
// ============================================================================

export async function readAllAlerts(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const patientId = (req as any).patientId
    const { type } = readAllAlertsBodySchema.parse(req.body)

    const count = await alertsService.markAllAlertsAsRead(
      patientId,
      userId,
      type
    )

    return res.json({
      message: `${count} alerta(s) marcado(s) como lido(s)`,
      count,
    })
  } catch (error: any) {
    console.error('Erro ao marcar todos alertas:', error)

    if (error.message === 'Acesso negado') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors,
      })
    }

    return res.status(500).json({ error: 'Erro ao marcar alertas' })
  }
}

// ============================================================================
// POST /api/alerts/refresh - Regenerar alertas (DEBUG)
// ============================================================================

export async function refreshAlerts(req: Request, res: Response) {
  try {
    const patientId = (req as any).patientId
    const { medicationId: _medicationId, types: _types } = refreshAlertsBodySchema.parse(req.body)

    // TODO: Se medicationId ou types forem fornecidos, filtrar a regeneração
    // Por enquanto, regenera todos os alertas

    await alertsService.generateAlertsForPatient(patientId)

    return res.json({
      message: 'Alertas regenerados com sucesso',
    })
  } catch (error: any) {
    console.error('Erro ao regenerar alertas:', error)

    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors,
      })
    }

    return res.status(500).json({ error: 'Erro ao regenerar alertas' })
  }
}
