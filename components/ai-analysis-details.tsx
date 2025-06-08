"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Loader2, Brain } from "lucide-react"
import { AIManipulationVisualizer } from "@/components/ai-manipulation-visualizer"
import { runAIAnalysisOnImage } from "@/lib/image-integrity-service"
import { getAIAnalysisExplanation, getAIRecommendations } from "@/lib/ai-manipulation-detection"
import type { DetectionResult } from "@/types/ai-detection-types"
import type { ImageIntegrityRecord } from "@/lib/image-integrity-service"

interface AIAnalysisDetailsProps {
  imageId: string
  imageUrl: string
  width: number
  height: number
  initialRecord?: ImageIntegrityRecord
}

export function AIAnalysisDetails({ imageId, imageUrl, width, height, initialRecord }: AIAnalysisDetailsProps) {
  const [record, setRecord] = useState<ImageIntegrityRecord | null>(initialRecord || null)
  const [aiAnalysis, setAiAnalysis] = useState<DetectionResult | undefined>(initialRecord?.aiAnalysis)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const result = await runAIAnalysisOnImage(imageId, imageUrl)

      if (result.record) {
        setRecord(result.record)
      }

      if (result.aiAnalysis) {
        setAiAnalysis(result.aiAnalysis)
      } else {
        setError("Failed to analyze image. Please try again.")
      }
    } catch (err) {
      setError("An error occurred during analysis. Please try again.")
      console.error("Error running AI analysis:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!record) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis</CardTitle>
          <CardDescription>This image has not been analyzed by our AI manipulation detection system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTitle>No AI analysis available</AlertTitle>
            <AlertDescription>
              Run an AI analysis to detect sophisticated manipulations that may not be visible to the human eye or
              detectable by simple hash comparison.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Run AI Analysis
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 text-purple-500 mr-2" />
            AI Manipulation Analysis
          </CardTitle>
          {aiAnalysis && (
            <Badge
              variant="outline"
              className={
                !aiAnalysis.isManipulated
                  ? "bg-green-50 text-green-700 border-green-200"
                  : aiAnalysis.manipulationScore > 0.5
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }
            >
              {!aiAnalysis.isManipulated
                ? "No Manipulation Detected"
                : aiAnalysis.manipulationScore > 0.5
                  ? "Significant Manipulation"
                  : "Minor Manipulation"}
            </Badge>
          )}
        </div>
        <CardDescription>
          {record.lastAiAnalysisAt
            ? `Last analyzed ${new Date(record.lastAiAnalysisAt).toLocaleDateString()}`
            : "This image has not been analyzed yet"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AIManipulationVisualizer
          imageUrl={imageUrl}
          aiAnalysis={aiAnalysis}
          width={width}
          height={height}
          onRunAnalysis={handleRunAnalysis}
          isAnalyzing={isAnalyzing}
        />

        {aiAnalysis && (
          <>
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">AI Analysis Explanation</h4>
              <p className="text-sm text-gray-700">{getAIAnalysisExplanation(aiAnalysis)}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recommendations</h4>
              <ul className="list-disc pl-5 space-y-1">
                {getAIRecommendations(aiAnalysis).map((recommendation, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 text-xs text-gray-500">
              <p>Analysis performed by {aiAnalysis.modelVersion}</p>
              <p>
                Analysis time: {aiAnalysis.analysisTime.toFixed(2)}s • Confidence:{" "}
                {Math.round(aiAnalysis.aiConfidence * 100)}%
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
