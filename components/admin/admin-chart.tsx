"use client"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface ChartData {
  name: string
  data: number[]
}

interface AdminChartProps {
  type: "line" | "bar" | "area" | "pie"
  data: ChartData[]
  categories: string[]
  height?: number
  stacked?: boolean
}

export function AdminChart({ type, data, categories, height = 300, stacked = false }: AdminChartProps) {
  // Transform data for recharts
  const chartData = categories.map((category, index) => {
    const dataPoint: Record<string, any> = { name: category }
    data.forEach((series) => {
      dataPoint[series.name] = series.data[index]
    })
    return dataPoint
  })

  // Generate config for ChartContainer
  const config: Record<string, any> = {}
  data.forEach((series, index) => {
    config[series.name] = {
      label: series.name,
      color: `hsl(var(--chart-${index + 1}))`,
    }
  })

  return (
    <ChartContainer config={config} className="h-[--chart-height]" style={{ "--chart-height": `${height}px` } as any}>
      <ResponsiveContainer width="100%" height="100%">
        {type === "line" && (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {data.map((series, index) => (
              <Line
                key={series.name}
                type="monotone"
                dataKey={series.name}
                stroke={`var(--color-${series.name.toLowerCase().replace(/\s+/g, "-")})`}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        )}

        {type === "bar" && (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {data.map((series, index) => (
              <Bar
                key={series.name}
                dataKey={series.name}
                fill={`var(--color-${series.name.toLowerCase().replace(/\s+/g, "-")})`}
                stackId={stacked ? "stack" : undefined}
              />
            ))}
          </BarChart>
        )}

        {type === "area" && (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {data.map((series, index) => (
              <Area
                key={series.name}
                type="monotone"
                dataKey={series.name}
                fill={`var(--color-${series.name.toLowerCase().replace(/\s+/g, "-")})`}
                stroke={`var(--color-${series.name.toLowerCase().replace(/\s+/g, "-")})`}
                stackId={stacked ? "stack" : undefined}
              />
            ))}
          </AreaChart>
        )}

        {type === "pie" && (
          <PieChart>
            <Pie
              data={data.map((item, index) => ({
                name: item.name,
                value: item.data.reduce((a, b) => a + b, 0),
              }))}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`var(--color-${entry.name.toLowerCase().replace(/\s+/g, "-")})`} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  )
}
