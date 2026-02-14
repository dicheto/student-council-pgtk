import { NextResponse } from 'next/server'

// Платени модели от OpenRouter за по-висока качество
const PAID_MODELS = [
  {
    id: 'openai/gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
  },
  {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
  },
  {
    id: 'meta-llama/llama-3-70b-instruct',
    name: 'Llama 3 70B',
    provider: 'Meta',
  },
  {
    id: 'google/gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
  },
]

// Безплатни модели от OpenRouter
const FREE_MODELS = [
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash Experimental (Free)',
    provider: 'Google',
    context: '1,048,576',
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B Instruct (Free)',
    provider: 'Meta',
    context: '131,072',
  },
  {
    id: 'meta-llama/llama-3.1-405b-instruct:free',
    name: 'Llama 3.1 405B Instruct (Free)',
    provider: 'Meta',
    context: '131,072',
  },
  {
    id: 'mistralai/mistral-small-3.1-24b-instruct:free',
    name: 'Mistral Small 3.1 24B (Free)',
    provider: 'Mistral',
    context: '128,000',
  },
  {
    id: 'google/gemma-3-27b-it:free',
    name: 'Gemma 3 27B (Free)',
    provider: 'Google',
    context: '131,072',
  },
  {
    id: 'qwen/qwen3-4b:free',
    name: 'Qwen3 4B (Free)',
    provider: 'Qwen',
    context: '40,960',
  },
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Llama 3.2 3B Instruct (Free)',
    provider: 'Meta',
    context: '131,072',
  },
]

export async function GET() {
  const hasOpenrouterKey = !!process.env.OPENROUTER_API_KEY
  const models = hasOpenrouterKey ? [...PAID_MODELS, ...FREE_MODELS] : FREE_MODELS
  return NextResponse.json({ models })
}
