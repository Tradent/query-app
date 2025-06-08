export interface ImageResult {
  id: string
  title: string
  url: string
  sourceUrl: string
  sourceName: string
  width: number
  height: number
  validationStatus: string
  validationConfidence: number
}

export interface SimilarityResult {
  image: ImageResult
  similarityScore: number
}
