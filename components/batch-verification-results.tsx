"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Download, Brain, FileDown, Loader2, X } from "lucide-react"
import {
  getBatchVerificationStatus,
  generateBatchSummary,
  deleteBatchVerification,
} from "@/lib/batch-verification-service"
import type { BatchVerificationJob, BatchVerificationResult } from "@/types/batch-verification-types"

interface BatchVerificationResultsProps {
  jobId: string
  onClose: () => void
}

export function BatchVerificationResults({ jobId, onClose }: BatchVerificationResultsProps) {
  const [job, setJob] = useState<BatchVerificationJob | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [summary, setSummary] = useState<ReturnType<typeof generateBatchSummary> | null>(null)
  const router = useRouter()

  // Poll for job status updates
  useEffect(() => {
    const fetchJobStatus = () => {
      const currentJob = getBatchVerificationStatus(jobId)
      setJob(currentJob)

      if (currentJob) {
        setSummary(generateBatchSummary(jobId))
      }
    }

    // Initial fetch
    fetchJobStatus()

    // Set up polling interval
    const intervalId = setInterval(() => {
      fetchJobStatus()

      // Stop polling when job is complete
      const currentJob = getBatchVerificationStatus(jobId)
      if (currentJob?.status === "completed" || currentJob?.status === "failed" || currentJob?.status === "cancelled") {
        clearInterval(intervalId)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [jobId])

  // Handle export results
  const handleExportResults = () => {
    if (!job) return

    // Create a JSON blob with the results
    const resultsData = {
      jobId: job.id,
      status: job.status,
      totalImages: job.totalImages,
      completedImages: job.completedImages,
      startTime: new Date(job.startTime).toISOString(),
      endTime: job.endTime ? new Date(job.endTime).toISOString() : null,
      summary: summary,
      results: job.results,
    }

    const blob = new Blob([JSON.stringify(resultsData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    // Create a download link and trigger it
    const a = document.createElement("a")
    a.href = url
    a.download = `batch-verification-${jobId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle view image details
  const handleViewImageDetails = (imageId: string) => {
    router.push(`/images/verify/${imageId}`)
  }

  // Handle close and cleanup
  const handleCloseAndCleanup = () => {
    deleteBatchVerification(jobId)
    onClose()
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="ml-2">Loading batch verification job...</p>
      </div>
    )
  }

  // Filter results based on active tab
  const getFilteredResults = (): [string, BatchVerificationResult][] => {
    if (!job.results) return []

    const entries = Object.entries(job.results)

    switch (activeTab) {
      case "verified":
        return entries.filter(([_, result]) => result.verified)
      case "suspicious":
        return entries.filter(([_, result]) => result.manipulationProbability > 0.3)
      case "manipulated":
        return entries.filter(([_, result]) => result.aiAnalysis?.isManipulated)
      case "failed":
        return entries.filter(([_, result]) => result.error !== null)
      default:
        return entries
    }
  }

  const filteredResults = getFilteredResults()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Batch Verification Results</h2>
        <Button variant="ghost" size="icon" onClick={handleCloseAndCleanup}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Status and progress */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Verification Status</CardTitle>
            <Badge
              variant="outline"
              className={
                job.status === "completed"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : job.status === "failed" || job.status === "cancelled"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
              }
            >
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
          </div>
          <CardDescription>
            {job.status === "completed"
              ? `Completed ${job.completedImages} of ${job.totalImages} images in ${
                  job.endTime ? ((job.endTime - job.startTime) / 1000).toFixed(1) : "?"
                } seconds`
              : job.status === "processing"
                ? `Processing ${job.completedImages} of ${job.totalImages} images...`
                : job.status === "failed"
                  ? "Verification failed. Please try again."
                  : job.status === "cancelled"
                    ? "Verification was cancelled."
                    : "Preparing to verify images..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{job.progress}% complete</span>
              <span>
                {job.completedImages} of {job.totalImages} images
              </span>
            </div>
            <Progress value={job.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {summary && job.status === "completed" && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center text-green-700 mb-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <h4 className="font-medium">Verified</h4>
                </div>
                <p className="text-2xl font-bold">{summary.verifiedCount}</p>
                <p className="text-sm text-gray-500">images</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center text-yellow-700 mb-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <h4 className="font-medium">Suspicious</h4>
                </div>
                <p className="text-2xl font-bold">{summary.suspiciousCount}</p>
                <p className="text-sm text-gray-500">images</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center text-purple-700 mb-1">
                  <Brain className="h-4 w-4 mr-1" />
                  <h4 className="font-medium">AI Detected</h4>
                </div>
                <p className="text-2xl font-bold">{summary.manipulationDetectedCount}</p>
                <p className="text-sm text-gray-500">manipulations</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center text-red-700 mb-1">
                  <X className="h-4 w-4 mr-1" />
                  <h4 className="font-medium">Failed</h4>
                </div>
                <p className="text-2xl font-bold">{summary.failedCount}</p>
                <p className="text-sm text-gray-500">images</p>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Total processing time: {summary.processingTimeMs ? (summary.processingTimeMs / 1000).toFixed(2) : "?"}{" "}
              seconds
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleExportResults}>
              <FileDown className="h-4 w-4" />
              Export Results
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Results tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All ({Object.keys(job.results).length})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({summary?.verifiedCount || 0})</TabsTrigger>
          <TabsTrigger value="suspicious">Suspicious ({summary?.suspiciousCount || 0})</TabsTrigger>
          <TabsTrigger value="manipulated">AI Detected ({summary?.manipulationDetectedCount || 0})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({summary?.failedCount || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredResults.length === 0 ? (
            <Alert>
              <AlertTitle>No results found</AlertTitle>
              <AlertDescription>No images match the selected filter criteria.</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.map(([imageId, result]) => (
                <Card key={imageId} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src={result.imageUrl || "/placeholder.svg"}
                      alt={`Image ${imageId}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <Badge
                        variant="outline"
                        className={
                          result.error
                            ? "bg-red-900/70 text-red-100 border-red-700"
                            : result.verified
                              ? "bg-green-900/70 text-green-100 border-green-700"
                              : "bg-yellow-900/70 text-yellow-100 border-yellow-700"
                        }
                      >
                        {result.error ? "Failed" : result.verified ? "Verified" : "Suspicious"}
                      </Badge>

                      {result.aiAnalysis && (
                        <Badge
                          variant="outline"
                          className={
                            result.aiAnalysis.isManipulated
                              ? "bg-purple-900/70 text-purple-100 border-purple-700"
                              : "bg-blue-900/70 text-blue-100 border-blue-700"
                          }
                        >
                          <Brain className="h-3 w-3 mr-1" />
                          {result.aiAnalysis.isManipulated ? "Manipulation Detected" : "No Manipulation"}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">Image {imageId}</h3>
                    {result.error ? (
                      <p className="text-sm text-red-600">{result.error}</p>
                    ) : (
                      <div className="text-sm">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Manipulation probability:</span>
                          <span className="font-medium">{Math.round(result.manipulationProbability * 100)}%</span>
                        </p>
                        {result.aiAnalysis && (
                          <p className="flex justify-between">
                            <span className="text-gray-500">AI confidence:</span>
                            <span className="font-medium">{Math.round(result.aiAnalysis.aiConfidence * 100)}%</span>
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleViewImageDetails(imageId)}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleCloseAndCleanup}>
          Close
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleExportResults}
          disabled={job.status !== "completed"}
        >
          <Download className="h-4 w-4" />
          Export Results
        </Button>
      </div>
    </div>
  )
}
