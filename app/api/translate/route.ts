import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { text, targetLanguage, context } = await request.json()

    const languageNames = {
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      zh: "Chinese",
      ja: "Japanese",
      ko: "Korean",
      hi: "Hindi",
    }

    const targetLangName = languageNames[targetLanguage as keyof typeof languageNames] || "the target language"

    const systemPrompt = `You are a helpful translation assistant for children learning English. 
    
    Translate the given English text to ${targetLangName} in a way that's appropriate for children.
    
    Guidelines:
    - Use simple, clear language
    - Keep the friendly, encouraging tone
    - If it's an educational explanation, make it easy to understand
    - Maintain the context: ${context || "general conversation"}
    
    Only return the translation, nothing else.`

    const { text: translation } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      system: systemPrompt,
      prompt: text,
      maxTokens: 200,
      temperature: 0.3,
    })

    return Response.json({ translation })
  } catch (error) {
    console.error("Translation API error:", error)
    return Response.json({ error: "Failed to translate text" }, { status: 500 })
  }
}
