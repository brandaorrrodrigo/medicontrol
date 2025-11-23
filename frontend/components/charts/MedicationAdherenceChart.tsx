'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AdherenceData {
  name: string
  tomados: number
  perdidos: number
  total: number
}

interface MedicationAdherenceChartProps {
  data: AdherenceData[]
  title?: string
}

export const MedicationAdherenceChart: React.FC<MedicationAdherenceChartProps> = ({
  data,
  title = 'Adesão aos Medicamentos',
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            labelStyle={{ fontWeight: 600, color: '#111827' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Bar
            dataKey="tomados"
            fill="#10b981"
            name="Tomados"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="perdidos"
            fill="#ef4444"
            name="Perdidos"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Adherence Summary */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {data.map((item, index) => {
          const adherenceRate = item.total > 0 ? ((item.tomados / item.total) * 100).toFixed(1) : '0.0'
          return (
            <div key={index} className="text-center">
              <p className="text-sm text-gray-600 mb-1">{item.name}</p>
              <p className={`text-2xl font-bold ${
                parseFloat(adherenceRate) >= 80 ? 'text-green-600' :
                parseFloat(adherenceRate) >= 50 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {adherenceRate}%
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
