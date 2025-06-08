"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye, EyeOff, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import type { DetectionResult, DetectedManipulation } from "@/types/ai-detection-types"

interface AIManipulationVisualizerProps {
  imageUrl: string
  aiAnalysis: DetectionResult | undefined
  width: number
  height: number
  onRunAnalysis?: () => void
  isAnalyzing?: boolean
}

export function AIManipulationVisualizer({
  imageUrl,
  aiAnalysis,
  width,
  height,
  onRunAnalysis,
  isAnalyzing = false,
}: AIManipulationVisualizerProps) {
  const [showOverlay, setShowOverlay] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [zoom, setZoom] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  // Draw the image and manipulation regions on the canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !aiAnalysis || !aiAnalysis.isManipulated) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Load the image
    if (!imageRef.current) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = imageUrl
      img.onload = () => {
        imageRef.current = img
        drawCanvas(ctx, img)
      }
    } else {
      drawCanvas(ctx, imageRef.current)
    }
  }, [imageUrl, aiAnalysis, showOverlay, activeTab, zoom])

  // Draw the canvas with image and overlays
  const drawCanvas = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    const canvas = canvasRef.current
    if (!canvas || !aiAnalysis) return

    // Set canvas dimensions to match image aspect ratio
    const aspectRatio = img.width / img.height
    canvas.width = width
    canvas.height = width / aspectRatio

    // Draw the image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    // If overlay is disabled, we're done
    if (!showOverlay || !aiAnalysis.isManipulated) return

    // Filter manipulations based on active tab
    const manipulations = aiAnalysis.detectedManipulations.filter((m) => activeTab === "all" || m.type === activeTab)

    // Draw manipulation regions
    manipulations.forEach((manipulation) => {
      drawManipulationRegions(ctx, manipulation, canvas.width, canvas.height)
    })
  }

  // Draw regions for a specific manipulation type
  const drawManipulationRegions = (
    ctx: CanvasRenderingContext2D,
    manipulation: DetectedManipulation,
    canvasWidth: number,
    canvasHeight: number,
  ) => {
    const color = getColorForManipulationType(manipulation.type)

    manipulation.regions.forEach((region) => {
      const x = region.x * canvasWidth
      const y = region.y * canvasHeight
      const width = region.width * canvasWidth
      const height = region.height * canvasHeight

      // Draw semi-transparent fill
      ctx.fillStyle = `${color}33` // 20% opacity
      ctx.fillRect(x, y, width, height)

      // Draw border
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, width, height)

      // Draw label
      ctx.fillStyle = color
      ctx.font = "bold 12px sans-serif"
      ctx.fillText(getShortLabel(manipulation.type), x + 4, y + 16)

      // Draw confidence percentage
      const confidenceText = `${Math.round(region.confidence * 100)}%`
      ctx.font = "10px sans-serif"
      ctx.fillText(confidenceText, x + 4, y + 30)
    })
  }

  // Get color for each manipulation type
  const getColorForManipulationType = (type: string): string => {
    switch (type) {
      case "object_removal":
        return "#ff0000" // Red
      case "object_addition":
        return "#00ff00" // Green
      case "face_manipulation":
        return "#0000ff" // Blue
      case "color_adjustment":
        return "#ffff00" // Yellow
      case "splicing":
        return "#ff00ff" // Magenta
      default:
        return "#ffffff" // White
    }
  }

  // Get short label for manipulation type
  const getShortLabel = (type: string): string => {
    switch (type) {
      case "object_removal":
        return "Removed"
      case "object_addition":
        return "Added"
      case "face_manipulation":
        return "Face"
      case "color_adjustment":
        return "Color"
      case "splicing":
        return "Splice"
      default:
        return "Unknown"
    }
  }

  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.25, 3))
  }

  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.25, 0.5))
  }

  // Reset zoom
  const handleResetZoom = () => {
    setZoom(1)
  }

  if (!aiAnalysis) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full rounded-md" />
        <div className="flex justify-center">
          <Button onClick={onRunAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
          </Button>
        </div>
      </div>
    )
  }

  if (!aiAnalysis.isManipulated) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Original image"
            className="w-full h-auto rounded-md"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/10 rounded-md">
            <div className="bg-white/90 px-4 py-2 rounded-md shadow-md">
              <p className="text-green-700 font-medium">No manipulations detected</p>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">AI analysis found no evidence of manipulation in this image.</div>
        <div className="flex justify-center">
          <Button onClick={onRunAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : "Run New Analysis"}
          </Button>
        </div>
      </div>
    )
  }

  // Get unique manipulation types for tabs
  const manipulationTypes = Array.from(new Set(aiAnalysis.detectedManipulations.map((m) => m.type)))

  return (
    <div className="space-y-4">
      <div className="relative border rounded-md overflow-hidden" style={{ height: height * zoom }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
        />

        <div className="absolute top-2 right-2 flex space-x-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
            onClick={() => setShowOverlay(!showOverlay)}
          >
            {showOverlay ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        <div className="absolute bottom-2 right-2 flex space-x-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
            onClick={handleResetZoom}
            disabled={zoom === 1}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {manipulationTypes.length > 0 && (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="all">All Manipulations</TabsTrigger>
            {manipulationTypes.map((type) => (
              <TabsTrigger key={type} value={type}>
                {type
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-2">
            <p className="text-sm">
              {aiAnalysis.detectedManipulations.length} types of manipulation detected with{" "}
              {Math.round(aiAnalysis.aiConfidence * 100)}% AI confidence.
            </p>
          </TabsContent>

          {manipulationTypes.map((type) => (
            <TabsContent key={type} value={type} className="mt-2">
              <p className="text-sm">{aiAnalysis.detectedManipulations.find((m) => m.type === type)?.description}</p>
            </TabsContent>
          ))}
        </Tabs>
      )}

      <div className="flex justify-center">
        <Button onClick={onRunAnalysis} disabled={isAnalyzing}>
          {isAnalyzing ? "Analyzing..." : "Run New Analysis"}
        </Button>
      </div>
    </div>
  )
}
