"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { ImageResult } from "@/types/search-types"
import { findSimilarImages } from "@/lib/image-similarity-service"

interface SimilarImagesGridProps {
  currentImage: ImageResult
  allImages: ImageResult[]
  onImageClick: (image: ImageResult) => void
}

export function SimilarImagesGrid({ currentImage, allImages, onImageClick }: SimilarImagesGridProps) {
  const [similarImages, setSimilarImages] = useState<ImageResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSimilarImages = async () => {
      setLoading(true)
      try {
        const results = await findSimilarImages(currentImage.id, allImages)
        setSimilarImages(results)
      } catch (error) {
        console.error("Error finding similar images:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSimilarImages()
  }, [currentImage.id, allImages])

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="aspect-square">
              <Skeleton className="h-full w-full rounded-md" />
            </div>
          ))}
      </div>
    )
  }

  if (similarImages.length === 0) {
    return <p className="text-sm text-gray-500">No similar images found</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {similarImages.map((image) => (
        <div
          key={image.id}
          className="group relative cursor-pointer rounded-md overflow-hidden bg-gray-100 hover:shadow-md transition-shadow"
          onClick={() => onImageClick(image)}
        >
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
          </div>
          <div className="absolute top-1 right-1">
            <Badge
              variant="outline"
              className={`${
                image.validationStatus === "validated"
                  ? "bg-green-900/70 text-green-100 border-green-700"
                  : image.validationStatus === "disputed"
                    ? "bg-yellow-900/70 text-yellow-100 border-yellow-700"
                    : "bg-blue-900/70 text-blue-100 border-blue-700"
              }`}
            >
              <Shield className="h-2 w-2 mr-0.5" />
              <span className="text-[8px]">{Math.round(image.validationConfidence * 100)}%</span>
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
