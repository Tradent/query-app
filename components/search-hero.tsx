"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Mic, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SearchHero() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-orange-500">Q</span>
          <span className="text-orange-500">u</span>
          <span className="text-orange-500">e</span>
          <span className="text-orange-500">r</span>
          <span className="text-orange-500">y</span>
          <span className="text-orange-500">-</span>
          <span className="text-orange-500">C</span>
          <span className="text-orange-500">h</span>
          <span className="text-orange-500">a</span>
          <span className="text-orange-500">t</span>
        </h1>
        <p className="text-xl text-gray-600">Blockchain-powered search with chat interface</p>
      </div>

      <div className="w-full max-w-2xl">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center border-2 border-gray-200 rounded-full px-6 py-3 shadow-sm hover:shadow focus-within:shadow-md focus-within:border-orange-300 transition-all">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <Input
              type="text"
              placeholder="Search or ask anything..."
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Button type="button" size="icon" variant="ghost" className="rounded-full">
                <Mic className="h-5 w-5 text-gray-400" />
                <span className="sr-only">Voice search</span>
              </Button>
              <Button type="button" size="icon" variant="ghost" className="rounded-full">
                <Camera className="h-5 w-5 text-gray-400" />
                <span className="sr-only">Image search</span>
              </Button>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6">
              Search
            </Button>
            <Button type="button" variant="outline" className="ml-4">
              I'm Feeling Lucky
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
