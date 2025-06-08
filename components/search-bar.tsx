"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Search, Mic, Camera, X, Settings, Grid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VoiceSearchModal } from "@/components/voice-search-modal"
import { useLanguagePreference } from "@/hooks/use-language-preference"
import { SUPPORTED_LANGUAGES } from "@/hooks/use-speech-recognition"
import { LanguageSelector } from "@/components/language-selector"

export function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const pathname = usePathname()
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const { language, setLanguage } = useLanguagePreference()

  const isImagesPage = pathname === "/images"

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Navigate to the appropriate search page based on current path
      const searchPath = isImagesPage ? "/images" : "/search"
      router.push(`${searchPath}?q=${encodeURIComponent(query)}`)
    }
  }

  const clearSearch = () => {
    setQuery("")
    document.getElementById("search-input")?.focus()
  }

  const handleTabChange = (value: string) => {
    if (value === "images" && !isImagesPage) {
      // Navigate to images search with the current query
      if (query) {
        router.push(`/images?q=${encodeURIComponent(query)}`)
      } else {
        router.push("/images")
      }
    } else if (value === "all" && isImagesPage) {
      // Navigate to regular search with the current query
      if (query) {
        router.push(`/search?q=${encodeURIComponent(query)}`)
      } else {
        router.push("/search")
      }
    }
  }

  const handleVoiceResult = (transcript: string) => {
    if (transcript.trim()) {
      setQuery(transcript)
      // Automatically submit after voice input
      router.push(`/search?q=${encodeURIComponent(transcript)}`)
    }
  }

  // Get current language info
  const currentLanguageInfo = SUPPORTED_LANGUAGES.find((lang) => lang.code === language) || SUPPORTED_LANGUAGES[0]

  return (
    <div className="sticky top-0 bg-white z-10 pb-3 pt-5 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="shrink-0">
            <h1 className="text-2xl font-normal">
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
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
            <div className="relative">
              <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 shadow-sm hover:shadow focus-within:shadow w-auto max-w-[80%] sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
                <Input
                  id="search-input"
                  type="text"
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </Button>
                )}
                <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="rounded-full h-8 w-8 relative group"
                    onClick={() => setIsVoiceModalOpen(true)}
                  >
                    <Mic className="h-4 w-4 text-orange-500" />
                    <span className="sr-only">Voice search</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 flex items-center justify-center">
                      <span className="text-[8px] font-bold">{currentLanguageInfo.flag}</span>
                    </div>
                  </Button>
                  <Button type="button" size="icon" variant="ghost" className="rounded-full h-8 w-8">
                    <Camera className="h-4 w-4 text-orange-500" />
                    <span className="sr-only">Image search</span>
                  </Button>
                  <Button type="submit" size="icon" variant="ghost" className="rounded-full h-8 w-8">
                    <Search className="h-4 w-4 text-orange-500" />
                    <span className="sr-only">Search</span>
                  </Button>
                </div>
              </div>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} compact />
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5 text-gray-600" />
              <span className="sr-only">Settings</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Grid className="h-5 w-5 text-gray-600" />
              <span className="sr-only">Apps</span>
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 rounded-md px-4">Sign in</Button>
          </div>
        </div>

        <div className="mt-3 ml-[76px]">
          <Tabs defaultValue={isImagesPage ? "images" : "all"} className="w-full" onValueChange={handleTabChange}>
            <TabsList className="bg-transparent h-auto p-0 justify-start">
              <TabsTrigger
                value="all"
                className="h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:shadow-none px-3 text-sm"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:shadow-none px-3 text-sm"
              >
                Images
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:shadow-none px-3 text-sm"
              >
                Videos
              </TabsTrigger>
              <TabsTrigger
                value="news"
                className="h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:shadow-none px-3 text-sm"
              >
                News
              </TabsTrigger>
              <TabsTrigger
                value="blockchain"
                className="h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:shadow-none px-3 text-sm"
              >
                Blockchain
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Voice search modal */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearch={(query) => {
          setQuery(query)
          router.push(`/search?q=${encodeURIComponent(query)}`)
        }}
      />
    </div>
  )
}
