"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SUPPORTED_LANGUAGES } from "@/hooks/use-speech-recognition"
import { useLanguagePreference } from "@/hooks/use-language-preference"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Globe, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function LanguageSettings() {
  const { language, setLanguage } = useLanguagePreference()
  const [autoDetect, setAutoDetect] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(language)

  // Update selected language when preference changes
  useEffect(() => {
    setSelectedLanguage(language)
  }, [language])

  const handleSave = () => {
    setLanguage(selectedLanguage)
    localStorage.setItem("autoDetectLanguage", autoDetect.toString())
    toast({
      title: "Language settings saved",
      description: "Your language preferences have been updated.",
    })
  }

  // Load auto-detect setting
  useEffect(() => {
    const savedAutoDetect = localStorage.getItem("autoDetectLanguage")
    if (savedAutoDetect) {
      setAutoDetect(savedAutoDetect === "true")
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-orange-500" />
          Language Settings
        </CardTitle>
        <CardDescription>Configure language preferences for voice search and interface</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-detect" className="font-medium">
              Auto-detect language
            </Label>
            <Switch id="auto-detect" checked={autoDetect} onCheckedChange={setAutoDetect} />
          </div>
          <p className="text-sm text-gray-500">Automatically detect the language you're speaking during voice search</p>
        </div>

        <div className="space-y-3">
          <Label className="font-medium">Default language</Label>
          <p className="text-sm text-gray-500 mb-2">Select your preferred language for voice recognition</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto border rounded-md p-2">
            <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage}>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <div key={lang.code} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                  <RadioGroupItem value={lang.code} id={`lang-${lang.code}`} />
                  <Label htmlFor={`lang-${lang.code}`} className="flex items-center cursor-pointer">
                    <span className="mr-2">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
            <Check className="h-4 w-4 mr-2" />
            Save language settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
