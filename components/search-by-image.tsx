"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Upload, X } from "lucide-react"
import { generateEmbeddingFromImage } from "@/lib/image-similarity-service"

export function SearchByImage() {
  const [imageUrl, setImageUrl] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("url")
  const router = useRouter()

  const handleUrlSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl) return

    setIsLoading(true)
    try {
      // In a real app, this would send the image URL to your backend
      await generateEmbeddingFromImage(imageUrl)

      // Navigate to search results with the image URL as a parameter
      router.push(`/images?image_url=${encodeURIComponent(imageUrl)}`)
    } catch (error) {
      console.error("Error searching by image URL:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview URL for the uploaded image
    const reader = new FileReader()
    reader.onload = () => {
      setUploadedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadSearch = async () => {
    if (!uploadedImage) return

    setIsLoading(true)
    try {
      // In a real app, this would upload the image to your backend
      await generateEmbeddingFromImage(uploadedImage)

      // Navigate to search results with a temporary ID for the uploaded image
      const tempId = Date.now().toString()
      router.push(`/images?uploaded_image=${tempId}`)
    } catch (error) {
      console.error("Error searching by uploaded image:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearUploadedImage = () => {
    setUploadedImage(null)
  }

  return (
    <div className="w-full max-w-md">
      <Tabs defaultValue="url" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">Paste image URL</TabsTrigger>
          <TabsTrigger value="upload">Upload an image</TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="p-4">
          <form onSubmit={handleUrlSearch} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="image-url" className="text-sm font-medium">
                Image URL
              </label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={!imageUrl || isLoading}>
              {isLoading ? "Searching..." : "Search by image"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="upload" className="p-4">
          <div className="space-y-4">
            {uploadedImage ? (
              <div className="relative">
                <div className="aspect-video relative rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded image"
                    fill
                    className="object-contain"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={clearUploadedImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center block cursor-pointer hover:bg-gray-50 transition-colors">
                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">Drag an image here or click to upload</p>
                <Button variant="outline" size="sm" type="button">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose file
                </Button>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!uploadedImage || isLoading}
              onClick={handleUploadSearch}
            >
              {isLoading ? "Searching..." : "Search by image"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
