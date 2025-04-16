"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface OverviewProps {
  data: {
    [day: string]: {
      orders: number
      sales: number
      items: number,
      average_order: number,
      day_number: number
    }
  }
}

export function Overview({ data = {} }: OverviewProps) {
  // Transform daily_sales data into chart format, sorted by day_number
  const transformedData = Object.entries(data)
    .map(([day, values]) => ({
      // name: day, // Take first 3 letters of day name (e.g. "Sen" for Senin)
      name: day.split("-")[2],
      total: values.sales,
      day_number: values.day_number
    }))
    .sort((a, b) => a.day_number - b.day_number) // Sort by day number

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={transformedData}>
        <XAxis 
          dataKey="name" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}k`}
        />
        <Bar 
          dataKey="total" 
          fill="currentColor" 
          radius={[4, 4, 0, 0]} 
          className="fill-primary" 
        />
      </BarChart>
    </ResponsiveContainer>
  )
}