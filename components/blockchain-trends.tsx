"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

// Mock data - would be replaced with actual Solana blockchain data
const mockTrendData = [
  { date: "Jan", value: 400 },
  { date: "Feb", value: 300 },
  { date: "Mar", value: 600 },
  { date: "Apr", value: 800 },
  { date: "May", value: 500 },
  { date: "Jun", value: 900 },
  { date: "Jul", value: 1200 },
]

export default function BlockchainTrends() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockTrendData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
