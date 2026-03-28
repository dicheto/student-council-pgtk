/**
 * API Route: GET /api/protocols/[fileId]/pdf
 * Proxies PDF preview of a protocol document
 * Converts Google Docs to PDF and serves the file
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProtocols, getDocAsPdfUrl } from '@/lib/google-drive';

// Cache for long time - PDFs don't change often
export const revalidate = 86400; // 24 hours (ISR)

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId;
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }
    
    // Verify the file exists in our protocol list (security check)
    const protocols = await getProtocols();
    const protocol = protocols.find(p => p.id === fileId);
    
    if (!protocol) {
      return NextResponse.json(
        { error: 'Protocol not found' },
        { status: 404 }
      );
    }
    
    // Get the PDF URL
    const pdfUrl = protocol.pdfUrl;
    
    if (!pdfUrl) {
      return NextResponse.json(
        { error: 'PDF URL not available' },
        { status: 400 }
      );
    }
    
    // Fetch the PDF from Google Drive
    const pdfResponse = await fetch(pdfUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProtocolsBot/1.0)',
      },
    });
    
    if (!pdfResponse.ok) {
      console.error(`Failed to fetch PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
      return NextResponse.json(
        { error: 'Failed to fetch PDF from Google Drive' },
        { status: 500 }
      );
    }
    
    // Get the PDF content
    const pdfBuffer = await pdfResponse.arrayBuffer();
    
    // Return as PDF with proper headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${protocol.name}.pdf"`,
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800', // 24h cache, 7d stale
        'CDN-Cache-Control': 'max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error in /api/protocols/[fileId]/pdf:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate PDF preview',
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
