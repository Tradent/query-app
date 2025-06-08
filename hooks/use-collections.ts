"use client"

import { useState, useEffect } from "react"
import type { ImageResult } from "@/types/search-types"

export interface Collection {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  imageIds: string[]
  images: ImageResult[]
}

// Mock initial collections for demo purposes
const initialCollections: Collection[] = [
  {
    id: "col-1",
    name: "Blockchain Visualizations",
    description: "Visual representations of blockchain technology",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
    imageIds: [],
    images: [],
  },
  {
    id: "col-2",
    name: "DeFi Projects",
    description: "Images related to decentralized finance",
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-02-20"),
    imageIds: [],
    images: [],
  },
]

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load collections from localStorage on initial render
  useEffect(() => {
    const loadCollections = () => {
      try {
        const savedCollections = localStorage.getItem("image-collections")
        if (savedCollections) {
          const parsed = JSON.parse(savedCollections)
          // Convert string dates back to Date objects
          const collections = parsed.map((col: any) => ({
            ...col,
            createdAt: new Date(col.createdAt),
            updatedAt: new Date(col.updatedAt),
          }))
          setCollections(collections)
        } else {
          // Use initial collections if nothing in localStorage
          setCollections(initialCollections)
        }
      } catch (error) {
        console.error("Error loading collections:", error)
        setCollections(initialCollections)
      }
      setIsLoaded(true)
    }

    loadCollections()
  }, [])

  // Save collections to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("image-collections", JSON.stringify(collections))
    }
  }, [collections, isLoaded])

  // Create a new collection
  const createCollection = (name: string, description = ""): string => {
    const newCollection: Collection = {
      id: `col-${Date.now()}`,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      imageIds: [],
      images: [],
    }

    setCollections((prev) => [...prev, newCollection])
    return newCollection.id
  }

  // Add an image to a collection
  const addToCollection = (collectionId: string, image: ImageResult) => {
    setCollections((prev) =>
      prev.map((collection) => {
        if (collection.id === collectionId) {
          // Check if image is already in the collection
          if (collection.imageIds.includes(image.id)) {
            return collection
          }

          // Add the image
          return {
            ...collection,
            imageIds: [...collection.imageIds, image.id],
            images: [...collection.images, image],
            updatedAt: new Date(),
          }
        }
        return collection
      }),
    )
  }

  // Remove an image from a collection
  const removeFromCollection = (collectionId: string, imageId: string) => {
    setCollections((prev) =>
      prev.map((collection) => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            imageIds: collection.imageIds.filter((id) => id !== imageId),
            images: collection.images.filter((img) => img.id !== imageId),
            updatedAt: new Date(),
          }
        }
        return collection
      }),
    )
  }

  // Delete a collection
  const deleteCollection = (collectionId: string) => {
    setCollections((prev) => prev.filter((collection) => collection.id !== collectionId))
  }

  // Check if an image is in a collection
  const isImageInCollection = (collectionId: string, imageId: string): boolean => {
    const collection = collections.find((c) => c.id === collectionId)
    return collection ? collection.imageIds.includes(imageId) : false
  }

  // Get a collection by ID
  const getCollection = (collectionId: string): Collection | undefined => {
    return collections.find((c) => c.id === collectionId)
  }

  return {
    collections,
    createCollection,
    addToCollection,
    removeFromCollection,
    deleteCollection,
    isImageInCollection,
    getCollection,
  }
}
