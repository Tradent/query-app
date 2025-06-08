"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckSquare, Square, Shield, Brain, X } from "lucide-react"
import type { ImageResult } from "@/types/search-types"

interface BatchSelectionToolbarProps {
  selectedImages: ImageResult[]
  onClearSelection: () => void
  onSelectAll: () => void
  onStartBatchVerification: (options: { runAiAnalysis: boolean }) => void
  isAllSelected: boolean
  totalImages: number
}

export function BatchSelectionToolbar({
  selectedImages,
  onClearSelection,
  onSelectAll,
  onStartBatchVerification,
  isAllSelected,
  totalImages,
}: BatchSelectionToolbarProps) {
  const [includeAiAnalysis, setIncludeAiAnalysis] = useState(true)

  if (selectedImages.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 py-3 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={isAllSelected ? onClearSelection : onSelectAll}
          >
            {isAllSelected ? (
              <>
                <CheckSquare className="h-4 w-4" />
                Deselect All
              </>
            ) : (
              <>
                <Square className="h-4 w-4" />
                Select All
              </>
            )}
          </Button>

          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {selectedImages.length} {selectedImages.length === 1 ? "image" : "images"} selected
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onClearSelection}
          >
            <X className="h-4 w-4 mr-1" />
            Clear selection
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ai-analysis"
              checked={includeAiAnalysis}
              onCheckedChange={(checked) => setIncludeAiAnalysis(checked as boolean)}
            />
            <label
              htmlFor="ai-analysis"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
            >
              <Brain className="h-4 w-4 mr-1 text-purple-600" />
              Include AI analysis
            </label>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => onStartBatchVerification({ runAiAnalysis: includeAiAnalysis })}
            >
              <Shield className="h-4 w-4" />
              Verify {selectedImages.length} {selectedImages.length === 1 ? "image" : "images"}
            </Button>

            <Button variant="destructive" size="sm" onClick={onClearSelection}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
