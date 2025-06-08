"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, AlertTriangle, XCircle, Eye } from "lucide-react"
import { getAllBatchVerificationJobs, generateBatchSummary } from "@/lib/batch-verification-service"
import { BatchVerificationResults } from "@/components/batch-verification-results"
import type { BatchVerificationJob } from "@/types/batch-verification-types"

export function BatchVerificationHistory() {
  const [jobs, setJobs] = useState<BatchVerificationJob[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [isResultsOpen, setIsResultsOpen] = useState(false)

  // Fetch all batch verification jobs
  useEffect(() => {
    const fetchJobs = () => {
      const allJobs = getAllBatchVerificationJobs()
      setJobs(allJobs)
    }

    // Initial fetch
    fetchJobs()

    // Set up polling interval for active jobs
    const intervalId = setInterval(() => {
      fetchJobs()
    }, 2000)

    return () => clearInterval(intervalId)
  }, [])

  // View job details
  const handleViewJobDetails = (jobId: string) => {
    setSelectedJobId(jobId)
    setIsResultsOpen(true)
  }

  // Close job details
  const handleCloseJobDetails = () => {
    setIsResultsOpen(false)
    setSelectedJobId(null)
  }

  // Filter jobs based on active tab
  const getFilteredJobs = (): BatchVerificationJob[] => {
    switch (activeTab) {
      case "active":
        return jobs.filter((job) => job.status === "pending" || job.status === "processing")
      case "completed":
        return jobs.filter((job) => job.status === "completed")
      case "failed":
        return jobs.filter((job) => job.status === "failed" || job.status === "cancelled")
      default:
        return jobs
    }
  }

  const filteredJobs = getFilteredJobs()

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Jobs</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-gray-500">No batch verification jobs found.</p>
                <p className="text-sm text-gray-400 mt-2">Start a new batch verification from the image search page.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const summary = generateBatchSummary(job.id)

                return (
                  <Card key={job.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Batch Job #{job.id.split("_")[1]}</CardTitle>
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
                          {job.status === "completed" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : job.status === "failed" || job.status === "cancelled" ? (
                            <XCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>
                        Started {new Date(job.startTime).toLocaleString()} •
                        {job.status === "completed" && job.endTime
                          ? ` Completed in ${((job.endTime - job.startTime) / 1000).toFixed(1)} seconds`
                          : job.status === "processing"
                            ? ` ${job.progress}% complete`
                            : job.status === "failed" || job.status === "cancelled"
                              ? " Failed or cancelled"
                              : " Pending"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 p-2 rounded-full">
                            <CheckCircle className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{job.totalImages}</p>
                            <p className="text-xs text-gray-500">Total Images</p>
                          </div>
                        </div>

                        {job.status === "completed" && (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="bg-green-100 p-2 rounded-full">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{summary.verifiedCount}</p>
                                <p className="text-xs text-gray-500">Verified</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="bg-yellow-100 p-2 rounded-full">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{summary.suspiciousCount}</p>
                                <p className="text-xs text-gray-500">Suspicious</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="bg-red-100 p-2 rounded-full">
                                <XCircle className="h-4 w-4 text-red-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{summary.failedCount}</p>
                                <p className="text-xs text-gray-500">Failed</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => handleViewJobDetails(job.id)}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Batch verification results dialog */}
      {selectedJobId && (
        <Dialog open={isResultsOpen} onOpenChange={setIsResultsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <BatchVerificationResults jobId={selectedJobId} onClose={handleCloseJobDetails} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
