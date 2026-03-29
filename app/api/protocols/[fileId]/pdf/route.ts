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
    let protocols: any[] = [];
    try {
      protocols = await getProtocols();
    } catch (error) {
      console.error('Failed to fetch protocols list:', error);
      return NextResponse.json(
        { error: 'Failed to load protocols list', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
    
    const protocol = protocols.find(p => p.id === fileId);
    
    if (!protocol) {
      console.error(`Protocol with ID ${fileId} not found in protocols list`);
      return NextResponse.json(
        { error: 'Protocol not found' },
        { status: 404 }
      );
    }
    
    // Get the PDF URL - prefer googleDriveUrl, fallback to constructing from file ID
    let pdfUrl = protocol.googleDriveUrl;
    
    if (!pdfUrl) {
      // Fallback: construct URL based on mimeType
      if (protocol.mimeType === 'application/vnd.google-apps.document') {
        pdfUrl = `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
      } else if (protocol.mimeType === 'application/pdf') {
        // For PDF files, use public download URL
        pdfUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }
    
    if (!pdfUrl) {
      console.error(`No PDF URL available for protocol ${fileId}`);
      return NextResponse.json(
        { error: 'PDF URL not available for this protocol' },
        { status: 400 }
      );
    }
    
    console.log(`Fetching PDF for protocol ${fileId}: ${protocol.name}`);
    console.log(`PDF URL: ${pdfUrl}`);
    
    // Fetch the PDF from Google Drive
    const pdfResponse = await fetch(pdfUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProtocolsBot/1.0)',
        'Accept': 'application/pdf,*/*',
      },
    });
    
    console.log(`Google Drive response status: ${pdfResponse.status}`);
    console.log(`Content-Type: ${pdfResponse.headers.get('content-type')}`);
    
    if (!pdfResponse.ok) {
      console.error(`Failed to fetch PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
      const errorText = await pdfResponse.text();
      console.error(`Error response:`, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch PDF from Google Drive', status: pdfResponse.status, details: errorText },
        { status: 500 }
      );
    }
    
    // Check if response is actually a PDF
    const contentType = pdfResponse.headers.get('content-type');
    if (!contentType?.includes('application/pdf')) {
      console.error(`Unexpected content type: ${contentType}`);
      const errorText = await pdfResponse.text();
      console.error(`Response content:`, errorText);
      return NextResponse.json(
        { error: 'Google Drive returned unexpected content type', contentType, details: errorText },
        { status: 500 }
      );
    }
    
    // Get the PDF content
    const pdfBuffer = await pdfResponse.arrayBuffer();
    
    // Return as PDF with proper headers for inline display
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${protocol.name}.pdf"`,
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
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
