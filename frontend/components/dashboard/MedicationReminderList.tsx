'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface MedicationReminder {
  id: string
  medicationName: string
  dosage: string
  time: string
  frequency: string
  taken?: boolean
  nextDose?: string
}

interface MedicationReminderListProps {
  reminders: MedicationReminder[]
  onMarkAsTaken?: (reminderId: string) => void
}

export const MedicationReminderList: React.FC<MedicationReminderListProps> = ({
  reminders,
  onMarkAsTaken,
}) => {
  const formatTime = (time: string) => {
    try {
      const date = new Date(time)
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return time
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Próximos Medicamentos</CardTitle>
          <Badge variant="info">{reminders.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">💊</p>
            <p>Nenhum medicamento agendado para hoje</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${
                    reminder.taken
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-primary-300'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {reminder.medicationName}
                      </h4>
                      {reminder.taken && (
                        <Badge variant="success">✓ Tomado</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {reminder.dosage} • {reminder.frequency}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-primary-600 font-medium">
                        ⏰ {formatTime(reminder.time)}
                      </span>
                      {reminder.nextDose && (
                        <span className="text-gray-500">
                          • Próxima dose: {formatTime(reminder.nextDose)}
                        </span>
                      )}
                    </div>
                  </div>
                  {!reminder.taken && onMarkAsTaken && (
                    <button
                      onClick={() => onMarkAsTaken(reminder.id)}
                      className="ml-4 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Marcar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
