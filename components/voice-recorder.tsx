"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useVoiceRecorder } from "@/hooks/use-voice-recorder"
import { Mic, MicOff, Play, Pause, Trash2, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceRecorderProps {
  onSendAudio?: (audioBlob: Blob) => void
  className?: string
}

export function VoiceRecorder({ onSendAudio, className }: VoiceRecorderProps) {
  const {
    isRecording,
    isPlaying,
    audioBlob,
    duration,
    error,
    startRecording,
    stopRecording,
    playAudio,
    stopAudio,
    clearRecording,
  } = useVoiceRecorder()

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSend = () => {
    if (audioBlob && onSendAudio) {
      onSendAudio(audioBlob)
      clearRecording()
    }
  }

  return (
    <Card className={cn("w-full", isRecording && "border-primary", className)}>
      <CardContent className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            className={cn("w-20 h-20 rounded-full", isRecording && "animate-pulse")}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isPlaying}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </Button>

          <div className="text-2xl font-mono font-bold">{formatDuration(duration)}</div>

          <div className="text-center">
            <p className="font-medium">
              {isRecording
                ? "Recording your voice..."
                : audioBlob
                  ? "Great job! Your message is ready!"
                  : "Ready to practice? Tap the microphone!"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {isRecording
                ? "Speak clearly and tap again when finished"
                : audioBlob
                  ? "Listen to your recording or send it to SpeakGenie"
                  : "SpeakGenie is excited to chat with you!"}
            </p>
          </div>

          {audioBlob && (
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={isPlaying ? stopAudio : playAudio} disabled={isRecording}>
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>

              <Button variant="outline" onClick={clearRecording} disabled={isRecording || isPlaying}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>

              <Button onClick={handleSend} disabled={isRecording || isPlaying}>
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
