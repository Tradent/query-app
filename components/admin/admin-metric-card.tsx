import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"

interface AdminMetricCardProps {
  title: string
  value: string
  description?: string
  trend?: "up" | "down" | "neutral"
  percentage?: number
}

export function AdminMetricCard({ title, value, description, trend = "neutral", percentage }: AdminMetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <div className="flex items-center space-x-2">
            <p className="text-xs text-muted-foreground">{description}</p>
            {trend !== "neutral" && percentage !== undefined && (
              <div className={`flex items-center text-xs ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {trend === "up" ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                <span>{percentage}%</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
