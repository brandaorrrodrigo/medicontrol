import { Request, Response, NextFunction } from 'express'
import { authService } from './auth.service'
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from './auth.validator'
import { z } from 'zod'

export class AuthController {
  // POST /api/auth/register
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body)
      const result = await authService.register(data)

      // Definir refresh token como httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      })

      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        })
      }

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        })
      }

      next(error)
    }
  }

  // POST /api/auth/login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body)
      const result = await authService.login(data)

      // Definir refresh token como httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      })

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        })
      }

      if (error instanceof Error) {
        return res.status(401).json({
          success: false,
          error: error.message,
        })
      }

      next(error)
    }
  }

  // POST /api/auth/refresh
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token não fornecido',
        })
      }

      const result = await authService.refreshToken(refreshToken)

      res.status(200).json({
        success: true,
        data: result,
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({
          success: false,
          error: error.message,
        })
      }

      next(error)
    }
  }

  // POST /api/auth/logout
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken

      if (refreshToken) {
        await authService.logout(refreshToken)
      }

      res.clearCookie('refreshToken')

      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso',
      })
    } catch (error) {
      next(error)
    }
  }

  // POST /api/auth/forgot-password
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = forgotPasswordSchema.parse(req.body)
      await authService.forgotPassword(data.email)

      res.status(200).json({
        success: true,
        message: 'Se o email existir, você receberá instruções para redefinir sua senha',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        })
      }

      next(error)
    }
  }

  // POST /api/auth/reset-password
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = resetPasswordSchema.parse(req.body)
      await authService.resetPassword(data.token, data.password)

      res.status(200).json({
        success: true,
        message: 'Senha redefinida com sucesso',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        })
      }

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        })
      }

      next(error)
    }
  }

  // GET /api/auth/me
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        })
      }

      const user = await authService.getMe(userId)

      res.status(200).json({
        success: true,
        data: user,
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({
          success: false,
          error: error.message,
        })
      }

      next(error)
    }
  }
}

export const authController = new AuthController()
