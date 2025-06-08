"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Bookmark,
  Shield,
  ArrowUpRight,
  ChevronRight,
  Wallet,
  Settings,
  User,
  FileText,
  ImageIcon,
  LinkIcon,
  Star,
  Filter,
  Download,
  Share2,
} from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardSkeleton } from "./dashboard-skeleton"

// Mock data for the dashboard
const mockSearchHistory = [
  {
    id: "search1",
    query: "Solana smart contracts",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    results: 42,
    saved: true,
  },
  {
    id: "search2",
    query: "Blockchain verification process",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    results: 28,
    saved: false,
  },
  {
    id: "search3",
    query: "NFT marketplace development",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    results: 56,
    saved: true,
  },
  {
    id: "search4",
    query: "Web3 authentication methods",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    results: 19,
    saved: false,
  },
]

const mockSavedItems = [
  {
    id: "saved1",
    title: "Building Scalable DApps on Solana",
    url: "/search?q=solana+dapps",
    type: "article",
    savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    verified: true,
    verificationScore: 92,
  },
  {
    id: "saved2",
    title: "Blockchain Verification: A Technical Deep Dive",
    url: "/search?q=blockchain+verification",
    type: "document",
    savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    verified: true,
    verificationScore: 98,
  },
  {
    id: "saved3",
    title: "NFT Marketplace Architecture",
    url: "/search?q=nft+marketplace",
    type: "image",
    savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    verified: true,
    verificationScore: 87,
  },
  {
    id: "saved4",
    title: "Web3 Authentication Best Practices",
    url: "/search?q=web3+authentication",
    type: "link",
    savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    verified: false,
    verificationScore: 0,
  },
]

const mockValidations = [
  {
    id: "val1",
    title: "Solana Smart Contract Audit",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    status: "Verified",
    consensusScore: 98,
    validators: 42,
  },
  {
    id: "val2",
    title: "NFT Ownership Verification",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    status: "Verified",
    consensusScore: 95,
    validators: 38,
  },
  {
    id: "val3",
    title: "DeFi Protocol Security Check",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    status: "Pending",
    consensusScore: 67,
    validators: 24,
  },
  {
    id: "val4",
    title: "DAO Governance Proposal",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    status: "Rejected",
    consensusScore: 42,
    validators: 31,
  },
]

// Helper function to format dates
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
  } else {
    return "Just now"
  }
}

// Helper function to get icon for saved item type
function getSavedItemIcon(type: string) {
  switch (type) {
    case "article":
      return <FileText className="h-4 w-4" />
    case "image":
      return <ImageIcon className="h-4 w-4" />
    case "link":
      return <LinkIcon className="h-4 w-4" />
    case "document":
      return <FileText className="h-4 w-4" />
    default:
      return <Star className="h-4 w-4" />
  }
}

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status) {
    case "Verified":
      return "bg-green-100 text-green-800"
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    case "Rejected":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function DashboardClient() {
  const { isAuthenticated, user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/signin?redirect=/dashboard")
    }
  }, [isAuthenticated, loading, router])

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.publicKey) {
      return `${user.publicKey.toString().slice(0, 2)}`
    }
    return "U"
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!isAuthenticated) {
    return null // Will redirect in the useEffect
  }

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="validations">Validations</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* User Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Avatar className="h-16 w-16 border">
                <AvatarFallback className="bg-orange-100 text-orange-800 text-xl">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">
                    {user?.publicKey?.toString().slice(0, 6)}...{user?.publicKey?.toString().slice(-4)}
                  </h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                    Verified User
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Member since {new Date().toLocaleDateString()}</p>
                <div className="flex gap-2 mt-2">
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="h-8">
                      <User className="mr-1 h-3.5 w-3.5" />
                      Profile
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="outline" size="sm" className="h-8">
                      <Settings className="mr-1 h-3.5 w-3.5" />
                      Settings
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="h-8">
                    <Wallet className="mr-1 h-3.5 w-3.5" />
                    Wallet
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
                <Bookmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">16</div>
                <p className="text-xs text-muted-foreground">+22.4% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blockchain Validations</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+8.2% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Search Activity</CardTitle>
              <CardDescription>Your search activity over the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                Activity Chart
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Recent Searches</CardTitle>
                  <CardDescription>Your most recent search queries.</CardDescription>
                </div>
                <Link href="#activity">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSearchHistory.slice(0, 3).map((search) => (
                    <div key={search.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
                          <Search className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <Link href={`/search?q=${encodeURIComponent(search.query)}`}>
                            <p className="text-sm font-medium leading-none hover:underline">{search.query}</p>
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(search.timestamp)} • {search.results} results
                          </p>
                        </div>
                      </div>
                      {search.saved && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                          Saved
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="#activity">View All Searches</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="col-span-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Recent Validations</CardTitle>
                  <CardDescription>Your most recent blockchain validations.</CardDescription>
                </div>
                <Link href="#validations">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockValidations.slice(0, 3).map((validation) => (
                    <div key={validation.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
                          <Shield className="h-4 w-4 text-green-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">{validation.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(validation.timestamp)} • {validation.validators} validators
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(validation.status)} hover:${getStatusColor(validation.status)}`}
                      >
                        {validation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="#validations">View All Validations</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Search History</CardTitle>
                  <CardDescription>Your recent search activity.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-1 h-3.5 w-3.5" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-3.5 w-3.5" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockSearchHistory.map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                        <Search className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <Link href={`/search?q=${encodeURIComponent(search.query)}`}>
                          <p className="text-base font-medium leading-none hover:underline">{search.query}</p>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">{formatDate(search.timestamp)}</p>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-sm text-muted-foreground">{search.results} results</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {search.saved ? (
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <Bookmark className="h-3.5 w-3.5 fill-current" />
                          Saved
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <Bookmark className="h-3.5 w-3.5" />
                          Save
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
                        <Link href={`/search?q=${encodeURIComponent(search.query)}`}>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          Open
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline">Next</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Saved Items</CardTitle>
                  <CardDescription>Items you've saved for later.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-1 h-3.5 w-3.5" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-1 h-3.5 w-3.5" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockSavedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                        {getSavedItemIcon(item.type)}
                      </div>
                      <div>
                        <Link href={item.url}>
                          <p className="text-base font-medium leading-none hover:underline">{item.title}</p>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                            {item.type}
                          </Badge>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-sm text-muted-foreground">Saved {formatDate(item.savedAt)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.verified ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                          {item.verificationScore}% Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">
                          Not Verified
                        </Badge>
                      )}
                      <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
                        <Link href={item.url}>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          Open
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline">Next</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="validations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Blockchain Validations</CardTitle>
                  <CardDescription>Your blockchain validation activity.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-1 h-3.5 w-3.5" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-3.5 w-3.5" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockValidations.map((validation) => (
                  <div
                    key={validation.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                        <Shield className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <p className="text-base font-medium leading-none">{validation.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">{formatDate(validation.timestamp)}</p>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-sm text-muted-foreground">{validation.validators} validators</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(validation.status)} hover:${getStatusColor(validation.status)}`}
                      >
                        {validation.status}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        {validation.consensusScore}% Consensus
                      </Badge>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline">Next</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </div>
    </ProtectedRoute>
  )
}
