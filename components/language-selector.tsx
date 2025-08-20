"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supportedLanguages, getLanguageByCode, type Language } from "@/lib/languages"
import { Globe, ChevronDown } from "lucide-react"

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange: (language: Language) => void
  showNativeHelp?: boolean
  onToggleNativeHelp?: (enabled: boolean) => void
}

export function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  showNativeHelp = false,
  onToggleNativeHelp,
}: LanguageSelectorProps) {
  const [nativeHelpEnabled, setNativeHelpEnabled] = useState(false)
  const currentLang = getLanguageByCode(currentLanguage) || supportedLanguages[0]

  const handleToggleNativeHelp = () => {
    const newState = !nativeHelpEnabled
    setNativeHelpEnabled(newState)
    onToggleNativeHelp?.(newState)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="w-5 h-5" />
          Language Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Language Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Native Language</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-transparent">
                <span className="flex items-center gap-2">
                  <span className="text-lg">{currentLang.flag}</span>
                  {currentLang.nativeName}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {supportedLanguages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => onLanguageChange(language)}
                  className="flex items-center gap-2"
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.nativeName}</span>
                  <span className="text-muted-foreground text-sm">({language.name})</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Native Language Help Toggle */}
        {showNativeHelp && currentLanguage !== "en" && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-sm">Native Language Help</p>
              <p className="text-xs text-muted-foreground">Get explanations in {currentLang.nativeName} when needed</p>
            </div>
            <Button variant={nativeHelpEnabled ? "default" : "outline"} size="sm" onClick={handleToggleNativeHelp}>
              {nativeHelpEnabled ? "On" : "Off"}
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>
            <strong>Note:</strong> You&apos;ll practice English conversation, but can use your native language for help and
            understanding.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
