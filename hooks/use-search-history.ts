"use client"

import { useState, useEffect } from "react"

export interface SearchHistoryEntry {
  id: string
  query: string
  timestamp: Date
  resultCount: number
  filters?: string[]
  isFavorite?: boolean
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryEntry[]>([])

  useEffect(() => {
    // Load history from localStorage in a real app
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem("searchHistory")
        if (savedHistory) {
          // Parse and convert string dates back to Date objects
          const parsed = JSON.parse(savedHistory, (key, value) => {
            if (key === "timestamp") return new Date(value)
            return value
          })
          setHistory(parsed)
        }
      } catch (error) {
        console.error("Failed to load search history:", error)
        // Use mock data as fallback
        setHistory(getMockHistory())
      }
    }

    loadHistory()
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      try {
        localStorage.setItem("searchHistory", JSON.stringify(history))
      } catch (error) {
        console.error("Failed to save search history:", error)
      }
    }
  }, [history])

  const addSearch = (query: string, resultCount: number, filters?: string[]) => {
    const newEntry: SearchHistoryEntry = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      resultCount,
      filters,
      isFavorite: false,
    }

    setHistory((prev) => {
      // Remove duplicate queries (keep only the most recent)
      const filtered = prev.filter((entry) => entry.query !== query)
      // Add new entry at the beginning
      return [newEntry, ...filtered]
    })
  }

  const toggleFavorite = (id: string) => {
    setHistory((prev) => prev.map((entry) => (entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry)))
  }

  const removeEntry = (id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id))
  }

  const clearHistory = () => {
    setHistory([])
  }

  const clearFavorites = () => {
    setHistory((prev) => prev.map((entry) => ({ ...entry, isFavorite: false })))
  }

  return {
    history,
    addSearch,
    toggleFavorite,
    removeEntry,
    clearHistory,
    clearFavorites,
  }
}

// Mock data for initial testing
function getMockHistory(): SearchHistoryEntry[] {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  return [
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
  ]
}
