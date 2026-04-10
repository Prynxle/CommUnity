import { NextResponse } from 'next/server'
import { generateRAGResponse } from '../../../../backend/services/ragService'

/**
 * POST /api/chat/rag
 * Generate RAG response for chatbot using Gemini Flash
 */
export async function POST(request) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check for API key
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.warn('GOOGLE_AI_API_KEY not configured')
      return NextResponse.json({
        text: "Chat service is temporarily unavailable. Please try again later.",
        sources: []
      })
    }

    const response = await generateRAGResponse(message.trim())

    return NextResponse.json(response)

  } catch (error) {
    console.error('[RAG API] Error:', error)
    return NextResponse.json(
      {
        text: "I'm having trouble processing your request. Please try again.",
        sources: []
      },
      { status: 500 }
    )
  }
}