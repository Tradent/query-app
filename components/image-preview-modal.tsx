"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, X, Download, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react"
import { ValidateResultButton } from "@/components/validate-result-button"
import { SimilarImagesGrid } from "@/components/similar-images-grid"
import { ImageIntegrityDetails } from "@/components/image-integrity-details"
import { ImageIntegrityBadge } from "@/components/image-integrity-badge"
import { AIAnalysisDetails } from "@/components/ai-analysis-details"
import type { ImageResult } from "@/types/search-types"

interface ImagePreviewModalProps {
  image: ImageResult
  allImages: ImageResult[]
  isOpen: boolean
  onClose: () => void
  onImageChange: (image: ImageResult) => void
}

export function ImagePreviewModal({ image, allImages, isOpen, onClose, onImageChange }: ImagePreviewModalProps) {
  const [showInfo, setShowInfo] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("info")

  const handleSimilarImageClick = (newImage: ImageResult) => {
    onImageChange(newImage)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white">
        <div className="flex flex-col md:flex-row h-[80vh]">
          {/* Image container */}
          <div className="relative flex-1 bg-gray-900 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white hover:bg-gray-800 z-10"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="relative h-full w-full flex items-center justify-center p-4">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.title}
                className="object-contain max-h-full"
                width={image.width}
                height={image.height}
              />
            </div>
          </div>

          {/* Info panel */}
          {showInfo && (
            <div className="w-full md:w-80 border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-lg mb-1">{image.title}</h3>
                <a
                  href={image.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm flex items-center"
                >
                  {image.sourceName}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>

              <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid grid-cols-4 px-4 pt-2">
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="integrity">Integrity</TabsTrigger>
                  <TabsTrigger value="ai">AI Analysis</TabsTrigger>
                  <TabsTrigger value="similar">Similar</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="flex-1 overflow-auto">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <Badge
                        variant="outline"
                        className={`${
                          image.validationStatus === "validated"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : image.validationStatus === "disputed"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {image.validationStatus.charAt(0).toUpperCase() + image.validationStatus.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {Math.round(image.validationConfidence * 100)}% confidence
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <ValidateResultButton resultId={image.id} />
                      <Button variant="link" className="text-blue-800 p-0 h-auto font-normal">
                        Blockchain details
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border-b border-gray-200">
                    <h4 className="text-sm font-medium mb-2">Image information</h4>
                    <div className="space-y-1 text-sm">
                      <p className="flex justify-between">
                        <span className="text-gray-500">Dimensions</span>
                        <span>
                          {image.width} × {image.height}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Size</span>
                        <span>{Math.round((image.width * image.height) / 1024)} KB</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Type</span>
                        <span>JPEG</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Integrity</span>
                        <ImageIntegrityBadge imageId={image.id} size="sm" showTooltip={false} />
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="integrity" className="flex-1 overflow-auto p-4">
                  <ImageIntegrityDetails imageId={image.id} imageUrl={image.url} />
                </TabsContent>

                <TabsContent value="ai" className="flex-1 overflow-auto p-4">
                  <AIAnalysisDetails imageId={image.id} imageUrl={image.url} width={400} height={300} />
                </TabsContent>

                <TabsContent value="similar" className="flex-1 overflow-auto p-4">
                  <div className="mb-3">
                    <h4 className="text-sm font-medium mb-1">Visually similar images</h4>
                    <p className="text-xs text-gray-500">Images that share visual characteristics with this image</p>
                  </div>
                  <SimilarImagesGrid
                    currentImage={image}
                    allImages={allImages}
                    onImageClick={handleSimilarImageClick}
                  />
                </TabsContent>
              </Tabs>

              <div className="p-4 flex justify-between mt-auto border-t border-gray-200">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
