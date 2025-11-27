import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { prisma } from '../database/prisma'
import { env } from '../config/env'
import { UserRole } from '@prisma/client'
import type { RegisterInput, LoginInput } from './auth.validator'

interface TokenPayload {
  userId: string
  email: string
  role: UserRole
}

interface AuthResponse {
  user: {
    id: string
    email: string
    role: UserRole
    name: string
  }
  accessToken: string
  refreshToken: string
}

export class AuthService {
  // Registrar novo usuário
  async register(data: RegisterInput): Promise<AuthResponse> {
    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new Error('Email já cadastrado')
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Criar usuário baseado no role
    let user
    if (data.role === UserRole.PATIENT) {
      if (!data.dateOfBirth || !data.gender) {
        throw new Error('Data de nascimento e gênero são obrigatórios para pacientes')
      }

      user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: data.role,
          patient: {
            create: {
              name: data.name,
              phone: data.phone,
              dateOfBirth: new Date(data.dateOfBirth),
              gender: data.gender as any,
              bloodType: data.bloodType,
              conditions: [],
              allergies: [],
            },
          },
        },
        include: {
          patient: true,
        },
      })
    } else if (data.role === UserRole.CAREGIVER) {
      user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: data.role,
          caregiver: {
            create: {
              name: data.name,
              phone: data.phone,
              relationship: data.relationship,
            },
          },
        },
        include: {
          caregiver: true,
        },
      })
    } else if (data.role === UserRole.PROFESSIONAL) {
      if (!data.specialty || !data.crm) {
        throw new Error('Especialidade e CRM são obrigatórios para profissionais')
      }

      user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: data.role,
          professional: {
            create: {
              name: data.name,
              phone: data.phone,
              specialty: data.specialty,
              crm: data.crm,
            },
          },
        },
        include: {
          professional: true,
        },
      })
    } else {
      throw new Error('Role inválido')
    }

    // Gerar tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role)

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: data.name,
      },
      ...tokens,
    }
  }

  // Login
  async login(data: LoginInput): Promise<AuthResponse> {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        patient: true,
        caregiver: true,
        professional: true,
      },
    })

    if (!user) {
      throw new Error('Email ou senha inválidos')
    }

    if (!user.active) {
      throw new Error('Usuário inativo')
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(data.password, user.password)
    if (!isValidPassword) {
      throw new Error('Email ou senha inválidos')
    }

    // Gerar tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role)

    // Obter nome baseado no role
    let name = ''
    if (user.patient) name = user.patient.name
    else if (user.caregiver) name = user.caregiver.name
    else if (user.professional) name = user.professional.name

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name,
      },
      ...tokens,
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Verificar se refresh token existe no banco
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    })

    if (!storedToken) {
      throw new Error('Refresh token inválido')
    }

    // Verificar se expirou
    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } })
      throw new Error('Refresh token expirado')
    }

    // Gerar novo access token
    const accessToken = this.generateAccessToken(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role
    )

    return { accessToken }
  }

  // Logout
  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    })
  }

  // Solicitar recuperação de senha
  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      // Por segurança, não revelar se o email existe
      return
    }

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Salvar no banco com expiração de 1 hora
    await prisma.passwordReset.create({
      data: {
        email: user.email,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 3600000), // 1 hora
      },
    })

    // Enviar email com link de reset
    try {
      const { sendPasswordResetEmail } = await import('../common/email.service')
      await sendPasswordResetEmail(user.email, resetToken)
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error)
      // Mesmo se o email falhar, o token foi gerado
      console.log(`Reset token para ${email}: ${resetToken}`)
    }
  }

  // Resetar senha
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const passwordReset = await prisma.passwordReset.findUnique({
      where: { token: hashedToken },
    })

    if (!passwordReset || passwordReset.used) {
      throw new Error('Token inválido ou já utilizado')
    }

    if (passwordReset.expiresAt < new Date()) {
      throw new Error('Token expirado')
    }

    // Atualizar senha
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { email: passwordReset.email },
      data: { password: hashedPassword },
    })

    // Marcar token como usado
    await prisma.passwordReset.update({
      where: { id: passwordReset.id },
      data: { used: true },
    })

    // Deletar todos os refresh tokens do usuário
    const user = await prisma.user.findUnique({ where: { email: passwordReset.email } })
    if (user) {
      await prisma.refreshToken.deleteMany({ where: { userId: user.id } })
    }
  }

  // Gerar access e refresh tokens
  private async generateTokens(userId: string, email: string, role: UserRole) {
    const accessToken = this.generateAccessToken(userId, email, role)
    const refreshToken = this.generateRefreshToken()

    // Salvar refresh token no banco
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      },
    })

    return { accessToken, refreshToken }
  }

  private generateAccessToken(userId: string, email: string, role: UserRole): string {
    const payload: TokenPayload = { userId, email, role }
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions)
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex')
  }

  // Verificar access token
  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as TokenPayload
    } catch (error) {
      throw new Error('Token inválido ou expirado')
    }
  }

  // Obter dados do usuário logado
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patient: true,
        caregiver: true,
        professional: true,
      },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    let profile: any = null
    if (user.patient) profile = user.patient
    else if (user.caregiver) profile = user.caregiver
    else if (user.professional) profile = user.professional

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile,
    }
  }
}

export const authService = new AuthService()
