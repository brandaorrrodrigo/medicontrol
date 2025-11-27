import type { Request, Response } from 'express'
import { stockService } from './stock.service'
import {
  createStockBodySchema,
  updateStockBodySchema,
} from './alerts.validator'
import { z } from 'zod'

/**
 * CONTROLLER DE ESTOQUE
 *
 * Handlers para endpoints de gerenciamento de estoque.
 */

// ============================================================================
// POST /api/medications/:medicationId/stock - Criar estoque
// ============================================================================

export async function createStock(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { medicationId } = req.params

    const data = createStockBodySchema.parse({
      ...req.body,
      medicationId,
    })

    const stock = await stockService.createMedicationStock(data, userId)

    return res.status(201).json(stock)
  } catch (error: any) {
    console.error('Erro ao criar estoque:', error)

    if (error.message === 'Medicamento não encontrado') {
      return res.status(404).json({ error: 'Medicamento não encontrado' })
    }

    if (error.message === 'Estoque já existe para este medicamento') {
      return res.status(409).json({ error: 'Estoque já existe' })
    }

    if (error.message === 'Acesso negado') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors,
      })
    }

    return res.status(500).json({ error: 'Erro ao criar estoque' })
  }
}

// ============================================================================
// GET /api/medications/:medicationId/stock - Obter estoque
// ============================================================================

export async function getStock(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { medicationId } = req.params

    const stock = await stockService.getMedicationStock(medicationId, userId)

    if (!stock) {
      return res.status(404).json({ error: 'Estoque não encontrado' })
    }

    return res.json(stock)
  } catch (error: any) {
    console.error('Erro ao obter estoque:', error)

    if (error.message === 'Medicamento não encontrado') {
      return res.status(404).json({ error: 'Medicamento não encontrado' })
    }

    if (error.message === 'Acesso negado') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    return res.status(500).json({ error: 'Erro ao obter estoque' })
  }
}

// ============================================================================
// PUT /api/medications/:medicationId/stock - Atualizar estoque
// ============================================================================

export async function updateStock(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { medicationId } = req.params

    const data = updateStockBodySchema.parse(req.body)

    const stock = await stockService.updateMedicationStock(
      medicationId,
      data,
      userId
    )

    return res.json(stock)
  } catch (error: any) {
    console.error('Erro ao atualizar estoque:', error)

    if (error.message === 'Medicamento não encontrado') {
      return res.status(404).json({ error: 'Medicamento não encontrado' })
    }

    if (
      error.message === 'Estoque não encontrado para este medicamento' ||
      error.message === 'Estoque não encontrado'
    ) {
      return res.status(404).json({ error: 'Estoque não encontrado' })
    }

    if (error.message === 'Acesso negado') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors,
      })
    }

    return res.status(500).json({ error: 'Erro ao atualizar estoque' })
  }
}

// ============================================================================
// POST /api/medications/:medicationId/stock/consume - Consumir estoque
// ============================================================================

const consumeStockSchema = z.object({
  quantity: z.number().min(0.01),
})

export async function consumeStock(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { medicationId } = req.params
    const { quantity } = consumeStockSchema.parse(req.body)

    const stock = await stockService.consumeMedicationStock(
      medicationId,
      quantity,
      userId
    )

    return res.json(stock)
  } catch (error: any) {
    console.error('Erro ao consumir estoque:', error)

    if (error.message === 'Medicamento não encontrado') {
      return res.status(404).json({ error: 'Medicamento não encontrado' })
    }

    if (error.message === 'Estoque não configurado para este medicamento') {
      return res
        .status(404)
        .json({ error: 'Estoque não configurado para este medicamento' })
    }

    if (error.message?.startsWith('Estoque insuficiente')) {
      return res.status(400).json({ error: error.message })
    }

    if (error.message === 'Acesso negado') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors,
      })
    }

    return res.status(500).json({ error: 'Erro ao consumir estoque' })
  }
}

// ============================================================================
// POST /api/medications/:medicationId/stock/restock - Reabastecer estoque
// ============================================================================

const restockSchema = z.object({
  quantity: z.number().min(0.01),
})

export async function restockMedication(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { medicationId } = req.params
    const { quantity } = restockSchema.parse(req.body)

    const stock = await stockService.restockMedication(
      medicationId,
      quantity,
      userId
    )

    return res.json(stock)
  } catch (error: any) {
    console.error('Erro ao reabastecer estoque:', error)

    if (error.message === 'Medicamento não encontrado') {
      return res.status(404).json({ error: 'Medicamento não encontrado' })
    }

    if (error.message === 'Estoque não configurado para este medicamento') {
      return res
        .status(404)
        .json({ error: 'Estoque não configurado para este medicamento' })
    }

    if (error.message === 'Acesso negado') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors,
      })
    }

    return res.status(500).json({ error: 'Erro ao reabastecer estoque' })
  }
}

// ============================================================================
// DELETE /api/medications/:medicationId/stock - Deletar estoque
// ============================================================================

export async function deleteStock(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { medicationId } = req.params

    await stockService.deleteMedicationStock(medicationId, userId)

    return res.json({ message: 'Estoque deletado com sucesso' })
  } catch (error: any) {
    console.error('Erro ao deletar estoque:', error)

    if (error.message === 'Medicamento não encontrado') {
      return res.status(404).json({ error: 'Medicamento não encontrado' })
    }

    if (error.message === 'Estoque não encontrado') {
      return res.status(404).json({ error: 'Estoque não encontrado' })
    }

    if (error.message === 'Acesso negado') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    return res.status(500).json({ error: 'Erro ao deletar estoque' })
  }
}
