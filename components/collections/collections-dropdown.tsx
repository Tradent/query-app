"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FolderPlus, Check, Plus, Bookmark } from "lucide-react"
import { useCollections } from "@/hooks/use-collections"
import type { ImageResult } from "@/types/search-types"

interface CollectionsDropdownProps {
  image: ImageResult
  variant?: "icon" | "default"
  size?: "sm" | "default"
}

export function CollectionsDropdown({ image, variant = "default", size = "default" }: CollectionsDropdownProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionDescription, setNewCollectionDescription] = useState("")
  const { collections, addToCollection, createCollection, isImageInCollection } = useCollections()

  const handleAddToCollection = (collectionId: string) => {
    addToCollection(collectionId, image)
  }

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const newCollectionId = createCollection(newCollectionName, newCollectionDescription)
      addToCollection(newCollectionId, image)
      setNewCollectionName("")
      setNewCollectionDescription("")
      setIsCreateOpen(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {variant === "icon" ? (
            <Button
              variant="ghost"
              size={size === "sm" ? "icon" : "default"}
              className={`${size === "sm" ? "h-8 w-8" : ""} rounded-full`}
            >
              <Bookmark className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"}`} />
            </Button>
          ) : (
            <Button variant="outline" size={size === "sm" ? "sm" : "default"} className="flex items-center gap-1">
              <Bookmark className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} mr-1`} />
              Save
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="p-2">
            <h4 className="text-sm font-medium mb-1">Save to collection</h4>
            <p className="text-xs text-muted-foreground mb-2">Select a collection or create a new one</p>
          </div>
          <DropdownMenuSeparator />
          {collections.length > 0 ? (
            <>
              {collections.map((collection) => {
                const isInCollection = isImageInCollection(collection.id, image.id)
                return (
                  <DropdownMenuItem
                    key={collection.id}
                    onClick={() => handleAddToCollection(collection.id)}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center">
                      <FolderPlus className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{collection.name}</span>
                    </span>
                    {isInCollection && <Check className="h-4 w-4 text-green-500" />}
                  </DropdownMenuItem>
                )
              })}
              <DropdownMenuSeparator />
            </>
          ) : (
            <div className="px-2 py-4 text-center">
              <p className="text-sm text-muted-foreground">No collections yet</p>
            </div>
          )}
          <DropdownMenuItem onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            <span>Create new collection</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
            <Button onClick={handleCreateCollection}>Create & Add Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
