"use client"

import { useState } from "react"
import { speechToText, textToSpeech } from "@/lib/speech-services"
import type { Language } from "@/lib/languages"

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  nativeTranslation?: string
  audioBlob?: Blob
  timestamp: Date
}

interface UseAiChatOptions {
  mode?: "freeflow" | "roleplay"
  scenario?: string
  nativeLanguage?: string
  nativeHelpEnabled?: boolean
}

export function useAiChat(options: UseAiChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "ai",
      content:
        "Hi there! I'm SpeakGenie, your AI speaking buddy! You can talk to me by recording your voice, and I'll listen and respond. What would you like to chat about today?",
      timestamp: new Date(),
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          targetLanguage,
          context: options.mode === "roleplay" ? `roleplay scenario: ${options.scenario}` : "free conversation",
        }),
      })

      if (!response.ok) {
        throw new Error("Translation failed")
      }

      const { translation } = await response.json()
      return translation
    } catch (error) {
      console.error("Translation error:", error)
      return text // Return original text if translation fails
    }
  }

  const sendAudioMessage = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true)

      // Step 1: Transcribe audio to text
      const transcript = await speechToText.transcribeAudio(audioBlob)

      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: transcript,
        audioBlob,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])

      // Step 2: Send to AI chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: transcript,
          mode: options.mode,
          scenario: options.scenario,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const { response: aiResponse } = await response.json()

      // Step 3: Translate AI response if native help is enabled
      let nativeTranslation: string | undefined
      if (options.nativeHelpEnabled && options.nativeLanguage && options.nativeLanguage !== "en") {
        nativeTranslation = await translateText(aiResponse, options.nativeLanguage)
      }

      // Add AI message
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        nativeTranslation,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])

      // Step 4: Convert AI response to speech (always in English for practice)
      if (textToSpeech.isSupported()) {
        setIsSpeaking(true)
        try {
          textToSpeech.setLanguage("en-US") // Always speak English for practice
          await textToSpeech.speak(aiResponse)
        } catch (error) {
          console.error("Text-to-speech error:", error)
        } finally {
          setIsSpeaking(false)
        }
      }
    } catch (error) {
      console.error("Error processing audio message:", error)

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: "ai",
        content: "Sorry, I had trouble understanding that. Could you try speaking again?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const speakMessage = async (message: ChatMessage) => {
    if (message.type === "ai" && textToSpeech.isSupported()) {
      setIsSpeaking(true)
      try {
        textToSpeech.setLanguage("en-US") // Always speak English for practice
        await textToSpeech.speak(message.content)
      } catch (error) {
        console.error("Text-to-speech error:", error)
      } finally {
        setIsSpeaking(false)
      }
    } else if (message.audioBlob) {
      // Play user's audio message
      const audio = new Audio(URL.createObjectURL(message.audioBlob))
      audio.play()
    }
  }

  const stopSpeaking = () => {
    textToSpeech.stop()
    setIsSpeaking(false)
  }

  const updateLanguageSettings = (language: Language, nativeHelpEnabled: boolean) => {
    // Update speech recognition language to user's native language
    speechToText.setLanguage(language.speechCode)
    // Keep TTS in English for practice, but update options
    options.nativeLanguage = language.code
    options.nativeHelpEnabled = nativeHelpEnabled
  }

  return {
    messages,
    isProcessing,
    isSpeaking,
    sendAudioMessage,
    speakMessage,
    stopSpeaking,
    updateLanguageSettings,
  }
}
