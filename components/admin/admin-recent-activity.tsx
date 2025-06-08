import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const recentActivities = [
  {
    id: 1,
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder-xhswx.png",
      initials: "AJ",
    },
    action: "verified an image",
    target: "blockchain-visualization.png",
    time: "2 minutes ago",
    status: "success",
  },
  {
    id: 2,
    user: {
      name: "Sarah Miller",
      avatar: "/placeholder-moqss.png",
      initials: "SM",
    },
    action: "reported a suspicious image",
    target: "crypto-trading-chart.png",
    time: "15 minutes ago",
    status: "warning",
  },
  {
    id: 3,
    user: {
      name: "David Chen",
      avatar: "/placeholder-rabmd.png",
      initials: "DC",
    },
    action: "joined the validation network",
    target: "",
    time: "1 hour ago",
    status: "info",
  },
  {
    id: 4,
    user: {
      name: "Emma Wilson",
      avatar: "/placeholder-jrb9s.png",
      initials: "EW",
    },
    action: "submitted a batch verification",
    target: "25 images",
    time: "3 hours ago",
    status: "success",
  },
  {
    id: 5,
    user: {
      name: "Michael Brown",
      avatar: "/placeholder-tihl4.png",
      initials: "MB",
    },
    action: "flagged an image as manipulated",
    target: "nft-marketplace-concept.png",
    time: "5 hours ago",
    status: "error",
  },
]

export function AdminRecentActivity() {
  return (
    <div className="space-y-4">
      {recentActivities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{activity.user.name}</p>
              <Badge
                variant={
                  activity.status === "success"
                    ? "default"
                    : activity.status === "warning"
                      ? "warning"
                      : activity.status === "error"
                        ? "destructive"
                        : "secondary"
                }
                className="text-[10px] px-1 py-0"
              >
                {activity.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {activity.action}
              {activity.target && <span className="font-medium text-foreground"> {activity.target}</span>}
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
