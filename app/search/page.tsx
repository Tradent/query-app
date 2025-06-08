"use client"

import { Suspense, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ChatSearchInterface } from "@/components/chat-search-interface"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Filter,
  SlidersHorizontal,
  Clock,
  TrendingUp,
  X,
  Bookmark,
  Plus,
  FileText,
  BookOpen,
  Settings2,
  Globe,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchFilters } from "@/components/search-filters"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { SearchHistory } from "@/components/search-history"

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; filter?: string; sort?: string }
}) {
  const query = searchParams.q || ""
  const filter = searchParams.filter || "all"
  const sort = searchParams.sort || "relevance"
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-grow flex flex-col h-[calc(100vh-4.5rem)]">
        {/* Search History Modal */}
        <SearchHistory isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

        {/* Search Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Sidebar */}
          <div className="lg:col-span-1 h-[calc(100vh-6rem)]">
            <div className="h-full overflow-y-auto pr-2 pb-6 -mr-2">
              <Card className="overflow-hidden border-orange-100 shadow-sm">
                <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-4">
                  <h2 className="text-white font-medium flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Search Options
                  </h2>
                </div>
                <div className="p-4 space-y-6">
                  {/* Search Type */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-gray-700">Search Type</h3>
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="grid grid-cols-2 h-auto p-1 bg-orange-50">
                        <TabsTrigger value="all" className="text-xs py-1.5">
                          All Results
                        </TabsTrigger>
                        <TabsTrigger value="verified" className="text-xs py-1.5">
                          Verified Only
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-gray-700 flex items-center gap-2">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Sort By
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        variant={sort === "relevance" ? "secondary" : "outline"}
                        size="sm"
                        className="justify-start text-xs h-8"
                      >
                        <TrendingUp className="h-3.5 w-3.5 mr-2" />
                        Relevance
                      </Button>
                      <Button
                        variant={sort === "date" ? "secondary" : "outline"}
                        size="sm"
                        className="justify-start text-xs h-8"
                      >
                        <Clock className="h-3.5 w-3.5 mr-2" />
                        Most Recent
                      </Button>
                      <Button
                        variant={sort === "validation" ? "secondary" : "outline"}
                        size="sm"
                        className="justify-start text-xs h-8"
                      >
                        <Shield className="h-3.5 w-3.5 mr-2" />
                        Validation Score
                      </Button>
                    </div>
                  </div>

                  {/* Search History Button */}
                  <Button
                    variant="secondary"
                    className="w-full text-sm flex items-center justify-center gap-2"
                    onClick={() => setIsHistoryOpen(true)}
                  >
                    <History className="h-4 w-4" />
                    View Search History
                  </Button>

                  {/* Quick Filters */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-gray-700">Quick Filters</h3>
                    <div className="space-y-2">
                      {["Blockchain", "DeFi", "NFTs", "Web3", "DAOs"].map((filter) => (
                        <div key={filter} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`filter-${filter}`}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <label htmlFor={`filter-${filter}`} className="ml-2 text-sm text-gray-700">
                            {filter}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Period */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-gray-700">Time Period</h3>
                    <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm">
                      <option>Any time</option>
                      <option>Past 24 hours</option>
                      <option>Past week</option>
                      <option>Past month</option>
                      <option>Past year</option>
                    </select>
                  </div>

                  {/* Advanced Filters Button */}
                  <Button variant="outline" className="w-full text-sm">
                    Advanced Filters
                  </Button>
                </div>
              </Card>

              {/* Search Stats */}
              <Card className="mt-4 p-4 border-orange-100 shadow-sm">
                <h3 className="text-sm font-medium mb-2 text-gray-700">Search Statistics</h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Results found:</span>
                    <span className="font-medium">1,245</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verified results:</span>
                    <span className="font-medium">876 (70%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Search time:</span>
                    <span className="font-medium">0.42 seconds</span>
                  </div>
                </div>
              </Card>

              {/* Recent Searches */}
              <Card className="mt-4 p-4 border-orange-100 shadow-sm">
                <h3 className="text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {["blockchain validation", "web3 gaming", "defi protocols", "nft marketplace"].map((term) => (
                    <div key={term} className="flex items-center justify-between group">
                      <button className="text-xs text-gray-600 hover:text-orange-600 truncate max-w-[80%] text-left">
                        {term}
                      </button>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs text-orange-600 mt-2 px-0"
                  onClick={() => setIsHistoryOpen(true)}
                >
                  View all history
                </Button>
              </Card>

              {/* Saved Searches */}
              <Card className="mt-4 p-4 border-orange-100 shadow-sm">
                <h3 className="text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                  <Bookmark className="h-3.5 w-3.5" />
                  Saved Searches
                </h3>
                <div className="space-y-2">
                  {["crypto trends 2023", "solana ecosystem"].map((term) => (
                    <div key={term} className="flex items-center justify-between group">
                      <button className="text-xs text-gray-600 hover:text-orange-600 truncate max-w-[80%] text-left">
                        {term}
                      </button>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center">
                  <Input placeholder="Save current search..." className="text-xs h-7 py-1" />
                  <Button size="sm" variant="ghost" className="h-7 px-2 ml-1">
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>

              {/* Content Type */}
              <Card className="mt-4 p-4 border-orange-100 shadow-sm">
                <h3 className="text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" />
                  Content Type
                </h3>
                <div className="space-y-2">
                  {[
                    { id: "articles", label: "Articles", count: 423 },
                    { id: "research", label: "Research Papers", count: 156 },
                    { id: "news", label: "News", count: 289 },
                    { id: "discussions", label: "Discussions", count: 178 },
                    { id: "code", label: "Code Repositories", count: 94 },
                  ].map((type) => (
                    <div key={type.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`type-${type.id}`}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <label htmlFor={`type-${type.id}`} className="ml-2 text-xs text-gray-700">
                          {type.label}
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">{type.count}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Reading Level */}
              <Card className="mt-4 p-4 border-orange-100 shadow-sm">
                <h3 className="text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5" />
                  Reading Level
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="level-all"
                      name="reading-level"
                      className="text-orange-600 focus:ring-orange-500"
                      defaultChecked
                    />
                    <label htmlFor="level-all" className="ml-2 text-xs text-gray-700">
                      All Levels
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="level-beginner"
                      name="reading-level"
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="level-beginner" className="ml-2 text-xs text-gray-700">
                      Beginner Friendly
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="level-intermediate"
                      name="reading-level"
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="level-intermediate" className="ml-2 text-xs text-gray-700">
                      Intermediate
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="level-advanced"
                      name="reading-level"
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="level-advanced" className="ml-2 text-xs text-gray-700">
                      Advanced/Technical
                    </label>
                  </div>
                </div>
              </Card>

              {/* Visual Preferences */}
              <Card className="mt-4 p-4 border-orange-100 shadow-sm">
                <h3 className="text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  Display Settings
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700">Dark Mode</span>
                    <Switch id="dark-mode" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700">Compact View</span>
                    <Switch id="compact-view" />
                  </div>
                  <div>
                    <label htmlFor="results-per-page" className="block text-xs text-gray-700 mb-1">
                      Results per page
                    </label>
                    <select
                      id="results-per-page"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-xs"
                    >
                      <option>10</option>
                      <option>20</option>
                      <option>50</option>
                      <option>100</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Language Options */}
              <Card className="mt-4 p-4 border-orange-100 shadow-sm mb-6">
                <h3 className="text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" />
                  Language & Region
                </h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="search-language" className="block text-xs text-gray-700 mb-1">
                      Search Language
                    </label>
                    <select
                      id="search-language"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-xs"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Chinese</option>
                      <option>Japanese</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="search-region" className="block text-xs text-gray-700 mb-1">
                      Region
                    </label>
                    <select
                      id="search-region"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-xs"
                    >
                      <option>Global</option>
                      <option>United States</option>
                      <option>European Union</option>
                      <option>Asia Pacific</option>
                      <option>Latin America</option>
                      <option>Africa</option>
                    </select>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 flex flex-col h-[calc(100vh-6rem)] overflow-hidden">
            {/* Optional Filters Bar */}
            <SearchFilters query={query} />

            {/* Search Results */}
            <Card className="border-orange-100 shadow-sm overflow-hidden flex-grow flex flex-col">
              <div className="p-1 bg-gradient-to-r from-orange-500 to-orange-400"></div>
              <div className="p-6 flex-grow overflow-y-auto">
                <Suspense fallback={<SearchSkeleton />}>
                  <ChatSearchInterface initialQuery={query} />
                </Suspense>
              </div>
            </Card>

            {/* Related Searches and Trust Indicator in a scrollable container */}
            <div className="mt-4 overflow-y-auto pb-4">
              {/* Related Searches */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-3 text-gray-700">Related Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "blockchain validation",
                    "decentralized search",
                    "web3 search engine",
                    "p2p validation",
                    "blockchain verification",
                    "trusted search results",
                  ].map((term) => (
                    <Badge
                      key={term}
                      variant="outline"
                      className="bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Trust Indicator */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Blockchain Verified Results</h3>
                    <p className="text-sm text-gray-600">
                      All search results are verified by our decentralized network of validators.{" "}
                      <a href="#" className="text-orange-600 hover:underline">
                        Learn more
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function SearchSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  )
}
