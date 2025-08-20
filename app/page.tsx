"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatInterface } from "@/components/chat-interface"
import { Mic, MessageCircle, Users, Home, Store, GraduationCap } from "lucide-react"

type AppMode = "home" | "freeflow" | "roleplay"
type RoleplayScenario = "school" | "store" | "home"

export default function SpeakGenie() {
  const [currentMode, setCurrentMode] = useState<AppMode>("home")
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario | null>(null)

  const roleplayScenarios = [
    {
      id: "school" as RoleplayScenario,
      title: "At School",
      description: "Practice conversations with teachers and classmates",
      icon: GraduationCap,
    },
    {
      id: "store" as RoleplayScenario,
      title: "At the Store",
      description: "Learn to ask for help and make purchases",
      icon: Store,
    },
    {
      id: "home" as RoleplayScenario,
      title: "At Home",
      description: "Talk with family and friends",
      icon: Home,
    },
  ]

  const renderHome = () => (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Mic className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">SpeakGenie</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your AI friend for learning English! Practice speaking with fun conversations and roleplay adventures.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentMode("freeflow")}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Free Chat</CardTitle>
              <CardDescription>
                Talk about anything you want! Ask questions, tell stories, or just have a friendly conversation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Start Chatting
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentMode("roleplay")}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl">Roleplay Adventures</CardTitle>
              <CardDescription>
                Practice real-life situations with guided conversations and helpful prompts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" variant="secondary">
                Choose Adventure
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">What makes SpeakGenie special?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <Mic className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Voice Practice</h3>
              <p className="text-sm text-muted-foreground">Speak naturally and get instant feedback</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Smart AI Tutor</h3>
              <p className="text-sm text-muted-foreground">Personalized conversations that adapt to you</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Fun Scenarios</h3>
              <p className="text-sm text-muted-foreground">Practice real-world conversations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderRoleplaySelection = () => (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => setCurrentMode("home")}>
            ← Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Choose Your Adventure!</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roleplayScenarios.map((scenario) => {
            const IconComponent = scenario.icon
            return (
              <Card
                key={scenario.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedScenario(scenario.id)}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle>{scenario.title}</CardTitle>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-transparent" variant="outline">
                    Start Adventure
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )

  if (currentMode === "freeflow") {
    return (
      <ChatInterface
        title="Free Chat Mode"
        description="Talk about anything you want with your AI friend!"
        mode="freeflow"
        onBack={() => setCurrentMode("home")}
      />
    )
  }

  if (currentMode === "roleplay") {
    if (selectedScenario) {
      const scenario = roleplayScenarios.find((s) => s.id === selectedScenario)
      return (
        <ChatInterface
          title={scenario?.title || "Roleplay"}
          description={scenario?.description || "Practice real-life conversations"}
          mode="roleplay"
          scenario={selectedScenario}
          onBack={() => setSelectedScenario(null)}
        />
      )
    }
    return renderRoleplaySelection()
  }

  return renderHome()
}
