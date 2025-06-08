"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useLanguagePreference } from "@/hooks/use-language-preference"
import { LanguageSelector } from "@/components/language-selector"
import { cn } from "@/lib/utils"

interface VoiceSearchButtonProps {
  onResult: (transcript: string) => void
  className?: string
}

export function VoiceSearchButton({ onResult, className }: VoiceSearchButtonProps) {
  const { language, setLanguage } = useLanguagePreference()
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error,
    setLanguage: setSpeechLanguage,
  } = useSpeechRecognition({ language })

  const [showTranscript, setShowTranscript] = useState(false)

  // Update speech recognition language when preference changes
  useEffect(() => {
    setSpeechLanguage(language)
  }, [language, setSpeechLanguage])

  // Submit the transcript when speech recognition stops
  useEffect(() => {
    if (!isListening && transcript && showTranscript) {
      onResult(transcript)
      setShowTranscript(false)
    }
  }, [isListening, transcript, onResult, showTranscript])

  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening()
    } else {
      setShowTranscript(true)
      startListening()
    }
  }

  if (!hasRecognitionSupport) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("rounded-full text-gray-400", className)}
        title="Voice search not supported in this browser"
        disabled
      >
        <MicOff className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleVoiceSearch}
        className={cn(
          "rounded-full transition-colors",
          isListening ? "text-red-500 bg-red-50" : "text-gray-500 hover:text-orange-500",
          className,
        )}
        title={isListening ? "Stop listening" : "Search by voice"}
      >
        <Mic className={cn("h-5 w-5", isListening && "animate-pulse")} />
      </Button>

      {showTranscript && (
        <div className="absolute bottom-full mb-2 right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              {isListening ? (
                <>
                  <div className="relative mr-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full relative"></div>
                  </div>
                  <span className="text-sm font-medium">Listening...</span>
                </>
              ) : (
                <span className="text-sm font-medium">Voice search</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => {
                stopListening()
                setShowTranscript(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-2">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={(lang) => {
                setLanguage(lang)
                if (isListening) {
                  stopListening()
                  setTimeout(() => startListening(), 300)
                }
              }}
              compact
            />
          </div>

          <div className="min-h-[60px] bg-gray-50 rounded p-2 text-sm">
            {transcript ? transcript : isListening ? "Speak now..." : "No speech detected"}
          </div>

          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs mr-2"
              onClick={() => {
                stopListening()
                setShowTranscript(false)
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="text-xs bg-orange-500 hover:bg-orange-600"
              onClick={() => {
                if (transcript) {
                  onResult(transcript)
                  setShowTranscript(false)
                }
              }}
              disabled={!transcript}
            >
              Search
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
