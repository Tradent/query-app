"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { SearchResults } from "@/components/search-results"
import { Send, Sparkles, Mic, ImageIcon, Paperclip } from "lucide-react"
import { VoiceSearchButton } from "@/components/voice-search-button"
import { VoiceSearchModal } from "@/components/voice-search-modal"

type Message = {
  id: string
  type: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  searchResults?: SearchResult[]
  suggestedQueries?: string[]
  isBlockchainVerified?: boolean
}

type SearchResult = {
  id: string
  title: string
  description: string
  url: string
  validationStatus: "validated" | "pending" | "disputed"
  confidence: number
  isSaved?: boolean
  blockchainData?: {
    validations: number
    lastVerified: string
    consensusScore: number
  }
}

type SearchFilter = {
  id: string
  name: string
  active: boolean
}

interface ChatSearchInterfaceProps {
  initialQuery: string
}

export function ChatSearchInterface({ initialQuery }: ChatSearchInterfaceProps) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [inputValue, setInputValue] = useState(initialQuery)
  const [isSearching, setIsSearching] = useState(false)
  const [savedResults, setSavedResults] = useState<string[]>([])
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>([
    { id: "recent", name: "Recent", active: true },
    { id: "verified", name: "Blockchain Verified", active: false },
    { id: "defi", name: "DeFi", active: false },
    { id: "nft", name: "NFTs", active: false },
    { id: "web3", name: "Web3", active: false },
  ])
  const [showFilters, setShowFilters] = useState(false)
  const [searchMode, setSearchMode] = useState<"chat" | "traditional">("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [input, setInput] = useState("")
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)

  // Initialize with the initial query if provided
  useEffect(() => {
    if (initialQuery) {
      setMessages([
        { role: "user", content: initialQuery },
        { role: "assistant", content: `Here are the search results for "${initialQuery}":` },
      ])
    }
  }, [initialQuery])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSearch = (query: string) => {
    if (!query.trim()) return

    // Add user message
    setMessages([...messages, { role: "user", content: query }])

    // Update URL with search query
    router.push(`/search?q=${encodeURIComponent(query)}`)

    // Simulate assistant response
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: `Here are the search results for "${query}":` }])
    }, 1000)

    setInput("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    handleSearch(input)
  }

  const handleVoiceResult = (transcript: string) => {
    if (transcript.trim()) {
      setInput(transcript)
      // Optional: automatically submit after voice input
      handleSearch(transcript)
    }
  }

  const toggleSaveResult = (resultId: string) => {
    setSavedResults((prev) => {
      if (prev.includes(resultId)) {
        return prev.filter((id) => id !== resultId)
      } else {
        return [...prev, resultId]
      }
    })
  }

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.map((filter) => (filter.id === filterId ? { ...filter, active: !filter.active } : filter)),
    )
  }

  const handleSuggestedQuery = (query: string) => {
    setInputValue(query)
    handleSearch(query)
  }

  const navigateToPage = (url: string) => {
    // In a real app, this would navigate to the page
    // For now, we'll just add a system message
    setMessages((prev) => [
      ...prev,
      {
        id: `system-navigate-${Date.now()}`,
        type: "system",
        content: `Navigating to ${url}...`,
        timestamp: new Date(),
      },
    ])

    // Simulate navigation delay
    setTimeout(() => {
      window.open(url, "_blank")
    }, 500)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-orange-50 rounded-full p-4 inline-flex mb-4">
              <Sparkles className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Start your search journey</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Ask a question or enter a search query to discover blockchain-verified information
            </p>

            {/* Voice search prompt */}
            <Button
              onClick={() => setIsVoiceModalOpen(true)}
              className="bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 flex items-center gap-2 mx-auto"
            >
              <Mic className="h-4 w-4" />
              Try voice search
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className={message.role === "assistant" ? "bg-orange-100 text-orange-600" : "bg-blue-100"}>
                    {message.role === "assistant" ? (
                      <Sparkles className="h-5 w-5" />
                    ) : (
                      <span className="text-blue-600">U</span>
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-blue-50 text-blue-900 border border-blue-100"
                        : "bg-white border border-gray-200 shadow-sm"
                    }`}
                  >
                    {message.role === "assistant" && message.content.startsWith("Here are the search results") ? (
                      <>
                        <p className="mb-4 text-gray-600">{message.content}</p>
                        <SearchResults query={initialQuery || input} />
                      </>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="mt-6 border-t pt-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" className="rounded-full text-gray-500">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="rounded-full text-gray-500">
              <ImageIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or enter a search query..."
              className="pr-10 border-gray-300 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <VoiceSearchButton onResult={handleVoiceResult} />
            </div>
          </div>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>

      {/* Voice search modal */}
      <VoiceSearchModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} onSearch={handleSearch} />
    </div>
  )
}
