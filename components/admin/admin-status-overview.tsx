import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const systemServices = [
  {
    name: "Search Engine",
    status: "operational",
    load: 42,
    uptime: "99.98%",
  },
  {
    name: "Image Verification",
    status: "operational",
    load: 67,
    uptime: "99.95%",
  },
  {
    name: "Blockchain Validation",
    status: "operational",
    load: 28,
    uptime: "99.99%",
  },
  {
    name: "AI Analysis",
    status: "degraded",
    load: 89,
    uptime: "98.75%",
  },
  {
    name: "Database",
    status: "operational",
    load: 51,
    uptime: "99.97%",
  },
  {
    name: "API Gateway",
    status: "operational",
    load: 35,
    uptime: "99.99%",
  },
]

export function AdminStatusOverview() {
  return (
    <div className="space-y-4">
      {systemServices.map((service) => (
        <div key={service.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{service.name}</span>
              <Badge
                variant={
                  service.status === "operational"
                    ? "default"
                    : service.status === "degraded"
                      ? "warning"
                      : "destructive"
                }
                className="text-[10px] px-1 py-0"
              >
                {service.status}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">{service.uptime} uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={service.load} className="h-2" />
            <span className="text-xs text-muted-foreground w-8">{service.load}%</span>
          </div>
        </div>
      ))}
    </div>
  )
}
