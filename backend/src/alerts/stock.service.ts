import { PrismaClient } from '@prisma/client'
import type { CreateStockBody, UpdateStockBody } from './alerts.validator'
import { alertsService } from './alerts.service'

const prisma = new PrismaClient()

/**
 * SERVIÇO DE GERENCIAMENTO DE ESTOQUE
 *
 * Funções para criar, atualizar e consumir estoque de medicamentos.
 */

// ============================================================================
// CRIAR ESTOQUE
// ============================================================================

export async function createMedicationStock(
  data: CreateStockBody,
  userId: string
) {
  // Verificar se medicamento existe e se usuário tem acesso
  const medication = await prisma.medication.findUnique({
    where: { id: data.medicationId },
    include: { patient: true },
  })

  if (!medication) {
    throw new Error('Medicamento não encontrado')
  }

  // Verificar acesso
  await verifyMedicationAccess(medication.patientId, userId)

  // Verificar se já existe estoque para este medicamento
  const existingStock = await prisma.medicationStock.findUnique({
    where: { medicationId: data.medicationId },
  })

  if (existingStock) {
    throw new Error('Estoque já existe para este medicamento')
  }

  // Criar estoque
  const stock = await prisma.medicationStock.create({
    data: {
      medicationId: data.medicationId,
      currentQuantity: data.currentQuantity,
      initialQuantity: data.initialQuantity,
      unitType: data.unitType,
      lowStockThreshold: data.lowStockThreshold || 30,
      criticalStockThreshold: data.criticalStockThreshold || 10,
      lastRestockDate: data.lastRestockDate
        ? new Date(data.lastRestockDate)
        : null,
      nextRestockDate: data.nextRestockDate
        ? new Date(data.nextRestockDate)
        : null,
      notes: data.notes,
    },
  })

  // Regenerar alertas de estoque
  await alertsService.generateAlertsForPatient(medication.patientId)

  return stock
}

// ============================================================================
// OBTER ESTOQUE
// ============================================================================

export async function getMedicationStock(medicationId: string, userId: string) {
  const medication = await prisma.medication.findUnique({
    where: { id: medicationId },
    include: {
      stock: true,
      patient: true,
    },
  })

  if (!medication) {
    throw new Error('Medicamento não encontrado')
  }

  await verifyMedicationAccess(medication.patientId, userId)

  return medication.stock
}

// ============================================================================
// ATUALIZAR ESTOQUE
// ============================================================================

export async function updateMedicationStock(
  medicationId: string,
  data: UpdateStockBody,
  userId: string
) {
  const medication = await prisma.medication.findUnique({
    where: { id: medicationId },
    include: {
      stock: true,
      patient: true,
    },
  })

  if (!medication) {
    throw new Error('Medicamento não encontrado')
  }

  if (!medication.stock) {
    throw new Error('Estoque não encontrado para este medicamento')
  }

  await verifyMedicationAccess(medication.patientId, userId)

  // Atualizar estoque
  const updateData: any = {}

  if (data.currentQuantity !== undefined) {
    updateData.currentQuantity = data.currentQuantity
  }
  if (data.lowStockThreshold !== undefined) {
    updateData.lowStockThreshold = data.lowStockThreshold
  }
  if (data.criticalStockThreshold !== undefined) {
    updateData.criticalStockThreshold = data.criticalStockThreshold
  }
  if (data.lastRestockDate !== undefined) {
    updateData.lastRestockDate = data.lastRestockDate
      ? new Date(data.lastRestockDate)
      : null
  }
  if (data.nextRestockDate !== undefined) {
    updateData.nextRestockDate = data.nextRestockDate
      ? new Date(data.nextRestockDate)
      : null
  }
  if (data.notes !== undefined) {
    updateData.notes = data.notes
  }

  const updatedStock = await prisma.medicationStock.update({
    where: { id: medication.stock.id },
    data: updateData,
  })

  // Regenerar alertas de estoque
  await alertsService.generateAlertsForPatient(medication.patientId)

  return updatedStock
}

// ============================================================================
// CONSUMIR ESTOQUE (ao tomar medicamento)
// ============================================================================

export async function consumeMedicationStock(
  medicationId: string,
  quantity: number,
  userId: string
) {
  const medication = await prisma.medication.findUnique({
    where: { id: medicationId },
    include: {
      stock: true,
      patient: true,
    },
  })

  if (!medication) {
    throw new Error('Medicamento não encontrado')
  }

  if (!medication.stock) {
    throw new Error('Estoque não configurado para este medicamento')
  }

  await verifyMedicationAccess(medication.patientId, userId)

  // Verificar se há estoque suficiente
  if (medication.stock.currentQuantity < quantity) {
    throw new Error(
      `Estoque insuficiente. Disponível: ${medication.stock.currentQuantity}`
    )
  }

  // Atualizar estoque
  const updatedStock = await prisma.medicationStock.update({
    where: { id: medication.stock.id },
    data: {
      currentQuantity: medication.stock.currentQuantity - quantity,
    },
  })

  // Regenerar alertas de estoque
  await alertsService.generateAlertsForPatient(medication.patientId)

  return updatedStock
}

// ============================================================================
// REABASTECER ESTOQUE
// ============================================================================

export async function restockMedication(
  medicationId: string,
  quantity: number,
  userId: string
) {
  const medication = await prisma.medication.findUnique({
    where: { id: medicationId },
    include: {
      stock: true,
      patient: true,
    },
  })

  if (!medication) {
    throw new Error('Medicamento não encontrado')
  }

  if (!medication.stock) {
    throw new Error('Estoque não configurado para este medicamento')
  }

  await verifyMedicationAccess(medication.patientId, userId)

  // Atualizar estoque
  const newQuantity = medication.stock.currentQuantity + quantity
  const updatedStock = await prisma.medicationStock.update({
    where: { id: medication.stock.id },
    data: {
      currentQuantity: newQuantity,
      initialQuantity: newQuantity, // Atualizar também a quantidade inicial
      lastRestockDate: new Date(),
    },
  })

  // Regenerar alertas (pode remover alertas de estoque baixo)
  await alertsService.generateAlertsForPatient(medication.patientId)

  return updatedStock
}

// ============================================================================
// DELETAR ESTOQUE
// ============================================================================

export async function deleteMedicationStock(
  medicationId: string,
  userId: string
) {
  const medication = await prisma.medication.findUnique({
    where: { id: medicationId },
    include: {
      stock: true,
      patient: true,
    },
  })

  if (!medication) {
    throw new Error('Medicamento não encontrado')
  }

  if (!medication.stock) {
    throw new Error('Estoque não encontrado')
  }

  await verifyMedicationAccess(medication.patientId, userId)

  await prisma.medicationStock.delete({
    where: { id: medication.stock.id },
  })

  // Limpar alertas de estoque relacionados
  await prisma.medicationAlert.deleteMany({
    where: {
      medicationId,
      type: {
        in: ['STOCK_LOW', 'STOCK_CRITICAL', 'STOCK_LAST_UNIT'],
      },
    },
  })
}

// ============================================================================
// VERIFICAÇÃO DE ACESSO
// ============================================================================

async function verifyMedicationAccess(
  patientId: string,
  userId: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      patient: true,
      caregiver: {
        include: {
          patients: true,
        },
      },
      professional: {
        include: {
          patients: true,
        },
      },
    },
  })

  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  // Paciente próprio
  if (user.patient?.id === patientId) {
    return
  }

  // Cuidador deste paciente
  if (user.caregiver) {
    const hasAccess = user.caregiver.patients.some(
      (p) => p.patientId === patientId
    )
    if (hasAccess) return
  }

  // Profissional deste paciente
  if (user.professional) {
    const hasAccess = user.professional.patients.some(
      (p) => p.patientId === patientId
    )
    if (hasAccess) return
  }

  throw new Error('Acesso negado')
}

// ============================================================================
// EXPORTS
// ============================================================================

export const stockService = {
  createMedicationStock,
  getMedicationStock,
  updateMedicationStock,
  consumeMedicationStock,
  restockMedication,
  deleteMedicationStock,
}
