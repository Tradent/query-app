"use client"

import { useState, useEffect } from "react"
import { Mic, X, Search, Globe, Check, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSpeechRecognition, SUPPORTED_LANGUAGES } from "@/hooks/use-speech-recognition"
import { useLanguagePreference } from "@/hooks/use-language-preference"
import { LanguageSelector } from "@/components/language-selector"
import { Badge } from "@/components/ui/badge"

interface VoiceSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string) => void
}

export function VoiceSearchModal({ isOpen, onClose, onSearch }: VoiceSearchModalProps) {
  const { language, setLanguage } = useLanguagePreference()
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error,
    setLanguage: setSpeechLanguage,
    detectedLanguage,
    supportedLanguages,
  } = useSpeechRecognition({
    language,
    onLanguageDetected: (detected) => {
      console.log("Detected language:", detected)
    },
  })

  const [visualizerValues, setVisualizerValues] = useState<number[]>(Array(20).fill(5))
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(false)

  // Update speech recognition language when preference changes
  useEffect(() => {
    setSpeechLanguage(language)
  }, [language, setSpeechLanguage])

  // Start listening when modal opens
  useEffect(() => {
    if (isOpen && hasRecognitionSupport) {
      startListening()
    }

    return () => {
      if (isListening) {
        stopListening()
      }
    }
  }, [isOpen, hasRecognitionSupport, startListening, stopListening, isListening])

  // Animate the audio visualizer
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setVisualizerValues(
          Array(20)
            .fill(0)
            .map(() => (isListening ? Math.floor(Math.random() * 50) + 5 : 5)),
        )
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isListening])

  const handleSearch = () => {
    if (transcript) {
      onSearch(transcript)
      onClose()
    }
  }

  // Get detected language name
  const getDetectedLanguageName = () => {
    if (!detectedLanguage) return null

    const detected = supportedLanguages.find(
      (lang) => lang.code === detectedLanguage || lang.code.split("-")[0] === detectedLanguage.split("-")[0],
    )

    return detected ? detected.name : detectedLanguage
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white flex justify-between items-center">
          <h2 className="text-lg font-medium">Voice Search</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {!hasRecognitionSupport ? (
            <div className="text-center py-8">
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                <p>Voice search is not supported in your browser.</p>
                <p className="text-sm mt-2">Try using Chrome, Edge, or Safari.</p>
              </div>
              <Button onClick={onClose}>Close</Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <LanguageSelector
                  currentLanguage={language}
                  onLanguageChange={(lang) => {
                    setLanguage(lang)
                    if (isListening) {
                      stopListening()
                      setTimeout(() => startListening(), 300)
                    }
                  }}
                />

                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-xs flex items-center gap-1 ${autoDetectLanguage ? "text-orange-500" : ""}`}
                    onClick={() => setAutoDetectLanguage(!autoDetectLanguage)}
                  >
                    <RefreshCw className="h-3 w-3" />
                    Auto-detect
                    {autoDetectLanguage && <Check className="h-3 w-3" />}
                  </Button>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    isListening ? "bg-red-100 text-red-500 animate-pulse" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Mic className="h-10 w-10" />
                </div>
              </div>

              {/* Audio visualizer */}
              <div className="flex items-end justify-center h-16 mb-6 gap-1">
                {visualizerValues.map((value, index) => (
                  <div
                    key={index}
                    className={`w-2 bg-orange-500 rounded-full transition-all duration-100 ${
                      isListening ? "opacity-100" : "opacity-30"
                    }`}
                    style={{ height: `${value}%` }}
                  ></div>
                ))}
              </div>

              {detectedLanguage && autoDetectLanguage && (
                <div className="mb-4 text-center">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Globe className="h-3 w-3 mr-1" />
                    Detected: {getDetectedLanguageName() || detectedLanguage}
                  </Badge>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[100px] mb-4 text-center">
                {transcript ? (
                  <p className="text-lg">{transcript}</p>
                ) : (
                  <p className="text-gray-500">
                    {isListening ? (
                      <>Listening... Speak in {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name}</>
                    ) : (
                      "Click the microphone to start speaking"
                    )}
                  </p>
                )}

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>

              <div className="flex justify-between">
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  onClick={isListening ? stopListening : startListening}
                  className="flex items-center gap-2"
                >
                  {isListening ? "Stop" : "Restart"}
                </Button>

                <Button
                  onClick={handleSearch}
                  disabled={!transcript}
                  className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
