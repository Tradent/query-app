"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, X, Wallet, Search, LayoutDashboard, Settings, User } from "lucide-react"
import { useSolanaWallet } from "@/lib/solana/wallet-context"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { connected, publicKey, connecting, connectWallet, disconnectWallet } = useSolanaWallet()
  const { isAuthenticated, user, signOut } = useAuth()

  // Initialize search query from URL if on search page
  useEffect(() => {
    if (pathname.startsWith("/search") || pathname.startsWith("/images")) {
      const query = searchParams.get("q")
      if (query) {
        setSearchQuery(query)
      }
    }
  }, [pathname, searchParams])

  // Track scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  // Only hide navbar on search pages, not on homepage
  if (pathname === "/search" || pathname.startsWith("/search?")) {
    return null
  }

  const isHomepage = pathname === "/"

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Get initials for avatar
  const getInitials = () => {
    if (user?.publicKey) {
      return `${user.publicKey.toString().slice(0, 2)}`
    }
    return "U"
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 w-full",
        scrolled
          ? "bg-earth-50/90 backdrop-blur-md shadow-sm border-b border-earth-200"
          : isHomepage
            ? "bg-transparent absolute"
            : "bg-earth-50/90 backdrop-blur-md shadow-sm border-b border-earth-200",
      )}
    >
      <nav className="w-full flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1 items-center">
          <Link href="/" className="p-1">
            <span className="text-2xl font-normal text-sun-600">Query-SE</span>
          </Link>
        </div>

        {/* Compact search bar - only show when not on homepage */}
        {!isHomepage && (
          <form onSubmit={handleSearch} className="hidden md:flex max-w-md flex-1 mx-2">
            <div className="relative w-full">
              <div className="flex items-center border border-earth-200 rounded-full px-2 py-1 shadow-sm hover:shadow focus-within:shadow bg-white/80 backdrop-blur-sm">
                <Input
                  type="text"
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7 text-sm"
                  placeholder="Search Query-SE"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" size="icon" variant="ghost" className="rounded-full h-6 w-6 p-0">
                  <Search className="h-3.5 w-3.5 text-sun-500" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            </div>
          </form>
        )}

        <div className="flex lg:hidden">
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-md p-2",
              isHomepage && !scrolled ? "text-white" : "text-earth-700",
            )}
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <div className="flex items-center gap-2">
            {/* Dashboard Button */}
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full",
                  isHomepage && !scrolled
                    ? "text-white hover:bg-white/20 hover:text-white"
                    : "text-earth-700 hover:text-earth-900 hover:bg-earth-100",
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Button>
            </Link>

            {/* Settings Button */}
            <Link href="/settings">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full",
                  isHomepage && !scrolled
                    ? "text-white hover:bg-white/20 hover:text-white"
                    : "text-earth-700 hover:text-earth-900 hover:bg-earth-100",
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Profile Circle/Avatar */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "rounded-full p-0 overflow-hidden",
                        isHomepage && !scrolled ? "hover:bg-white/20" : "hover:bg-earth-100",
                      )}
                    >
                      <Avatar className="h-8 w-8 border">
                        <AvatarFallback
                          className={cn(
                            "bg-orange-100 text-orange-800",
                            isHomepage && !scrolled && "bg-white/20 text-white",
                          )}
                        >
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600">
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : connected ? (
              <div className="flex items-center gap-2">
                <span
                  className={cn("text-sm hidden md:inline", isHomepage && !scrolled ? "text-white" : "text-earth-700")}
                >
                  {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
                </span>
                <Link href="/auth/signin">
                  <Button
                    size="sm"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 h-8",
                      isHomepage && !scrolled
                        ? "bg-white text-sun-600 hover:bg-white/90"
                        : "bg-sun-500 hover:bg-sun-600 text-white",
                    )}
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                size="sm"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 h-8",
                  isHomepage && !scrolled
                    ? "bg-white text-sun-600 hover:bg-white/90"
                    : "bg-sun-500 hover:bg-sun-600 text-white",
                )}
                onClick={connectWallet}
                disabled={connecting}
              >
                <Wallet className="h-3.5 w-3.5" />
                {connecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-earth-50/95 backdrop-blur-lg px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-earth-200">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="text-2xl font-normal text-sun-600">Query-SE</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-earth-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile search */}
            {!isHomepage && (
              <form onSubmit={handleSearch} className="mt-6">
                <div className="relative w-full">
                  <div className="flex items-center border border-earth-200 rounded-full px-3 py-1 shadow-sm bg-white/80 backdrop-blur-sm">
                    <Input
                      type="text"
                      className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-8 text-sm"
                      placeholder="Search Query-SE"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" size="icon" variant="ghost" className="rounded-full h-7 w-7">
                      <Search className="h-4 w-4 text-sun-500" />
                      <span className="sr-only">Search</span>
                    </Button>
                  </div>
                </div>
              </form>
            )}

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-earth-200/10">
                <div className="space-y-2 py-6">
                  {/* Add Dashboard and Settings links to mobile menu */}
                  <Link
                    href="/dashboard"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-earth-900 hover:bg-earth-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </div>
                  </Link>

                  <Link
                    href="/settings"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-earth-900 hover:bg-earth-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Settings
                    </div>
                  </Link>
                </div>
                <div className="py-6">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-10 w-10 border">
                          <AvatarFallback className="bg-orange-100 text-orange-800">{getInitials()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Profile</p>
                          <p className="text-sm text-earth-600">
                            {user?.publicKey?.toString().slice(0, 4)}...{user?.publicKey?.toString().slice(-4)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href="/profile" className="flex-1">
                          <Button
                            className="w-full border-earth-200 text-earth-700 hover:bg-earth-100"
                            variant="outline"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Profile
                          </Button>
                        </Link>
                        <Button
                          className="flex-1 border-earth-200 text-earth-700 hover:bg-earth-100"
                          variant="outline"
                          onClick={() => {
                            signOut()
                            setMobileMenuOpen(false)
                          }}
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  ) : connected ? (
                    <div className="space-y-2">
                      <p className="text-sm text-earth-600">
                        Connected: {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
                      </p>
                      <Link href="/auth/signin" className="block w-full">
                        <Button
                          className="w-full bg-sun-500 hover:bg-sun-600 text-white"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-sun-500 hover:bg-sun-600 flex items-center justify-center gap-2 text-white"
                      onClick={() => {
                        connectWallet()
                        setMobileMenuOpen(false)
                      }}
                      disabled={connecting}
                    >
                      <Wallet className="h-4 w-4" />
                      {connecting ? "Connecting..." : "Connect Wallet"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
