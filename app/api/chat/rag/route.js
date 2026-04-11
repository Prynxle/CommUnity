import { NextResponse } from 'next/server'
import { generateAssistantResponse } from '../../../../backend/services/ragService'
import { checkRateLimit, getClientIp } from '../../../../lib/rateLimit'

/**
 * POST /api/chat/rag
 * Deterministic assistant response (no external AI required).
 */
export async function POST(request) {
  try {
    const ip = getClientIp(request)
    if (!checkRateLimit(`chat-rag:${ip}`, { limit: 80, windowMs: 60 * 1000 })) {
      return NextResponse.json(
        { error: 'Too many messages. Please wait a moment.' },
        { status: 429 }
      )
    }

    const { message } = await request.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const response = await generateAssistantResponse(message.trim())

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