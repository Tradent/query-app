"use client"

import { useState, useEffect } from "react"
import { Clock, X, Calendar, Trash2, Download, Star, StarOff, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export interface SearchHistoryEntry {
  id: string
  query: string
  timestamp: Date
  resultCount: number
  filters?: string[]
  isFavorite?: boolean
}

interface SearchHistoryProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchHistory({ isOpen, onClose }: SearchHistoryProps) {
  const router = useRouter()
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([])
  const [activeTab, setActiveTab] = useState("all")

  // Group history by date
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayHistory = searchHistory.filter((entry) => entry.timestamp.toDateString() === today.toDateString())

  const yesterdayHistory = searchHistory.filter((entry) => entry.timestamp.toDateString() === yesterday.toDateString())

  const olderHistory = searchHistory.filter(
    (entry) =>
      entry.timestamp.toDateString() !== today.toDateString() &&
      entry.timestamp.toDateString() !== yesterday.toDateString(),
  )

  const favoriteHistory = searchHistory.filter((entry) => entry.isFavorite)

  useEffect(() => {
    // In a real app, we would fetch this from localStorage or an API
    // This is mock data for demonstration
    const mockHistory: SearchHistoryEntry[] = [
      {
        id: "1",
        query: "blockchain validation",
        timestamp: new Date(),
        resultCount: 1245,
        filters: ["Verified Only"],
        isFavorite: true,
      },
      {
        id: "2",
        query: "web3 gaming",
        timestamp: new Date(),
        resultCount: 876,
        filters: ["Past month"],
      },
      {
        id: "3",
        query: "defi protocols",
        timestamp: yesterday,
        resultCount: 1532,
      },
      {
        id: "4",
        query: "nft marketplace",
        timestamp: yesterday,
        resultCount: 943,
        filters: ["Blockchain", "NFTs"],
      },
      {
        id: "5",
        query: "solana ecosystem",
        timestamp: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        resultCount: 654,
        isFavorite: true,
      },
      {
        id: "6",
        query: "crypto trends 2023",
        timestamp: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        resultCount: 1876,
      },
      {
        id: "7",
        query: "dao governance",
        timestamp: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        resultCount: 432,
      },
    ]

    setSearchHistory(mockHistory)
  }, [])

  const handleSearchClick = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
    onClose()
  }

  const toggleFavorite = (id: string) => {
    setSearchHistory((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry)),
    )
  }

  const deleteEntry = (id: string) => {
    setSearchHistory((prev) => prev.filter((entry) => entry.id !== id))
  }

  const clearHistory = () => {
    if (activeTab === "favorites") {
      setSearchHistory((prev) => prev.map((entry) => ({ ...entry, isFavorite: false })))
    } else {
      setSearchHistory([])
    }
  }

  if (!isOpen) return null

  const renderHistoryGroup = (entries: SearchHistoryEntry[], title: string) => {
    if (entries.length === 0) return null

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg border border-orange-100 p-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-sm font-medium text-orange-600 hover:text-orange-700 truncate max-w-[80%] text-left"
                      onClick={() => handleSearchClick(entry.query)}
                    >
                      {entry.query}
                    </button>
                    <Badge variant="outline" className="text-xs">
                      {entry.resultCount} results
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{format(entry.timestamp, "h:mm a")}</span>
                    {entry.filters && entry.filters.length > 0 && (
                      <span className="ml-2">• Filters: {entry.filters.join(", ")}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toggleFavorite(entry.id)}>
                    {entry.isFavorite ? (
                      <Star className="h-4 w-4 text-orange-500" />
                    ) : (
                      <StarOff className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => deleteEntry(entry.id)}>
                    <X className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-orange-100 flex items-center justify-between bg-orange-50">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Search History
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden" onValueChange={setActiveTab}>
          <div className="px-4 pt-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="all">All History</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <TabsContent value="all" className="mt-0">
              {searchHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No search history found</p>
                </div>
              ) : (
                <>
                  {renderHistoryGroup(todayHistory, "Today")}
                  {renderHistoryGroup(yesterdayHistory, "Yesterday")}
                  {renderHistoryGroup(olderHistory, "Earlier")}
                </>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-0">
              {favoriteHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No favorite searches</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {favoriteHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white rounded-lg border border-orange-100 p-3 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <button
                              className="text-sm font-medium text-orange-600 hover:text-orange-700 truncate max-w-[80%] text-left"
                              onClick={() => handleSearchClick(entry.query)}
                            >
                              {entry.query}
                            </button>
                            <Badge variant="outline" className="text-xs">
                              {entry.resultCount} results
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{format(entry.timestamp, "MMM d, yyyy")}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => toggleFavorite(entry.id)}
                          >
                            <Star className="h-4 w-4 text-orange-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <div className="p-4 border-t border-orange-100 flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={clearHistory}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              {activeTab === "favorites" ? "Clear favorites" : "Clear history"}
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              Export
            </Button>
          </div>
          <Button size="sm" className="text-xs" onClick={onClose}>
            Done
          </Button>
        </div>
      </Card>
    </div>
  )
}
