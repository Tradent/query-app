"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Camera, Shield, Layers } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SearchByImage } from "@/components/search-by-image"

export function ImageSearchTools() {
  const [showTools, setShowTools] = useState(false)
  const [showSearchByImage, setShowSearchByImage] = useState(false)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-4">
      <div className="ml-[76px] flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="text-sm text-gray-700 flex items-center gap-1 px-3 h-8"
            onClick={() => setShowTools(!showTools)}
          >
            Tools
            <ChevronDown className={`h-4 w-4 transition-transform ${showTools ? "rotate-180" : ""}`} />
          </Button>

          <Button
            variant="ghost"
            className="text-sm text-blue-600 flex items-center gap-1 px-3 h-8 ml-2"
            onClick={() => setShowSearchByImage(true)}
          >
            <Camera className="h-4 w-4" />
            Search by image
          </Button>

          <Button
            variant="ghost"
            className="text-sm text-blue-600 flex items-center gap-1 px-3 h-8 ml-2"
            onClick={() => (window.location.href = "/images/verify")}
          >
            <Shield className="h-4 w-4" />
            Verify integrity
          </Button>

          <Button
            variant="ghost"
            className="text-sm text-blue-600 flex items-center gap-1 px-3 h-8 ml-2"
            onClick={() => (window.location.href = "/images/batch-verify")}
          >
            <Layers className="h-4 w-4" />
            Batch verification
          </Button>
        </div>

        <Select defaultValue="relevance">
          <SelectTrigger className="h-8 text-xs border-0 bg-transparent focus:ring-0 focus:ring-offset-0 px-2 w-auto">
            <SelectValue placeholder="Sort by relevance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Sort by relevance</SelectItem>
            <SelectItem value="date">Sort by date</SelectItem>
            <SelectItem value="validation">Sort by validation score</SelectItem>
            <SelectItem value="integrity">Sort by integrity score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showTools && (
        <div className="mt-2 ml-[76px] flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Size:</span>
            <Select defaultValue="any">
              <SelectTrigger className="h-8 text-xs border-0 bg-transparent focus:ring-0 focus:ring-offset-0 px-2">
                <SelectValue placeholder="Any size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any size</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="custom">Custom...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Color:</span>
            <Select defaultValue="any">
              <SelectTrigger className="h-8 text-xs border-0 bg-transparent focus:ring-0 focus:ring-offset-0 px-2">
                <SelectValue placeholder="Any color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any color</SelectItem>
                <SelectItem value="black">Black & white</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Type:</span>
            <Select defaultValue="any">
              <SelectTrigger className="h-8 text-xs border-0 bg-transparent focus:ring-0 focus:ring-offset-0 px-2">
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any type</SelectItem>
                <SelectItem value="photo">Photo</SelectItem>
                <SelectItem value="clipart">Clip art</SelectItem>
                <SelectItem value="lineart">Line drawing</SelectItem>
                <SelectItem value="animated">Animated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Time:</span>
            <Select defaultValue="any">
              <SelectTrigger className="h-8 text-xs border-0 bg-transparent focus:ring-0 focus:ring-offset-0 px-2">
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any time</SelectItem>
                <SelectItem value="day">Past 24 hours</SelectItem>
                <SelectItem value="week">Past week</SelectItem>
                <SelectItem value="month">Past month</SelectItem>
                <SelectItem value="year">Past year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Validation:</span>
            <Select defaultValue="any">
              <SelectTrigger className="h-8 text-xs border-0 bg-transparent focus:ring-0 focus:ring-offset-0 px-2">
                <SelectValue placeholder="Any validation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any validation</SelectItem>
                <SelectItem value="validated">Validated</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="high">High confidence (&gt;90%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Integrity:</span>
            <Select defaultValue="any">
              <SelectTrigger className="h-8 text-xs border-0 bg-transparent focus:ring-0 focus:ring-offset-0 px-2">
                <SelectValue placeholder="Any integrity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any integrity</SelectItem>
                <SelectItem value="verified">Verified original</SelectItem>
                <SelectItem value="likely">Likely original</SelectItem>
                <SelectItem value="manipulated">Possibly manipulated</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <Dialog open={showSearchByImage} onOpenChange={setShowSearchByImage}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search by image</DialogTitle>
          </DialogHeader>
          <SearchByImage />
        </DialogContent>
      </Dialog>
    </div>
  )
}
