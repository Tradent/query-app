export type ManipulationType =
  | "object_removal"
  | "object_addition"
  | "face_manipulation"
  | "color_adjustment"
  | "splicing"

export interface ManipulationRegion {
  x: number // 0-1 normalized coordinate
  y: number // 0-1 normalized coordinate
  width: number // 0-1 normalized width
  height: number // 0-1 normalized height
  confidence: number // 0-1 confidence score
}

export interface DetectedManipulation {
  type: ManipulationType
  confidence: number // 0-1 confidence score
  regions: ManipulationRegion[]
  description: string
}

export interface DetectionResult {
  isManipulated: boolean
  manipulationScore: number // 0-1 score, higher means more manipulation
  detectedManipulations: DetectedManipulation[]
  analysisTime: number // in seconds
  aiConfidence: number // 0-1 confidence in the overall analysis
  modelVersion: string
}
