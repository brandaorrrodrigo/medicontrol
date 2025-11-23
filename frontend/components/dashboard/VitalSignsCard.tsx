'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface VitalSign {
  type: 'bloodPressure' | 'heartRate' | 'temperature' | 'oxygenSaturation' | 'glucose'
  value: string
  unit: string
  timestamp: string
  status?: 'normal' | 'warning' | 'danger'
}

interface VitalSignsCardProps {
  vitalSigns: VitalSign[]
}

const vitalSignConfig = {
  bloodPressure: { label: 'Pressão Arterial', icon: '🩺' },
  heartRate: { label: 'Frequência Cardíaca', icon: '❤️' },
  temperature: { label: 'Temperatura', icon: '🌡️' },
  oxygenSaturation: { label: 'Saturação O₂', icon: '🫁' },
  glucose: { label: 'Glicemia', icon: '🩸' },
}

const statusVariant = {
  normal: 'success' as const,
  warning: 'warning' as const,
  danger: 'danger' as const,
}

export const VitalSignsCard: React.FC<VitalSignsCardProps> = ({ vitalSigns }) => {
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return timestamp
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sinais Vitais Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {vitalSigns.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">📊</p>
            <p>Nenhum sinal vital registrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vitalSigns.map((vital, index) => {
              const config = vitalSignConfig[vital.type]
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{config.label}</p>
                      <p className="text-sm text-gray-600">
                        {formatTimestamp(vital.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {vital.value} <span className="text-sm text-gray-600">{vital.unit}</span>
                    </p>
                    {vital.status && (
                      <Badge variant={statusVariant[vital.status]} className="mt-1">
                        {vital.status === 'normal' && 'Normal'}
                        {vital.status === 'warning' && 'Atenção'}
                        {vital.status === 'danger' && 'Crítico'}
                      </Badge>
                    )}
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
