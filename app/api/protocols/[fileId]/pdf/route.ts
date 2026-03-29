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
    
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    let pdfBuffer: ArrayBuffer | null = null;
    let contentType: string | null = null;

    if (serviceAccountJson) {
      try {
        const credentials = JSON.parse(serviceAccountJson);
        const { google } = await import('googleapis');
        const auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });

        const drive = google.drive({ version: 'v3', auth });

        if (protocol.mimeType === 'application/vnd.google-apps.document') {
          const exportResponse = await drive.files.export(
            { fileId, mimeType: 'application/pdf' },
            { responseType: 'arraybuffer' }
          );

          pdfBuffer = exportResponse.data as ArrayBuffer;
          contentType = 'application/pdf';
        } else if (protocol.mimeType === 'application/pdf') {
          const getResponse = await drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'arraybuffer' }
          );

          pdfBuffer = getResponse.data as ArrayBuffer;
          contentType = 'application/pdf';
        } else {
          console.error(`Unsupported mimeType: ${protocol.mimeType}`);
          return NextResponse.json(
            { error: 'Unsupported file type for PDF conversion' },
            { status: 400 }
          );
        }
      } catch (serviceError) {
        console.error('Service account PDF fetch failed:', serviceError);
        // Fallback to public URL behavior if service account fails
      }
    }

    if (!pdfBuffer) {
      // Fallback to public URL fetch to support non-routed access if service account is unavailable.
      let pdfUrl: string;
      if (protocol.mimeType === 'application/vnd.google-apps.document') {
        pdfUrl = `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
      } else if (protocol.mimeType === 'application/pdf') {
        pdfUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      } else {
        return NextResponse.json(
          { error: 'Unsupported file type for PDF conversion' },
          { status: 400 }
        );
      }

      const pdfResponse = await fetch(pdfUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ProtocolsBot/1.0)',
          'Accept': 'application/pdf,*/*',
        },
      });

      if (!pdfResponse.ok) {
        const errorText = await pdfResponse.text();
        return NextResponse.json(
          { error: 'Failed to fetch PDF from Google Drive', status: pdfResponse.status, details: errorText },
          { status: 500 }
        );
      }

      contentType = pdfResponse.headers.get('content-type');
      if (!contentType?.includes('application/pdf')) {
        const errorText = await pdfResponse.text();
        return NextResponse.json(
          { error: 'Google Drive returned unexpected content type', contentType, details: errorText },
          { status: 500 }
        );
      }

      pdfBuffer = await pdfResponse.arrayBuffer();
    }

    // Ensure we have binary data
    if (!pdfBuffer) {
      return NextResponse.json(
        { error: 'Failed to retrieve PDF content' },
        { status: 500 }
      );
    }

    // Build safe content disposition header for UTF-8 names
    const rawFileName = `${protocol.name}.pdf`.replace(/"/g, '');
    const encodedFileName = encodeURIComponent(rawFileName).replace(/['()]/g, escape);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${rawFileName}"; filename*=UTF-8''${encodedFileName}`,
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
