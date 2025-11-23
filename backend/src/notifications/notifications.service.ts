import { prisma } from '../database/prisma'
import { NotificationType } from '@prisma/client'

export class NotificationsService {
  // Listar notificações do usuário
  async getNotifications(userId: string, onlyUnread: boolean = false) {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(onlyUnread && { read: false }),
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    })

    return notifications.map((n) => ({
      id: n.id,
      userId: n.userId,
      title: n.title,
      message: n.message,
      type: n.type,
      timestamp: n.timestamp.toISOString(),
      read: n.read,
      actionUrl: n.actionUrl,
    }))
  }

  // Marcar notificação como lida
  async markAsRead(notificationId: string, userId: string) {
    // Verificar se a notificação pertence ao usuário
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification) {
      throw new Error('Notificação não encontrada')
    }

    if (notification.userId !== userId) {
      throw new Error('Acesso negado')
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    return {
      id: updated.id,
      read: updated.read,
    }
  }

  // Marcar todas como lidas
  async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    })

    return {
      count: result.count,
    }
  }

  // Criar notificação (interno)
  async createNotification(data: {
    userId: string
    title: string
    message: string
    type: NotificationType
    actionUrl?: string
  }) {
    const notification = await prisma.notification.create({
      data,
    })

    return {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      timestamp: notification.timestamp.toISOString(),
      read: notification.read,
      actionUrl: notification.actionUrl,
    }
  }

  // Deletar notificação
  async deleteNotification(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification) {
      throw new Error('Notificação não encontrada')
    }

    if (notification.userId !== userId) {
      throw new Error('Acesso negado')
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    })

    return { success: true }
  }

  // Contar notificações não lidas
  async getUnreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    })

    return { count }
  }
}

export const notificationsService = new NotificationsService()
