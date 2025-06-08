"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield, ArrowLeft, Pencil, Trash2, Download, Share } from "lucide-react"
import { useCollections } from "@/hooks/use-collections"
import { formatDistanceToNow } from "date-fns"
import { ImagePreviewModal } from "@/components/image-preview-modal"
import type { ImageResult } from "@/types/search-types"

interface CollectionDetailProps {
  collectionId: string
}

export function CollectionDetail({ collectionId }: CollectionDetailProps) {
  const router = useRouter()
  const { collections, getCollection, removeFromCollection, deleteCollection } = useCollections()
  const collection = getCollection(collectionId)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editName, setEditName] = useState(collection?.name || "")
  const [editDescription, setEditDescription] = useState(collection?.description || "")
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  if (!collection) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Collection not found</h2>
        <p className="text-muted-foreground mb-6">The collection you're looking for doesn't exist or was deleted.</p>
        <Button asChild>
          <Link href="/collections">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
          </Link>
        </Button>
      </div>
    )
  }

  const handleSaveEdit = () => {
    // In a real app, you would update the collection here
    setIsEditOpen(false)
  }

  const handleDeleteCollection = () => {
    deleteCollection(collectionId)
    router.push("/collections")
  }

  const handleRemoveImage = (imageId: string) => {
    removeFromCollection(collectionId, imageId)
  }

  const openImagePreview = (image: ImageResult) => {
    setSelectedImage(image)
    setIsPreviewOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/collections">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Collections
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{collection.name}</h1>
          <p className="text-muted-foreground">{collection.description || "No description"}</p>
          <div className="flex gap-2 mt-2 text-sm text-muted-foreground">
            <span>{collection.images.length} images</span>
            <span>•</span>
            <span>Created {formatDistanceToNow(collection.createdAt, { addSuffix: true })}</span>
            <span>•</span>
            <span>Updated {formatDistanceToNow(collection.updatedAt, { addSuffix: true })}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {collection.images.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium mb-2">No images in this collection</h3>
          <p className="text-muted-foreground mb-6">
            Start adding images to this collection from the search results page.
          </p>
          <Button asChild>
            <Link href="/images">Browse Images</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {collection.images.map((image) => (
            <div
              key={image.id}
              className="group relative cursor-pointer rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-all duration-300"
              onClick={() => openImagePreview(image)}
            >
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={image.title}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Image info overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="text-white text-sm font-medium line-clamp-1">{image.title}</div>
                <div className="text-gray-300 text-xs line-clamp-1">{image.sourceName}</div>

                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-300">
                    {image.width} × {image.height}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      image.validationStatus === "validated"
                        ? "bg-green-900/70 text-green-100 border-green-700"
                        : image.validationStatus === "disputed"
                          ? "bg-yellow-900/70 text-yellow-100 border-yellow-700"
                          : "bg-blue-900/70 text-blue-100 border-blue-700"
                    }
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    <span className="text-[10px]">{Math.round(image.validationConfidence * 100)}%</span>
                  </Badge>
                </div>
              </div>

              {/* Remove button */}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveImage(image.id)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Collection Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Collection name</Label>
              <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete the collection "{collection.name}"? This action cannot be undone and all
              saved images will be removed from the collection.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCollection}>
              Delete Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      {selectedImage && (
        <ImagePreviewModal
          image={selectedImage}
          allImages={collection.images}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onImageChange={setSelectedImage}
        />
      )}
    </div>
  )
}
