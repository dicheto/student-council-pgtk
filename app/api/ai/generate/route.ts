import { NextRequest, NextResponse } from 'next/server'

// Безплатни модели от OpenRouter (най-добри първи)
const FREE_MODELS = [
  'google/gemini-2.0-flash-exp:free', // 1M context, най-добър
  'meta-llama/llama-3.3-70b-instruct:free', // 131K context, много добър
  'meta-llama/llama-3.1-405b-instruct:free', // 131K context, най-голям
  'mistralai/mistral-small-3.1-24b-instruct:free', // 128K context
  'google/gemma-3-27b-it:free', // 131K context
  'qwen/qwen3-4b:free', // 40K context, бърз
  'meta-llama/llama-3.2-3b-instruct:free', // 131K context, компактен
]

export async function POST(request: NextRequest) {
  try {
    const { title, locale = 'bg' } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY || ''
    const selectedModel = FREE_MODELS[0] // Use best free model

    // Create readable stream for streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': apiKey ? `Bearer ${apiKey}` : '',
              'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              'X-Title': 'Student Council Content Generator',
            },
            body: JSON.stringify({
              model: selectedModel,
              messages: [
                {
                  role: 'system',
                  content: locale === 'bg' 
                    ? 'Ти си професионален журналист и писател. Пишеш статии на български език за ученически съвет. Статиите трябва да са информативни, завладяващи и подходящи за ученици.'
                    : 'You are a professional journalist and writer. You write articles in English for a student council. Articles should be informative, engaging, and suitable for students.',
                },
                {
                  role: 'user',
                  content: locale === 'bg'
                    ? `Напиши пълна статия на български език със заглавие: "${title}". Статията трябва да бъде дълга поне 500 думи, добре структурирана с параграфи и подходяща за публикуване в уебсайт на ученически съвет.`
                    : `Write a full article in English with the title: "${title}". The article should be at least 500 words, well-structured with paragraphs and suitable for publication on a student council website.`,
                },
              ],
              max_tokens: 2000,
              temperature: 0.7,
              stream: true,
            }),
          })

          if (!response.ok) {
            throw new Error('Failed to generate content')
          }

          const reader = response.body?.getReader()
          const decoder = new TextDecoder()

          if (!reader) {
            throw new Error('No response body')
          }

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n').filter(line => line.trim() !== '')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  controller.close()
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content
                  if (content) {
                    controller.enqueue(encoder.encode(content))
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }

          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
