'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'danger'
  timestamp: string
  read?: boolean
}

interface NotificationListProps {
  notifications: Notification[]
  onMarkAsRead?: (notificationId: string) => void
  onMarkAllAsRead?: () => void
}

const typeConfig = {
  info: { icon: 'ℹ️', variant: 'info' as const },
  warning: { icon: '⚠️', variant: 'warning' as const },
  success: { icon: '✅', variant: 'success' as const },
  danger: { icon: '🚨', variant: 'danger' as const },
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

      if (diffInMinutes < 1) return 'Agora'
      if (diffInMinutes < 60) return `${diffInMinutes}min atrás`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`

      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return timestamp
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Notificações</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="danger">{unreadCount} nova{unreadCount > 1 ? 's' : ''}</Badge>
            )}
          </div>
          {unreadCount > 0 && onMarkAllAsRead && (
            <button
              onClick={onMarkAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">🔔</p>
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.map((notification) => {
              const config = typeConfig[notification.type]
              return (
                <div
                  key={notification.id}
                  className={`
                    p-4 rounded-lg border transition-all cursor-pointer
                    ${
                      notification.read
                        ? 'bg-white border-gray-200 opacity-70'
                        : 'bg-blue-50 border-blue-200'
                    }
                    hover:shadow-md
                  `}
                  onClick={() => {
                    if (!notification.read && onMarkAsRead) {
                      onMarkAsRead(notification.id)
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{config.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
