'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Patient {
  id: string
  name: string
  age: number
  bloodType?: string
  conditions?: string[]
  lastVisit?: string
}

interface PatientSummaryCardProps {
  patient: Patient
  showDetails?: boolean
}

export const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
  patient,
  showDetails = true,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{patient.name}</h4>
              <p className="text-sm text-gray-600">
                {patient.age} anos
                {patient.bloodType && ` • Tipo Sanguíneo: ${patient.bloodType}`}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
              {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </div>

          {showDetails && patient.conditions && patient.conditions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Condições:</p>
              <div className="flex flex-wrap gap-2">
                {patient.conditions.map((condition, index) => (
                  <Badge key={index} variant="info">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {patient.lastVisit && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Última consulta: <span className="font-medium">{patient.lastVisit}</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
