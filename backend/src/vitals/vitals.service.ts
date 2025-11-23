import { prisma } from '../database/prisma'
import { VitalSignStatus, VitalSignType } from '@prisma/client'
import type { CreateVitalSignInput } from './vitals.validator'

export class VitalsService {
  // Listar sinais vitais de um paciente
  async getVitalSigns(patientId: string, type?: VitalSignType, limit: number = 50) {
    const vitalSigns = await prisma.vitalSign.findMany({
      where: {
        patientId,
        ...(type && { type }),
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    })

    return vitalSigns.map((v) => ({
      id: v.id,
      patientId: v.patientId,
      type: v.type,
      value: v.value,
      unit: v.unit,
      status: v.status,
      notes: v.notes,
      recordedBy: v.recordedBy,
      timestamp: v.timestamp.toISOString(),
      createdAt: v.createdAt.toISOString(),
    }))
  }

  // Criar sinal vital
  async createVitalSign(data: CreateVitalSignInput, userId: string) {
    // Verificar acesso
    await this.verifyPatientAccess(data.patientId, userId)

    // Calcular status baseado nos valores
    const status = this.calculateStatus(data.type, data.value)

    const vitalSign = await prisma.vitalSign.create({
      data: {
        patientId: data.patientId,
        type: data.type,
        value: data.value,
        unit: data.unit,
        status,
        notes: data.notes,
        recordedBy: data.recordedBy,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      },
    })

    return {
      id: vitalSign.id,
      patientId: vitalSign.patientId,
      type: vitalSign.type,
      value: vitalSign.value,
      unit: vitalSign.unit,
      status: vitalSign.status,
      timestamp: vitalSign.timestamp.toISOString(),
      createdAt: vitalSign.createdAt.toISOString(),
    }
  }

  // Deletar sinal vital
  async deleteVitalSign(vitalSignId: string, userId: string) {
    const vitalSign = await prisma.vitalSign.findUnique({
      where: { id: vitalSignId },
    })

    if (!vitalSign) {
      throw new Error('Sinal vital não encontrado')
    }

    await this.verifyPatientAccess(vitalSign.patientId, userId)

    await prisma.vitalSign.delete({
      where: { id: vitalSignId },
    })

    return { success: true }
  }

  // Obter estatísticas
  async getStats(patientId: string, type: VitalSignType, days: number = 30) {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const vitalSigns = await prisma.vitalSign.findMany({
      where: {
        patientId,
        type,
        timestamp: { gte: since },
      },
      orderBy: { timestamp: 'asc' },
    })

    return vitalSigns.map((v) => ({
      value: v.value,
      timestamp: v.timestamp.toISOString(),
      status: v.status,
    }))
  }

  // Calcular status baseado no tipo e valor
  private calculateStatus(type: VitalSignType, value: string): VitalSignStatus {
    try {
      switch (type) {
        case VitalSignType.BLOOD_PRESSURE: {
          const [systolic, diastolic] = value.split('/').map(Number)
          if (systolic >= 140 || diastolic >= 90) return VitalSignStatus.DANGER
          if (systolic >= 130 || diastolic >= 85) return VitalSignStatus.WARNING
          return VitalSignStatus.NORMAL
        }

        case VitalSignType.HEART_RATE: {
          const hr = parseInt(value)
          if (hr < 60 || hr > 100) return VitalSignStatus.WARNING
          if (hr < 40 || hr > 120) return VitalSignStatus.DANGER
          return VitalSignStatus.NORMAL
        }

        case VitalSignType.GLUCOSE: {
          const glucose = parseInt(value)
          if (glucose < 70 || glucose > 140) return VitalSignStatus.WARNING
          if (glucose < 50 || glucose > 200) return VitalSignStatus.DANGER
          return VitalSignStatus.NORMAL
        }

        case VitalSignType.TEMPERATURE: {
          const temp = parseFloat(value)
          if (temp < 36 || temp > 37.5) return VitalSignStatus.WARNING
          if (temp < 35 || temp > 39) return VitalSignStatus.DANGER
          return VitalSignStatus.NORMAL
        }

        case VitalSignType.OXYGEN_SATURATION: {
          const oxygen = parseInt(value)
          if (oxygen < 95) return VitalSignStatus.WARNING
          if (oxygen < 90) return VitalSignStatus.DANGER
          return VitalSignStatus.NORMAL
        }

        default:
          return VitalSignStatus.NORMAL
      }
    } catch {
      return VitalSignStatus.NORMAL
    }
  }

  // Verificar acesso ao paciente
  private async verifyPatientAccess(patientId: string, userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patient: true,
        caregiver: {
          include: {
            patients: {
              where: { patientId },
            },
          },
        },
        professional: {
          include: {
            patients: {
              where: { patientId },
            },
          },
        },
      },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    if (user.patient && user.patient.id === patientId) return true
    if (user.caregiver && user.caregiver.patients.length > 0) return true
    if (user.professional && user.professional.patients.length > 0) return true

    throw new Error('Acesso negado')
  }
}

export const vitalsService = new VitalsService()
