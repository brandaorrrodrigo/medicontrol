'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Exam {
  id: string
  name: string
  type: string
  date: string
  status: 'scheduled' | 'completed' | 'pending_results'
  result?: string
  doctor?: string
}

interface ExamsCardProps {
  exams: Exam[]
  onViewDetails?: (examId: string) => void
}

const statusConfig = {
  scheduled: { label: 'Agendado', variant: 'info' as const },
  completed: { label: 'Realizado', variant: 'success' as const },
  pending_results: { label: 'Aguardando Resultado', variant: 'warning' as const },
}

export const ExamsCard: React.FC<ExamsCardProps> = ({ exams, onViewDetails }) => {
  const formatDate = (date: string) => {
    try {
      const d = new Date(date)
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return date
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Exames Recentes</CardTitle>
          <Badge variant="info">{exams.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {exams.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">🔬</p>
            <p>Nenhum exame registrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exams.map((exam) => {
              const statusInfo = statusConfig[exam.status]
              return (
                <div
                  key={exam.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 transition-all bg-white"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{exam.name}</h4>
                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {exam.type} • {formatDate(exam.date)}
                      </p>
                      {exam.doctor && (
                        <p className="text-sm text-gray-500 mt-1">
                          Dr(a). {exam.doctor}
                        </p>
                      )}
                    </div>
                    {onViewDetails && (
                      <button
                        onClick={() => onViewDetails(exam.id)}
                        className="ml-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Ver detalhes →
                      </button>
                    )}
                  </div>
                  {exam.result && exam.status === 'completed' && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Resultado:</span> {exam.result}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
