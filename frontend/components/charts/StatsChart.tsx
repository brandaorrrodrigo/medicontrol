'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface StatsData {
  name: string
  value: number
  color?: string
}

interface StatsChartProps {
  data: StatsData[]
  title: string
  colors?: string[]
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
]

export const StatsChart: React.FC<StatsChartProps> = ({
  data,
  title,
  colors = DEFAULT_COLORS,
}) => {
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || colors[index % colors.length],
  }))

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-full lg:w-1/2">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataWithColors}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {dataWithColors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full lg:w-1/2 space-y-3">
          {dataWithColors.map((item, index) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0'
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  <p className="text-xs text-gray-500">{percentage}%</p>
                </div>
              </div>
            )
          })}

          {total > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-sm font-bold text-gray-900">{total}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
