'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface VitalSignData {
  date: string
  value: number
  unit?: string
}

interface VitalSignsChartProps {
  data: VitalSignData[]
  title: string
  color?: string
  dataKey?: string
  unit?: string
}

export const VitalSignsChart: React.FC<VitalSignsChartProps> = ({
  data,
  title,
  color = '#3b82f6',
  dataKey = 'value',
  unit = '',
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            unit={unit}
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
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
            name={title}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
