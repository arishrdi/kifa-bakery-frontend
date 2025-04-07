"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Sen",
    total: 4000000,
  },
  {
    name: "Sel",
    total: 3500000,
  },
  {
    name: "Rab",
    total: 4200000,
  },
  {
    name: "Kam",
    total: 3800000,
  },
  {
    name: "Jum",
    total: 5100000,
  },
  {
    name: "Sab",
    total: 6200000,
  },
  {
    name: "Min",
    total: 5800000,
  },
]

interface OverviewProps {
  data: {
    name: string
    total: number
  }[]
}

export function Overview({ data }: OverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rp ${value / 1000000}jt`}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

