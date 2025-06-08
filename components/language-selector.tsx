"use client"
import { Check, ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SUPPORTED_LANGUAGES } from "@/hooks/use-speech-recognition"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange: (language: string) => void
  compact?: boolean
}

export function LanguageSelector({ currentLanguage, onLanguageChange, compact = false }: LanguageSelectorProps) {
  const selectedLanguage = SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={compact ? "sm" : "default"}
          className={`flex items-center gap-1 ${compact ? "h-8 px-2 text-xs" : ""}`}
        >
          <Globe className={compact ? "h-3 w-3" : "h-4 w-4"} />
          {!compact && <span className="ml-1">{selectedLanguage.name}</span>}
          {compact && <span>{selectedLanguage.flag}</span>}
          <ChevronDown className={compact ? "h-3 w-3 ml-1" : "h-4 w-4 ml-1"} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto">
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={`flex items-center justify-between ${language.code === currentLanguage ? "bg-orange-50" : ""}`}
            onClick={() => onLanguageChange(language.code)}
          >
            <div className="flex items-center">
              <span className="mr-2">{language.flag}</span>
              <span>{language.name}</span>
            </div>
            {language.code === currentLanguage && <Check className="h-4 w-4 text-orange-500" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
