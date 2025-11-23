import { prisma } from '../database/prisma'
import { PhotoType } from '@prisma/client'
import fs from 'fs/promises'

export class PhotosService {
  // Listar fotos de um paciente
  async getPhotos(patientId: string, type?: PhotoType) {
    const photos = await prisma.photo.findMany({
      where: {
        patientId,
        ...(type && { type }),
      },
      orderBy: { date: 'desc' },
    })

    return photos.map((photo) => ({
      id: photo.id,
      patientId: photo.patientId,
      type: photo.type,
      filename: photo.filename,
      mimetype: photo.mimetype,
      size: photo.size,
      date: photo.date.toISOString(),
      treatmentPhase: photo.treatmentPhase,
      notes: photo.notes,
      createdAt: photo.createdAt.toISOString(),
    }))
  }

  // Upload de foto
  async uploadPhoto(
    patientId: string,
    file: Express.Multer.File,
    data: {
      type: PhotoType
      treatmentPhase?: string
      notes?: string
    },
    userId: string
  ) {
    // Verificar acesso
    await this.verifyPatientAccess(patientId, userId)

    const photo = await prisma.photo.create({
      data: {
        patientId,
        type: data.type,
        filename: file.filename,
        filepath: file.path,
        mimetype: file.mimetype,
        size: file.size,
        treatmentPhase: data.treatmentPhase,
        notes: data.notes,
      },
    })

    return {
      id: photo.id,
      patientId: photo.patientId,
      type: photo.type,
      filename: photo.filename,
      size: photo.size,
      date: photo.date.toISOString(),
      treatmentPhase: photo.treatmentPhase,
      notes: photo.notes,
      createdAt: photo.createdAt.toISOString(),
    }
  }

  // Atualizar metadados da foto
  async updatePhoto(
    photoId: string,
    data: {
      type?: PhotoType
      treatmentPhase?: string | null
      notes?: string | null
    },
    userId: string
  ) {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    })

    if (!photo) {
      throw new Error('Foto não encontrada')
    }

    await this.verifyPatientAccess(photo.patientId, userId)

    const updated = await prisma.photo.update({
      where: { id: photoId },
      data: {
        ...(data.type && { type: data.type }),
        ...(data.treatmentPhase !== undefined && { treatmentPhase: data.treatmentPhase }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    })

    return {
      id: updated.id,
      type: updated.type,
      treatmentPhase: updated.treatmentPhase,
      notes: updated.notes,
    }
  }

  // Deletar foto
  async deletePhoto(photoId: string, userId: string) {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    })

    if (!photo) {
      throw new Error('Foto não encontrada')
    }

    await this.verifyPatientAccess(photo.patientId, userId)

    // Deletar arquivo físico
    try {
      await fs.unlink(photo.filepath)
    } catch (error) {
      console.error('Erro ao deletar arquivo físico:', error)
    }

    // Deletar registro
    await prisma.photo.delete({
      where: { id: photoId },
    })

    return { success: true }
  }

  // Comparar fotos antes/depois
  async comparePhotos(patientId: string, beforePhotoId: string, afterPhotoId: string) {
    const before = await prisma.photo.findUnique({
      where: { id: beforePhotoId },
    })

    const after = await prisma.photo.findUnique({
      where: { id: afterPhotoId },
    })

    if (!before || !after) {
      throw new Error('Foto não encontrada')
    }

    if (before.patientId !== patientId || after.patientId !== patientId) {
      throw new Error('Fotos não pertencem ao mesmo paciente')
    }

    return {
      before: {
        id: before.id,
        type: before.type,
        filename: before.filename,
        date: before.date.toISOString(),
        treatmentPhase: before.treatmentPhase,
        notes: before.notes,
      },
      after: {
        id: after.id,
        type: after.type,
        filename: after.filename,
        date: after.date.toISOString(),
        treatmentPhase: after.treatmentPhase,
        notes: after.notes,
      },
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

export const photosService = new PhotosService()
