"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Filter,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample moderation items
const moderationItems = [
  {
    id: "m_1",
    type: "image",
    title: "blockchain-visualization.png",
    thumbnail: "/blockchain-visualization.png",
    reportReason: "Potential manipulation",
    reportedBy: "Alex Johnson",
    reportedAt: "2 hours ago",
    status: "pending",
    priority: "high",
    flags: 3,
  },
  {
    id: "m_2",
    type: "image",
    title: "crypto-trading-chart.png",
    thumbnail: "/crypto-trading-chart.png",
    reportReason: "Misleading content",
    reportedBy: "Sarah Miller",
    reportedAt: "5 hours ago",
    status: "pending",
    priority: "medium",
    flags: 2,
  },
  {
    id: "m_3",
    type: "image",
    title: "nft-marketplace-concept.png",
    thumbnail: "/nft-marketplace-concept.png",
    reportReason: "Copyright violation",
    reportedBy: "David Chen",
    reportedAt: "1 day ago",
    status: "pending",
    priority: "low",
    flags: 1,
  },
  {
    id: "m_4",
    type: "image",
    title: "web3-gaming.png",
    thumbnail: "/web3-gaming.png",
    reportReason: "AI-generated content",
    reportedBy: "Emma Wilson",
    reportedAt: "2 days ago",
    status: "pending",
    priority: "medium",
    flags: 2,
  },
  {
    id: "m_5",
    type: "image",
    title: "blockchain-conference.png",
    thumbnail: "/blockchain-conference.png",
    reportReason: "Manipulated image",
    reportedBy: "Michael Brown",
    reportedAt: "3 days ago",
    status: "pending",
    priority: "high",
    flags: 4,
  },
]

export function AdminModerationQueue() {
  const [activeTab, setActiveTab] = useState("pending")
  const [items, setItems] = useState(moderationItems)

  const filteredItems = items.filter((item) => activeTab === "all" || item.status === activeTab)

  const handleApprove = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, status: "approved" } : item)))
  }

  const handleReject = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, status: "rejected" } : item)))
  }

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Moderation Queue</CardTitle>
            <CardDescription>Review and moderate flagged content</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="mr-2 h-4 w-4" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Approve All</DropdownMenuItem>
                <DropdownMenuItem>Reject All</DropdownMenuItem>
                <DropdownMenuItem>Export Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary" className="ml-2">
                {items.filter((item) => item.status === "pending").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved
              <Badge variant="secondary" className="ml-2">
                {items.filter((item) => item.status === "approved").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
              <Badge variant="secondary" className="ml-2">
                {items.filter((item) => item.status === "rejected").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredItems.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">No {activeTab} items to display</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative aspect-video w-full overflow-hidden">
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Badge
                          variant={
                            item.priority === "high"
                              ? "destructive"
                              : item.priority === "medium"
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {item.priority}
                        </Badge>
                        <Badge variant="secondary">
                          <Flag className="mr-1 h-3 w-3" />
                          {item.flags}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="p-3">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="text-xs">
                        Reported {item.reportedAt} by {item.reportedBy}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Reason: </span>
                          {item.reportReason}
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant={
                              item.status === "approved"
                                ? "default"
                                : item.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {item.status === "approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                            {item.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                            {item.status === "pending" && <AlertTriangle className="mr-1 h-3 w-3" />}
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-3 pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      {item.status === "pending" && (
                        <>
                          <Button variant="default" size="sm" className="w-full" onClick={() => handleApprove(item.id)}>
                            <ThumbsUp className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => handleReject(item.id)}
                          >
                            <ThumbsDown className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
