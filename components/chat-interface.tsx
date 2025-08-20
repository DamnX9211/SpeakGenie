"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VoiceRecorder } from "@/components/voice-recorder"
import { LanguageSelector } from "@/components/language-selector"
import { useAiChat } from "@/hooks/use-ai-chat"
import { supportedLanguages, type Language } from "@/lib/languages"
import { MessageCircle, Volume2, VolumeX, Loader2, Languages } from "lucide-react"

interface ChatInterfaceProps {
  title: string
  description: string
  mode?: "freeflow" | "roleplay"
  scenario?: string
  onBack: () => void
}

export function ChatInterface({ title, description, mode = "freeflow", scenario, onBack }: ChatInterfaceProps) {
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [nativeHelpEnabled, setNativeHelpEnabled] = useState(false)
  const [showLanguageSettings, setShowLanguageSettings] = useState(false)

  const { messages, isProcessing, isSpeaking, sendAudioMessage, speakMessage, stopSpeaking, updateLanguageSettings } =
    useAiChat({
      mode,
      scenario,
      nativeLanguage: currentLanguage,
      nativeHelpEnabled,
    })

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language.code)
    updateLanguageSettings(language, nativeHelpEnabled)
  }

  const handleNativeHelpToggle = (enabled: boolean) => {
    setNativeHelpEnabled(enabled)
    const language = supportedLanguages.find((lang) => lang.code === currentLanguage) || supportedLanguages[0]
    updateLanguageSettings(language, enabled)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowLanguageSettings(!showLanguageSettings)}>
              <Languages className="w-4 h-4 mr-2" />
              Language
            </Button>
            {isSpeaking && (
              <Button variant="outline" onClick={stopSpeaking}>
                <VolumeX className="w-4 h-4 mr-2" />
                Stop Speaking
              </Button>
            )}
          </div>
        </div>

        {/* Language Settings */}
        {showLanguageSettings && (
          <div className="mb-6">
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
              showNativeHelp={true}
              onToggleNativeHelp={handleNativeHelpToggle}
            />
          </div>
        )}

        {/* Chat Messages */}
        <div className="grid gap-6 mb-8">
          <Card className="h-96 overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Conversation
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        {/* Native translation for AI messages */}
                        {message.nativeTranslation && nativeHelpEnabled && (
                          <div className="mt-2 pt-2 border-t border-current/20">
                            <p className="text-xs opacity-80 italic">{message.nativeTranslation}</p>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => speakMessage(message)}
                        className="p-1 h-auto flex-shrink-0"
                        disabled={isSpeaking}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground px-4 py-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <p className="text-sm">SpeakGenie is listening and thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voice Recorder */}
          <VoiceRecorder onSendAudio={sendAudioMessage} />
        </div>
      </div>
    </div>
  )
}
