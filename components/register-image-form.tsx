"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Camera, CheckCircle, Loader2 } from "lucide-react"
import { registerImageOnBlockchain } from "@/lib/image-integrity-service"
import type { ImageIntegrityRecord } from "@/lib/image-integrity-service"

export function RegisterImageForm() {
  const [imageUrl, setImageUrl] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationResult, setRegistrationResult] = useState<ImageIntegrityRecord | null>(null)
  const [activeTab, setActiveTab] = useState<string>("url")

  const handleUrlRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl) return

    setIsRegistering(true)
    try {
      const result = await registerImageOnBlockchain(imageUrl)
      setRegistrationResult(result)
    } catch (error) {
      console.error("Error registering image:", error)
    } finally {
      setIsRegistering(false)
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

  const handleUploadRegistration = async () => {
    if (!uploadedImage) return

    setIsRegistering(true)
    try {
      const result = await registerImageOnBlockchain(uploadedImage)
      setRegistrationResult(result)
    } catch (error) {
      console.error("Error registering uploaded image:", error)
    } finally {
      setIsRegistering(false)
    }
  }

  const clearUploadedImage = () => {
    setUploadedImage(null)
  }

  if (registrationResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            Image Registered Successfully
          </CardTitle>
          <CardDescription>
            Your image has been registered on the blockchain and can now be verified for integrity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Image ID:</span> {registrationResult.imageId}
            </div>
            <div className="text-sm">
              <span className="font-medium">Transaction ID:</span>{" "}
              <code className="text-xs bg-gray-100 p-1 rounded">
                {registrationResult.transactionId.slice(0, 8)}...{registrationResult.transactionId.slice(-8)}
              </code>
            </div>
            <div className="text-sm">
              <span className="font-medium">Block Height:</span> {registrationResult.blockHeight.toLocaleString()}
            </div>
            <div className="text-sm">
              <span className="font-medium">Timestamp:</span>{" "}
              {new Date(registrationResult.timestampCreated).toLocaleString()}
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle className="text-blue-800">What happens next?</AlertTitle>
            <AlertDescription className="text-blue-700">
              Your image is now protected by blockchain verification. Anyone can verify if this image has been
              manipulated by comparing it to the original hash stored on the blockchain.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setRegistrationResult(null)}>
            Register Another Image
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Image on Blockchain</CardTitle>
        <CardDescription>
          Register your image on the blockchain to protect it from manipulation and enable integrity verification.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">Image URL</TabsTrigger>
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4 pt-4">
            <form onSubmit={handleUrlRegistration} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!imageUrl || isRegistering}
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>Register Image</>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 pt-4">
            <div className="space-y-4">
              {uploadedImage ? (
                <div className="space-y-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded image"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={clearUploadedImage} className="flex-1">
                      Choose Different Image
                    </Button>
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={handleUploadRegistration}
                      disabled={isRegistering}
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>Register Image</>
                      )}
                    </Button>
                  </div>
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
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-4">
          <Alert>
            <AlertTitle>How blockchain verification works</AlertTitle>
            <AlertDescription>
              When you register an image, we generate a unique hash of the image and store it on the Solana blockchain.
              This creates a tamper-proof record that can be used to verify if the image has been manipulated in the
              future.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  )
}
