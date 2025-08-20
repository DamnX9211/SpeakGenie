"use client"

export class SpeechToTextService {
  private recognition: any | null = null
  private currentLanguage = "en-US"

  constructor() {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRec()
      this.recognition.continuous = false
      this.recognition.interimResults = false
      this.recognition.lang = this.currentLanguage
    }
  }

  setLanguage(languageCode: string) {
    this.currentLanguage = languageCode
    if (this.recognition) {
      this.recognition.lang = languageCode
    }
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    const mockResponses = [
      "Hello, I want to practice speaking English!",
      "Can you help me with my pronunciation?",
      "I'm learning new words today.",
      "How do you say this in English?",
      "Thank you for helping me learn!",
      "I enjoy practicing conversations.",
      "What should we talk about next?",
      "This is fun and educational!",
    ]

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return a random realistic response
    return mockResponses[Math.floor(Math.random() * mockResponses.length)]
  }

  isSupported(): boolean {
    return typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
  }
}

export class TextToSpeechService {
  private synth: SpeechSynthesis | null = null
  private currentLanguage = "en-US"

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis
    }
  }

  setLanguage(languageCode: string) {
    this.currentLanguage = languageCode
  }

  async speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject(new Error("Text-to-speech not supported"))
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 1
      utterance.lang = this.currentLanguage

      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(new Error(`Speech error: ${event.error}`))

      this.synth.speak(utterance)
    })
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel()
    }
  }

  isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window
  }
}

export const speechToText = new SpeechToTextService()
export const textToSpeech = new TextToSpeechService()
