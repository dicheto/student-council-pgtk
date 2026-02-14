import { NextRequest, NextResponse } from 'next/server'

// Openrouter paid models for better quality
const PAID_MODELS = [
  'openai/gpt-4',
  'openai/gpt-4-turbo',
  'anthropic/claude-3-opus',
  'anthropic/claude-3-sonnet',
  'meta-llama/llama-3-70b-instruct',
  'google/gemini-pro',
]

// Openrouter free models as fallback
const FREE_MODELS = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'google/gemma-2-2b-it:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'qwen/qwen-2-1.5b-instruct:free',
]

export async function POST(request: NextRequest) {
  try {
    const { title, model } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Use Openrouter - prefer paid models if API key is available, otherwise use free models
    const hasOpenrouterKey = !!process.env.OPENROUTER_API_KEY
    const selectedModel = model || (hasOpenrouterKey ? PAID_MODELS[0] : FREE_MODELS[0])

    // Always use Openrouter
    const endpoint = 'https://openrouter.ai/api/v1/chat/completions'
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || ''}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'Student Council Content Generator',
    }

    const body: Record<string, any> = {
      messages: [
        {
          role: 'system',
          content: 'You are a professional news writer for a school student council. Write engaging, informative, and well-structured news articles. Keep content appropriate for school audience. Write in the same language as the title.',
        },
        {
          role: 'user',
          content: `Write a news article with the title: "${title}". Make it engaging and suitable for a school student council website. Include 3-5 paragraphs.`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
      model: selectedModel,
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('AI API error:', error)
      return NextResponse.json(
        { error: error.error?.message || error.error || 'Failed to generate content' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''

    if (!content) {
      return NextResponse.json(
        { error: 'No content generated' },
        { status: 500 }
      )
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
