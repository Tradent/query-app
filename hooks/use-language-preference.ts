"use client"

import { useState, useEffect } from "react"
import { SUPPORTED_LANGUAGES } from "@/hooks/use-speech-recognition"

// Get browser language or default to en-US
function getBrowserLanguage(): string {
  if (typeof window === "undefined") return "en-US"

  const browserLang = navigator.language

  // Check if browser language is supported
  const isSupported = SUPPORTED_LANGUAGES.some(
    (lang) => lang.code === browserLang || lang.code.split("-")[0] === browserLang.split("-")[0],
  )

  if (isSupported) {
    // Find exact match
    const exactMatch = SUPPORTED_LANGUAGES.find((lang) => lang.code === browserLang)
    if (exactMatch) return exactMatch.code

    // Find language match (ignoring region)
    const langMatch = SUPPORTED_LANGUAGES.find((lang) => lang.code.split("-")[0] === browserLang.split("-")[0])
    if (langMatch) return langMatch.code
  }

  return "en-US"
}

export function useLanguagePreference() {
  const [language, setLanguageState] = useState<string>("en-US")

  // Load language preference on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem("preferredLanguage")
    const initialLanguage = storedLanguage || getBrowserLanguage()
    setLanguageState(initialLanguage)
  }, [])

  // Update language preference
  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage)
    localStorage.setItem("preferredLanguage", newLanguage)
  }

  return { language, setLanguage }
}
