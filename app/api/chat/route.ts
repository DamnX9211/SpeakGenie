import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { message, mode = "freeflow", scenario } = await request.json()

    let systemPrompt = `You are SpeakGenie, a friendly AI tutor helping children learn English through conversation. 
    
Key guidelines:
- Use simple, clear language appropriate for children
- Be encouraging and positive
- Ask follow-up questions to keep the conversation going
- Correct mistakes gently by repeating the correct form naturally
- Keep responses conversational and engaging
- Limit responses to 2-3 sentences to maintain attention`

    if (mode === "roleplay" && scenario) {
      const scenarioPrompts = {
        school: `You're helping practice school conversations. Act as a teacher, classmate, or school staff member. Focus on classroom interactions, asking questions, and school-related topics.`,
        store: `You're helping practice store/shopping conversations. Act as a store clerk or helpful customer. Focus on asking for help, making purchases, and polite interactions.`,
        home: `You're helping practice home conversations. Act as a family member or friend. Focus on casual conversations, daily activities, and family interactions.`,
      }
      systemPrompt += `\n\nRoleplay Context: ${scenarioPrompts[scenario as keyof typeof scenarioPrompts] || ""}`
    }

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      system: systemPrompt,
      prompt: message,
      maxTokens: 150,
      temperature: 0.7,
    })

    return Response.json({ response: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
