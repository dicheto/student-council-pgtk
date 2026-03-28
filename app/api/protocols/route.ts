/**
 * API Route: GET /api/protocols
 * Returns list of available protocols with caching
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProtocols } from '@/lib/google-drive';

// Cache configuration for Next.js
export const revalidate = 43200; // 12 hours (ISR)

export async function GET(request: NextRequest) {
  try {
    // Check if protocols feature is enabled
    if (process.env.NEXT_PUBLIC_ENABLE_PROTOCOLS !== 'true') {
      return NextResponse.json(
        { error: 'Protocols feature is disabled' },
        { status: 404 }
      );
    }
    
    // Fetch protocols with built-in caching
    const protocols = await getProtocols();
    
    return NextResponse.json(
      {
        success: true,
        data: protocols,
        count: protocols.length,
        cached: true,
        cachedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400', // 12h cache, 24h stale
          'CDN-Cache-Control': 'max-age=43200',
        },
      }
    );
  } catch (error) {
    console.error('Error in /api/protocols:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Provide helpful error messages
    let helpMessage = '';
    if (errorMessage.includes('API key') || errorMessage.includes('NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY')) {
      helpMessage = 'Please add NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY to your Vercel environment variables. Get it from: https://console.cloud.google.com/apis/credentials';
    } else if (errorMessage.includes('GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID')) {
      helpMessage = 'Please ensure GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID is set in environment variables.';
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch protocols',
        message: errorMessage,
        help: helpMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
