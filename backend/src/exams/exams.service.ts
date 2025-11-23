import { prisma } from '../database/prisma'
import { ExamStatus } from '@prisma/client'
import type { CreateExamInput, UpdateExamInput } from './exams.validator'
import fs from 'fs/promises'
import path from 'path'

export class ExamsService {
  // Listar exames de um paciente
  async getExams(patientId: string, status?: ExamStatus) {
    const exams = await prisma.exam.findMany({
      where: {
        patientId,
        ...(status && { status }),
      },
      orderBy: { date: 'desc' },
      include: {
        files: true,
      },
    })

    return exams.map((exam) => ({
      id: exam.id,
      patientId: exam.patientId,
      name: exam.name,
      type: exam.type,
      date: exam.date.toISOString(),
      status: exam.status,
      result: exam.result,
      doctor: exam.doctor,
      location: exam.location,
      notes: exam.notes,
      createdAt: exam.createdAt.toISOString(),
      updatedAt: exam.updatedAt.toISOString(),
      files: exam.files.map((f) => ({
        id: f.id,
        filename: f.filename,
        mimetype: f.mimetype,
        size: f.size,
        createdAt: f.createdAt.toISOString(),
      })),
    }))
  }

  // Obter detalhes de um exame
  async getExamById(examId: string) {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
        files: true,
      },
    })

    if (!exam) {
      throw new Error('Exame não encontrado')
    }

    return {
      id: exam.id,
      patientId: exam.patientId,
      patientName: exam.patient.name,
      name: exam.name,
      type: exam.type,
      date: exam.date.toISOString(),
      status: exam.status,
      result: exam.result,
      doctor: exam.doctor,
      location: exam.location,
      notes: exam.notes,
      createdAt: exam.createdAt.toISOString(),
      updatedAt: exam.updatedAt.toISOString(),
      files: exam.files.map((f) => ({
        id: f.id,
        filename: f.filename,
        filepath: f.filepath,
        mimetype: f.mimetype,
        size: f.size,
        createdAt: f.createdAt.toISOString(),
      })),
    }
  }

  // Criar exame
  async createExam(data: CreateExamInput, userId: string) {
    // Verificar acesso
    await this.verifyPatientAccess(data.patientId, userId)

    const exam = await prisma.exam.create({
      data: {
        patientId: data.patientId,
        name: data.name,
        type: data.type,
        date: new Date(data.date),
        status: data.status || ExamStatus.SCHEDULED,
        result: data.result,
        doctor: data.doctor,
        location: data.location,
        notes: data.notes,
      },
    })

    return {
      id: exam.id,
      patientId: exam.patientId,
      name: exam.name,
      type: exam.type,
      date: exam.date.toISOString(),
      status: exam.status,
      createdAt: exam.createdAt.toISOString(),
    }
  }

  // Atualizar exame
  async updateExam(examId: string, data: UpdateExamInput, userId: string) {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    })

    if (!exam) {
      throw new Error('Exame não encontrado')
    }

    await this.verifyPatientAccess(exam.patientId, userId)

    const updated = await prisma.exam.update({
      where: { id: examId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.type && { type: data.type }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.status && { status: data.status }),
        ...(data.result !== undefined && { result: data.result }),
        ...(data.doctor !== undefined && { doctor: data.doctor }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    })

    return {
      id: updated.id,
      patientId: updated.patientId,
      name: updated.name,
      type: updated.type,
      date: updated.date.toISOString(),
      status: updated.status,
      updatedAt: updated.updatedAt.toISOString(),
    }
  }

  // Upload de arquivo para exame
  async uploadFile(examId: string, file: Express.Multer.File, userId: string) {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    })

    if (!exam) {
      throw new Error('Exame não encontrado')
    }

    await this.verifyPatientAccess(exam.patientId, userId)

    const examFile = await prisma.examFile.create({
      data: {
        examId,
        filename: file.filename,
        filepath: file.path,
        mimetype: file.mimetype,
        size: file.size,
      },
    })

    return {
      id: examFile.id,
      filename: examFile.filename,
      mimetype: examFile.mimetype,
      size: examFile.size,
      createdAt: examFile.createdAt.toISOString(),
    }
  }

  // Deletar arquivo de exame
  async deleteFile(fileId: string, userId: string) {
    const file = await prisma.examFile.findUnique({
      where: { id: fileId },
      include: {
        exam: true,
      },
    })

    if (!file) {
      throw new Error('Arquivo não encontrado')
    }

    await this.verifyPatientAccess(file.exam.patientId, userId)

    // Deletar arquivo físico
    try {
      await fs.unlink(file.filepath)
    } catch (error) {
      console.error('Erro ao deletar arquivo físico:', error)
    }

    // Deletar registro do banco
    await prisma.examFile.delete({
      where: { id: fileId },
    })

    return { success: true }
  }

  // Deletar exame
  async deleteExam(examId: string, userId: string) {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        files: true,
      },
    })

    if (!exam) {
      throw new Error('Exame não encontrado')
    }

    await this.verifyPatientAccess(exam.patientId, userId)

    // Deletar arquivos físicos
    for (const file of exam.files) {
      try {
        await fs.unlink(file.filepath)
      } catch (error) {
        console.error('Erro ao deletar arquivo:', error)
      }
    }

    // Deletar exame (cascade deleta os files)
    await prisma.exam.delete({
      where: { id: examId },
    })

    return { success: true }
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

export const examsService = new ExamsService()
