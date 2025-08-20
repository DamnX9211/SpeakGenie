/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useRef, useCallback } from "react"

export interface VoiceRecorderState {
  isRecording: boolean
  isPlaying: boolean
  audioBlob: Blob | null
  audioUrl: string | null
  duration: number
  error: string | null
}

export function useVoiceRecorder() {
  const [state, setState] = useState<VoiceRecorderState>({
    isRecording: false,
    isPlaying: false,
    audioBlob: null,
    audioUrl: null,
    duration: 0,
    error: null,
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
        const audioUrl = URL.createObjectURL(audioBlob)

        setState((prev) => ({
          ...prev,
          audioBlob,
          audioUrl,
          isRecording: false,
        }))

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      startTimeRef.current = Date.now()

      // Update duration every 100ms
      durationIntervalRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          duration: (Date.now() - startTimeRef.current) / 1000,
        }))
      }, 100)

      setState((prev) => ({
        ...prev,
        isRecording: true,
        error: null,
        duration: 0,
      }))
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to access microphone. Please check permissions.",
      }))
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop()
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = null
      }
    }
  }, [state.isRecording])

  const playAudio = useCallback(() => {
    if (state.audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      const audio = new Audio(state.audioUrl)
      audioRef.current = audio

      audio.onplay = () => {
        setState((prev) => ({ ...prev, isPlaying: true }))
      }

      audio.onended = () => {
        setState((prev) => ({ ...prev, isPlaying: false }))
      }

      audio.onerror = () => {
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          error: "Failed to play audio",
        }))
      }

      audio.play().catch((_error) => {
        setState((prev) => ({
          ...prev,
          error: "Failed to play audio",
        }))
      })
    }
  }, [state.audioUrl])

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setState((prev) => ({ ...prev, isPlaying: false }))
    }
  }, [])

  const clearRecording = useCallback(() => {
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl)
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setState({
      isRecording: false,
      isPlaying: false,
      audioBlob: null,
      audioUrl: null,
      duration: 0,
      error: null,
    })
  }, [state.audioUrl])

  return {
    ...state,
    startRecording,
    stopRecording,
    playAudio,
    stopAudio,
    clearRecording,
  }
}
