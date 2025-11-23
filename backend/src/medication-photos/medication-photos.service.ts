import { prisma } from '../config/database'
import { MedicationPhotoType } from '@prisma/client'
import { UploadMedicationPhotoInput, UpdateMedicationPhotoInput } from './medication-photos.validator'
import fs from 'fs/promises'
import path from 'path'

export class MedicationPhotosService {
  // Verificar se o usuário tem permissão para acessar o medicamento
  private async verifyMedicationAccess(medicationId: string, userId: string): Promise<void> {
    const medication = await prisma.medication.findUnique({
      where: { id: medicationId },
      include: {
        patient: {
          include: {
            user: true,
            caregivers: {
              include: {
                caregiver: {
                  include: { user: true },
                },
              },
            },
            professionals: {
              include: {
                professional: {
                  include: { user: true },
                },
              },
            },
          },
        },
      },
    })

    if (!medication) {
      throw new Error('Medicamento não encontrado')
    }

    // Verificar se é o próprio paciente
    if (medication.patient.userId === userId) {
      return
    }

    // Verificar se é um cuidador do paciente
    const isCaregiver = medication.patient.caregivers.some(
      (pc) => pc.caregiver.userId === userId
    )
    if (isCaregiver) {
      return
    }

    // Verificar se é um profissional do paciente
    const isProfessional = medication.patient.professionals.some(
      (pp) => pp.professional.userId === userId
    )
    if (isProfessional) {
      return
    }

    throw new Error('Você não tem permissão para acessar este medicamento')
  }

  // GET /api/medications/:medicationId/photos?type=MEDICATION_BOX
  async getMedicationPhotos(
    medicationId: string,
    type?: MedicationPhotoType,
    userId?: string
  ) {
    // Verificar acesso se userId fornecido
    if (userId) {
      await this.verifyMedicationAccess(medicationId, userId)
    }

    const photos = await prisma.medicationPhoto.findMany({
      where: {
        medicationId,
        ...(type && { type }),
      },
      orderBy: { takenAt: 'desc' },
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            dosage: true,
          },
        },
        prescription: {
          select: {
            id: true,
            date: true,
            professional: {
              select: {
                name: true,
                specialty: true,
              },
            },
          },
        },
      },
    })

    return photos
  }

  // GET /api/medications/photos/:photoId
  async getMedicationPhotoById(photoId: string, userId?: string) {
    const photo = await prisma.medicationPhoto.findUnique({
      where: { id: photoId },
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            dosage: true,
            patient: {
              select: {
                id: true,
                name: true,
                userId: true,
              },
            },
          },
        },
        prescription: {
          select: {
            id: true,
            date: true,
            professional: {
              select: {
                name: true,
                specialty: true,
              },
            },
          },
        },
      },
    })

    if (!photo) {
      throw new Error('Foto não encontrada')
    }

    // Verificar acesso se userId fornecido
    if (userId) {
      await this.verifyMedicationAccess(photo.medicationId, userId)
    }

    return photo
  }

  // POST /api/medications/:medicationId/photos
  async uploadMedicationPhoto(
    medicationId: string,
    file: Express.Multer.File,
    data: UploadMedicationPhotoInput,
    userId: string
  ) {
    // Verificar acesso
    await this.verifyMedicationAccess(medicationId, userId)

    // Buscar o paciente do medicamento
    const medication = await prisma.medication.findUnique({
      where: { id: medicationId },
      select: { patientId: true },
    })

    if (!medication) {
      throw new Error('Medicamento não encontrado')
    }

    // Validar prescrição se fornecida
    if (data.prescriptionId) {
      const prescription = await prisma.prescription.findUnique({
        where: { id: data.prescriptionId },
      })

      if (!prescription || prescription.patientId !== medication.patientId) {
        throw new Error('Prescrição inválida para este paciente')
      }
    }

    // Criar registro da foto
    const photo = await prisma.medicationPhoto.create({
      data: {
        patientId: medication.patientId,
        medicationId,
        prescriptionId: data.prescriptionId || null,
        type: data.type,
        filename: file.filename,
        filepath: file.path,
        mimetype: file.mimetype,
        size: file.size,
        takenAt: data.takenAt ? new Date(data.takenAt) : new Date(),
        notes: data.notes || null,
      },
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            dosage: true,
          },
        },
      },
    })

    return photo
  }

  // PUT /api/medications/photos/:photoId
  async updateMedicationPhoto(
    photoId: string,
    data: UpdateMedicationPhotoInput,
    userId: string
  ) {
    const photo = await this.getMedicationPhotoById(photoId)

    // Verificar acesso
    await this.verifyMedicationAccess(photo.medicationId, userId)

    const updatedPhoto = await prisma.medicationPhoto.update({
      where: { id: photoId },
      data: {
        ...(data.type && { type: data.type }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.ocrText !== undefined && { ocrText: data.ocrText }),
      },
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            dosage: true,
          },
        },
      },
    })

    return updatedPhoto
  }

  // DELETE /api/medications/photos/:photoId
  async deleteMedicationPhoto(photoId: string, userId: string) {
    const photo = await this.getMedicationPhotoById(photoId)

    // Verificar acesso
    await this.verifyMedicationAccess(photo.medicationId, userId)

    // Deletar arquivo físico
    try {
      await fs.unlink(photo.filepath)
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error)
      // Continua mesmo se falhar ao deletar arquivo
    }

    // Deletar registro do banco
    await prisma.medicationPhoto.delete({
      where: { id: photoId },
    })

    return { message: 'Foto deletada com sucesso' }
  }

  // GET /api/patients/:patientId/medication-photos - Listar todas as fotos de medicamentos do paciente
  async getPatientMedicationPhotos(
    patientId: string,
    type?: MedicationPhotoType,
    userId?: string
  ) {
    // Verificar se o usuário tem acesso ao paciente
    if (userId) {
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
          user: true,
          caregivers: {
            include: {
              caregiver: {
                include: { user: true },
              },
            },
          },
          professionals: {
            include: {
              professional: {
                include: { user: true },
              },
            },
          },
        },
      })

      if (!patient) {
        throw new Error('Paciente não encontrado')
      }

      const isOwner = patient.userId === userId
      const isCaregiver = patient.caregivers.some((pc) => pc.caregiver.userId === userId)
      const isProfessional = patient.professionals.some((pp) => pp.professional.userId === userId)

      if (!isOwner && !isCaregiver && !isProfessional) {
        throw new Error('Você não tem permissão para acessar este paciente')
      }
    }

    const photos = await prisma.medicationPhoto.findMany({
      where: {
        patientId,
        ...(type && { type }),
      },
      orderBy: { takenAt: 'desc' },
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            dosage: true,
            active: true,
          },
        },
        prescription: {
          select: {
            id: true,
            date: true,
            professional: {
              select: {
                name: true,
                specialty: true,
              },
            },
          },
        },
      },
    })

    return photos
  }
}

export const medicationPhotosService = new MedicationPhotosService()
