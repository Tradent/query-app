"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Folder, MoreVertical, Plus, Pencil, Trash2, ExternalLink } from "lucide-react"
import { useCollections, type Collection } from "@/hooks/use-collections"
import { formatDistanceToNow } from "date-fns"

interface CollectionsClientProps {
  filter: "all" | "recent" | "largest"
}

export function CollectionsClient({ filter }: CollectionsClientProps) {
  const router = useRouter()
  const { collections, createCollection, deleteCollection } = useCollections()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionDescription, setNewCollectionDescription] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null)

  // Filter and sort collections based on the selected filter
  const filteredCollections = [...collections].sort((a, b) => {
    if (filter === "recent") {
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    } else if (filter === "largest") {
      return b.imageIds.length - a.imageIds.length
    }
    // Default: alphabetical by name
    return a.name.localeCompare(b.name)
  })

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName, newCollectionDescription)
      setNewCollectionName("")
      setNewCollectionDescription("")
      setIsCreateOpen(false)
    }
  }

  const confirmDeleteCollection = (collectionId: string) => {
    setCollectionToDelete(collectionId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteCollection = () => {
    if (collectionToDelete) {
      deleteCollection(collectionToDelete)
      setCollectionToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const navigateToCollection = (collectionId: string) => {
    router.push(`/collections/${collectionId}`)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {filter === "all"
            ? "All Collections"
            : filter === "recent"
              ? "Recently Updated Collections"
              : "Largest Collections"}
        </h2>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>

      {filteredCollections.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No collections yet</h3>
          <p className="text-muted-foreground mb-6">Create your first collection to start organizing your images.</p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onDelete={() => confirmDeleteCollection(collection.id)}
              onClick={() => navigateToCollection(collection.id)}
            />
          ))}
        </div>
      )}

      {/* Create Collection Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collection name</Label>
              <Input
                id="name"
                placeholder="My favorite blockchain images"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="A collection of my favorite blockchain visualizations"
                value={newCollectionDescription}
                onChange={(e) => setNewCollectionDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCollection}>Create Collection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete this collection? This action cannot be undone and all saved images will be
              removed from the collection.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCollection}>
              Delete Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface CollectionCardProps {
  collection: Collection
  onDelete: () => void
  onClick: () => void
}

function CollectionCard({ collection, onDelete, onClick }: CollectionCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{collection.name}</CardTitle>
            <CardDescription>{collection.description || "No description"}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onClick}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Collection
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Collection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="cursor-pointer h-40 bg-muted flex items-center justify-center relative" onClick={onClick}>
          {collection.images.length > 0 ? (
            <div className="grid grid-cols-2 h-full w-full">
              {collection.images.slice(0, 4).map((image, index) => (
                <div
                  key={image.id}
                  className={`relative ${index === 0 && collection.images.length === 1 ? "col-span-2" : ""}`}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {collection.images.length > 4 && index === 3 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-lg font-medium">+{collection.images.length - 3}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4">
              <Folder className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No images yet</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <div className="text-sm text-muted-foreground">
          {collection.imageIds.length} {collection.imageIds.length === 1 ? "image" : "images"}
        </div>
        <div className="text-sm text-muted-foreground">
          Updated {formatDistanceToNow(collection.updatedAt, { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  )
}
