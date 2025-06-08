"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ImagePreviewModal } from "@/components/image-preview-modal"
import { ImageIntegrityBadge } from "@/components/image-integrity-badge"
import { BatchSelectionToolbar } from "@/components/batch-selection-toolbar"
import { BatchVerificationResults } from "@/components/batch-verification-results"
import { CollectionsDropdown } from "@/components/collections/collections-dropdown"
import { startBatchVerification } from "@/lib/batch-verification-service"
import type { ImageResult } from "@/types/search-types"

// Mock function to simulate fetching image search results
const mockImageResults: ImageResult[] = [
  {
    id: "img1",
    title: "Solana Blockchain Visualization",
    url: "/blockchain-visualization.png",
    sourceUrl: "https://example.com/solana-viz",
    sourceName: "Blockchain Visuals",
    width: 500,
    height: 300,
    validationStatus: "validated",
    validationConfidence: 0.95,
  },
  {
    id: "img2",
    title: "Web3 Development Framework",
    url: "/web3-development.png",
    sourceUrl: "https://example.com/web3-dev",
    sourceName: "Dev Community",
    width: 600,
    height: 400,
    validationStatus: "pending",
    validationConfidence: 0.4,
  },
  {
    id: "img3",
    title: "Cryptocurrency Market Trends",
    url: "/placeholder-xhswx.png",
    sourceUrl: "https://example.com/crypto-trends",
    sourceName: "Crypto Analytics",
    width: 500,
    height: 350,
    validationStatus: "validated",
    validationConfidence: 0.87,
  },
  {
    id: "img4",
    title: "Peer-to-Peer Network Diagram",
    url: "/placeholder-moqss.png",
    sourceUrl: "https://example.com/p2p-network",
    sourceName: "Research Network",
    width: 450,
    height: 300,
    validationStatus: "disputed",
    validationConfidence: 0.65,
  },
  {
    id: "img5",
    title: "Blockchain Implementation Guide",
    url: "/placeholder-rabmd.png",
    sourceUrl: "https://example.com/blockchain-guide",
    sourceName: "Blockchain Developers Hub",
    width: 480,
    height: 320,
    validationStatus: "validated",
    validationConfidence: 0.92,
  },
  {
    id: "img6",
    title: "Solana Token Visualization",
    url: "/solana-token.png",
    sourceUrl: "https://example.com/solana-token",
    sourceName: "Token Insights",
    width: 420,
    height: 280,
    validationStatus: "validated",
    validationConfidence: 0.89,
  },
  {
    id: "img7",
    title: "DeFi Protocol Architecture",
    url: "/defi-protocol.png",
    sourceUrl: "https://example.com/defi-arch",
    sourceName: "DeFi Insights",
    width: 540,
    height: 360,
    validationStatus: "pending",
    validationConfidence: 0.55,
  },
  {
    id: "img8",
    title: "NFT Marketplace Screenshot",
    url: "/nft-marketplace-concept.png",
    sourceUrl: "https://example.com/nft-market",
    sourceName: "NFT World",
    width: 510,
    height: 340,
    validationStatus: "validated",
    validationConfidence: 0.91,
  },
  {
    id: "img9",
    title: "Blockchain Consensus Mechanism",
    url: "/placeholder-jrb9s.png",
    sourceUrl: "https://example.com/consensus",
    sourceName: "Blockchain Academy",
    width: 495,
    height: 330,
    validationStatus: "validated",
    validationConfidence: 0.94,
  },
  {
    id: "img10",
    title: "Smart Contract Code Example",
    url: "/placeholder-tihl4.png",
    sourceUrl: "https://example.com/smart-contract",
    sourceName: "Code Examples",
    width: 465,
    height: 310,
    validationStatus: "disputed",
    validationConfidence: 0.72,
  },
  {
    id: "img11",
    title: "Crypto Wallet Interface",
    url: "/placeholder-437it.png",
    sourceUrl: "https://example.com/crypto-wallet",
    sourceName: "Wallet Reviews",
    width: 435,
    height: 290,
    validationStatus: "validated",
    validationConfidence: 0.88,
  },
  {
    id: "img12",
    title: "Blockchain Explorer Dashboard",
    url: "/blockchain-explorer.png",
    sourceUrl: "https://example.com/explorer",
    sourceName: "Blockchain Tools",
    width: 525,
    height: 350,
    validationStatus: "validated",
    validationConfidence: 0.93,
  },
  {
    id: "img13",
    title: "DAO Governance Structure",
    url: "/dao-governance.png",
    sourceUrl: "https://example.com/dao-gov",
    sourceName: "DAO Insights",
    width: 480,
    height: 320,
    validationStatus: "pending",
    validationConfidence: 0.61,
  },
  {
    id: "img14",
    title: "Layer 2 Scaling Solution",
    url: "/placeholder-gsnqv.png",
    sourceUrl: "https://example.com/layer2",
    sourceName: "Scaling Solutions",
    width: 450,
    height: 300,
    validationStatus: "validated",
    validationConfidence: 0.9,
  },
  {
    id: "img15",
    title: "Tokenomics Infographic",
    url: "/placeholder-ntyq5.png",
    sourceUrl: "https://example.com/tokenomics",
    sourceName: "Token Economics",
    width: 510,
    height: 340,
    validationStatus: "validated",
    validationConfidence: 0.89,
  },
  {
    id: "img16",
    title: "Web3 Gaming Screenshot",
    url: "/web3-gaming.png",
    sourceUrl: "https://example.com/web3-gaming",
    sourceName: "Gaming Revolution",
    width: 540,
    height: 360,
    validationStatus: "validated",
    validationConfidence: 0.86,
  },
  {
    id: "img17",
    title: "Crypto Mining Farm",
    url: "/placeholder-q4dq9.png",
    sourceUrl: "https://example.com/mining-farm",
    sourceName: "Mining Insights",
    width: 450,
    height: 300,
    validationStatus: "validated",
    validationConfidence: 0.92,
  },
  {
    id: "img18",
    title: "DApp User Interface",
    url: "/placeholder-fnp0y.png",
    sourceUrl: "https://example.com/dapp-ui",
    sourceName: "DApp Reviews",
    width: 480,
    height: 320,
    validationStatus: "pending",
    validationConfidence: 0.58,
  },
  {
    id: "img19",
    title: "Blockchain Conference",
    url: "/blockchain-conference.png",
    sourceUrl: "https://example.com/conference",
    sourceName: "Event Photos",
    width: 510,
    height: 340,
    validationStatus: "validated",
    validationConfidence: 0.91,
  },
  {
    id: "img20",
    title: "Crypto Trading Chart",
    url: "/crypto-trading-chart.png",
    sourceUrl: "https://example.com/trading-chart",
    sourceName: "Trading Analysis",
    width: 495,
    height: 330,
    validationStatus: "validated",
    validationConfidence: 0.95,
  },
]

export function ImageSearchResults({ query }: { query: string }) {
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState<ImageResult[]>([])
  const [isBatchSelectionMode, setIsBatchSelectionMode] = useState(false)
  const [batchJobId, setBatchJobId] = useState<string | null>(null)
  const [isBatchResultsOpen, setIsBatchResultsOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "masonry" | "details">("grid")
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "validation">("relevance")
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null)

  // Filter images based on query (in a real app, this would be done server-side)
  const filteredImages = query
    ? mockImageResults.filter(
        (img) =>
          img.title.toLowerCase().includes(query.toLowerCase()) ||
          img.sourceName.toLowerCase().includes(query.toLowerCase()),
      )
    : mockImageResults

  // Sort images based on selected sort option
  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === "validation") {
      return b.validationConfidence - a.validationConfidence
    } else if (sortBy === "date") {
      // Mock date sorting - in a real app, you'd use actual dates
      return a.id.localeCompare(b.id)
    }
    // Default: relevance - no additional sorting needed
    return 0
  })

  const openImagePreview = (image: ImageResult) => {
    if (isBatchSelectionMode) {
      toggleImageSelection(image)
    } else {
      setSelectedImage(image)
      setIsModalOpen(true)
    }
  }

  const handleImageChange = (newImage: ImageResult) => {
    setSelectedImage(newImage)
  }

  // Toggle batch selection mode
  const toggleBatchSelectionMode = () => {
    setIsBatchSelectionMode(!isBatchSelectionMode)
    if (!isBatchSelectionMode) {
      setSelectedImages([])
    }
  }

  // Toggle image selection
  const toggleImageSelection = (image: ImageResult) => {
    if (selectedImages.some((img) => img.id === image.id)) {
      setSelectedImages(selectedImages.filter((img) => img.id !== image.id))
    } else {
      setSelectedImages([...selectedImages, image])
    }
  }

  // Select all images
  const selectAllImages = () => {
    setSelectedImages([...filteredImages])
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedImages([])
  }

  // Start batch verification
  const startBatchVerificationProcess = async (options: { runAiAnalysis: boolean }) => {
    if (selectedImages.length === 0) return

    const images = selectedImages.map((img) => ({
      id: img.id,
      url: img.url,
    }))

    const jobId = await startBatchVerification(images, options)
    setBatchJobId(jobId)
    setIsBatchResultsOpen(true)
  }

  // Close batch results
  const closeBatchResults = () => {
    setIsBatchResultsOpen(false)
    setBatchJobId(null)
    setSelectedImages([])
    setIsBatchSelectionMode(false)
  }

  // Get validation status color
  const getValidationStatusColor = (status: string) => {
    switch (status) {
      case "validated":
        return "bg-green-900/70 text-green-100 border-green-700"
      case "disputed":
        return "bg-yellow-900/70 text-yellow-100 border-yellow-700"
      default:
        return "bg-blue-900/70 text-blue-100 border-blue-700"
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">About {filteredImages.length * 123} results (0.42 seconds)</p>
          <h2 className="text-xl font-semibold mt-1">{query ? `Results for "${query}"` : "All Images"}</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center bg-white border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-600"}`}
              aria-label="Grid view"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              onClick={() => setViewMode("masonry")}
              className={`px-3 py-1.5 ${viewMode === "masonry" ? "bg-gray-100 text-gray-900" : "text-gray-600"}`}
              aria-label="Masonry view"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              onClick={() => setViewMode("details")}
              className={`px-3 py-1.5 ${viewMode === "details" ? "bg-gray-100 text-gray-900" : "text-gray-600"}`}
              aria-label="Details view"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-white border rounded-lg text-sm"
          >
            <option value="relevance">Sort by: Relevance</option>
            <option value="date">Sort by: Date</option>
            <option value="validation">Sort by: Validation</option>
          </select>

          <Button
            variant="outline"
            className={`text-sm flex items-center gap-1 ${isBatchSelectionMode ? "bg-blue-50 border-blue-200" : ""}`}
            onClick={toggleBatchSelectionMode}
          >
            <Shield className="h-4 w-4" />
            {isBatchSelectionMode ? "Cancel Selection" : "Batch Verify"}
          </Button>

          <Button variant="outline" size="sm" className="text-sm flex items-center gap-1" asChild>
            <a href="/collections">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
              </svg>
              Collections
            </a>
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedImages.map((image) => {
            const isSelected = selectedImages.some((img) => img.id === image.id)
            const isHovered = hoveredImageId === image.id

            return (
              <div
                key={image.id}
                className={`group relative cursor-pointer rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-all duration-300 ${
                  isSelected ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => openImagePreview(image)}
                onMouseEnter={() => setHoveredImageId(image.id)}
                onMouseLeave={() => setHoveredImageId(null)}
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.title}
                    fill
                    className={`object-cover transition-all duration-300 ${isHovered ? "scale-105" : ""}`}
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    loading="lazy"
                  />

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isHovered ? "opacity-100" : ""}`}
                  ></div>
                </div>

                {/* Selection indicator */}
                {isBatchSelectionMode && (
                  <div className="absolute top-2 left-2 z-10">
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center ${
                        isSelected ? "bg-blue-500" : "bg-white/80 border border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                )}

                {/* Save to collection button */}
                <div
                  className={`absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isHovered ? "opacity-100" : ""}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CollectionsDropdown image={image} variant="icon" size="sm" />
                </div>

                {/* Image info overlay */}
                <div
                  className={`absolute inset-0 flex flex-col justify-end p-3 transition-all duration-300 ${isHovered || isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                  <div className="text-white text-sm font-medium line-clamp-1">{image.title}</div>
                  <div className="text-gray-300 text-xs line-clamp-1">{image.sourceName}</div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-300">
                      {image.width} × {image.height}
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline" className={getValidationStatusColor(image.validationStatus)}>
                        <Shield className="h-3 w-3 mr-1" />
                        <span className="text-[10px]">{Math.round(image.validationConfidence * 100)}%</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Masonry View */}
      {viewMode === "masonry" && (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 space-y-4">
          {sortedImages.map((image) => {
            const isSelected = selectedImages.some((img) => img.id === image.id)
            const isHovered = hoveredImageId === image.id

            // Calculate aspect ratio for masonry layout
            const aspectRatio = image.height / image.width
            const heightClass = aspectRatio > 1.5 ? "h-[300px]" : aspectRatio > 1 ? "h-[250px]" : "h-[200px]"

            return (
              <div
                key={image.id}
                className={`relative inline-block w-full mb-4 rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-all duration-300 ${
                  isSelected ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => openImagePreview(image)}
                onMouseEnter={() => setHoveredImageId(image.id)}
                onMouseLeave={() => setHoveredImageId(null)}
              >
                <div className={`relative ${heightClass} overflow-hidden`}>
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.title}
                    fill
                    className={`object-cover transition-all duration-300 ${isHovered ? "scale-105" : ""}`}
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    loading="lazy"
                  />

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isHovered ? "opacity-100" : ""}`}
                  ></div>
                </div>

                {/* Selection indicator */}
                {isBatchSelectionMode && (
                  <div className="absolute top-2 left-2 z-10">
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center ${
                        isSelected ? "bg-blue-500" : "bg-white/80 border border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                )}

                {/* Save to collection button */}
                <div
                  className={`absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isHovered ? "opacity-100" : ""}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CollectionsDropdown image={image} variant="icon" size="sm" />
                </div>

                {/* Image info overlay */}
                <div
                  className={`absolute inset-0 flex flex-col justify-end p-3 transition-all duration-300 ${isHovered || isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                  <div className="text-white text-sm font-medium line-clamp-1">{image.title}</div>
                  <div className="text-gray-300 text-xs line-clamp-1">{image.sourceName}</div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-300">
                      {image.width} × {image.height}
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline" className={getValidationStatusColor(image.validationStatus)}>
                        <Shield className="h-3 w-3 mr-1" />
                        <span className="text-[10px]">{Math.round(image.validationConfidence * 100)}%</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Details View */}
      {viewMode === "details" && (
        <div className="space-y-4">
          {sortedImages.map((image) => {
            const isSelected = selectedImages.some((img) => img.id === image.id)

            return (
              <div
                key={image.id}
                className={`flex gap-4 p-3 bg-white border rounded-lg hover:shadow-md transition-shadow ${
                  isSelected ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => openImagePreview(image)}
              >
                <div className="relative h-24 w-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                    loading="lazy"
                  />

                  {/* Selection indicator */}
                  {isBatchSelectionMode && (
                    <div className="absolute top-1 left-1 z-10">
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center ${
                          isSelected ? "bg-blue-500" : "bg-white/80 border border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{image.title}</h3>
                  <p className="text-sm text-gray-500">{image.sourceName}</p>

                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="text-xs text-gray-500">
                      {image.width} × {image.height} px
                    </span>
                    <Badge variant="outline" className={getValidationStatusColor(image.validationStatus)}>
                      <Shield className="h-3 w-3 mr-1" />
                      <span className="text-[10px]">
                        {Math.round(image.validationConfidence * 100)}% {image.validationStatus}
                      </span>
                    </Badge>
                    <ImageIntegrityBadge imageId={image.id} size="sm" showTooltip={false} />
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Button variant="ghost" size="sm" className="text-blue-600 h-8">
                    View
                  </Button>
                  <div onClick={(e) => e.stopPropagation()}>
                    <CollectionsDropdown image={image} variant="default" size="sm" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-10 mb-6">
        <h3 className="text-lg font-medium mb-4">Related image searches</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            "Blockchain visualization",
            "Solana network",
            "Crypto market trends",
            "Web3 development",
            "NFT marketplace",
            "DeFi protocols",
          ].map((term) => (
            <div key={term} className="flex flex-col items-center group">
              <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2 group-hover:shadow-md transition-shadow">
                <Image
                  src={`/abstract-geometric-shapes.png?height=150&width=150&query=${encodeURIComponent(term)}`}
                  alt={term}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <span className="text-blue-800 text-sm hover:underline text-center">{term}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 mb-12">
        <div className="flex justify-center items-center">
          <Button variant="outline" className="text-blue-600">
            Show more results
          </Button>
        </div>
      </div>

      {selectedImage && (
        <ImagePreviewModal
          image={selectedImage}
          allImages={mockImageResults}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onImageChange={handleImageChange}
        />
      )}

      {/* Batch selection toolbar */}
      <BatchSelectionToolbar
        selectedImages={selectedImages}
        onClearSelection={clearSelection}
        onSelectAll={selectAllImages}
        onStartBatchVerification={startBatchVerificationProcess}
        isAllSelected={selectedImages.length === filteredImages.length}
        totalImages={filteredImages.length}
      />

      {/* Batch verification results dialog */}
      {batchJobId && (
        <Dialog open={isBatchResultsOpen} onOpenChange={setIsBatchResultsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <BatchVerificationResults jobId={batchJobId} onClose={closeBatchResults} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
