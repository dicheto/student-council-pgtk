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
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch protocols',
        message: error instanceof Error ? error.message : 'Unknown error',
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
