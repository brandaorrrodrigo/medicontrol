import { Request, Response, NextFunction } from 'express'
import { authService } from './auth.service'
import { UserRole } from '@prisma/client'

// Estender tipo do Request para incluir dados do usuário
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
        role: UserRole
      }
    }
  }
}

// Middleware de autenticação
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Obter token do header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Token não fornecido',
      })
      return
    }

    const token = authHeader.substring(7) // Remove "Bearer "

    // Verificar token
    const payload = authService.verifyAccessToken(token)

    // Adicionar dados do usuário ao request
    req.user = payload

    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado',
    })
    return
  }
}

// Middleware de autorização por role
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Não autenticado',
      })
      return
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Acesso negado',
      })
      return
    }

    next()
  }
}
