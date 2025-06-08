"use client"

import { useState, useEffect, useCallback } from "react"

// Define supported languages with their codes and names
export const SUPPORTED_LANGUAGES = [
  { code: "en-US", name: "English (US)", flag: "🇺🇸" },
  { code: "es-ES", name: "Español", flag: "🇪🇸" },
  { code: "fr-FR", name: "Français", flag: "🇫🇷" },
  { code: "de-DE", name: "Deutsch", flag: "🇩🇪" },
  { code: "it-IT", name: "Italiano", flag: "🇮🇹" },
  { code: "pt-BR", name: "Português (Brasil)", flag: "🇧🇷" },
  { code: "ja-JP", name: "日本語", flag: "🇯🇵" },
  { code: "ko-KR", name: "한국어", flag: "🇰🇷" },
  { code: "zh-CN", name: "中文 (简体)", flag: "🇨🇳" },
  { code: "ru-RU", name: "Русский", flag: "🇷🇺" },
  { code: "ar-SA", name: "العربية", flag: "🇸🇦" },
  { code: "hi-IN", name: "हिन्दी", flag: "🇮🇳" },
]

interface SpeechRecognitionResult {
  transcript: string
  isFinal: boolean
}

interface UseSpeechRecognitionProps {
  language?: string
  onLanguageDetected?: (detectedLanguage: string) => void
}

interface UseSpeechRecognitionReturn {
  transcript: string
  isListening: boolean
  startListening: () => void
  stopListening: () => void
  hasRecognitionSupport: boolean
  error: string | null
  language: string
  setLanguage: (lang: string) => void
  detectedLanguage: string | null
  supportedLanguages: typeof SUPPORTED_LANGUAGES
}

export function useSpeechRecognition({
  language = "en-US",
  onLanguageDetected,
}: UseSpeechRecognitionProps = {}): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recognition, setRecognition] = useState<any | null>(null)
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(language)
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for browser support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList

      if (SpeechRecognition) {
        setHasRecognitionSupport(true)
        const recognitionInstance = new SpeechRecognition()

        // Configure recognition
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = currentLanguage

        // Set up event handlers
        recognitionInstance.onresult = (event: any) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]

            // Check if language detection is available
            if (result.length > 0 && "lang" in result[0]) {
              const detectedLang = result[0].lang
              setDetectedLanguage(detectedLang)
              onLanguageDetected?.(detectedLang)
            }

            if (result.isFinal) {
              finalTranscript += result[0].transcript
            } else {
              interimTranscript += result[0].transcript
            }
          }

          setTranscript(finalTranscript || interimTranscript)
        }

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          setError(event.error)
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [currentLanguage, onLanguageDetected])

  // Update recognition language when language changes
  useEffect(() => {
    if (recognition) {
      recognition.lang = currentLanguage
    }
  }, [currentLanguage, recognition])

  const startListening = useCallback(() => {
    setError(null)
    setTranscript("")
    setDetectedLanguage(null)

    if (recognition) {
      try {
        recognition.lang = currentLanguage
        recognition.start()
        setIsListening(true)
      } catch (err) {
        console.error("Error starting speech recognition:", err)
        setError("Could not start speech recognition")
      }
    }
  }, [recognition, currentLanguage])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition, isListening])

  const setLanguage = useCallback((lang: string) => {
    setCurrentLanguage(lang)
  }, [])

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error,
    language: currentLanguage,
    setLanguage,
    detectedLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  }
}
