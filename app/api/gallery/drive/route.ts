import { NextResponse } from 'next/server'
import { google } from 'googleapis'

// Mark as dynamic route
export const dynamic = 'force-dynamic'

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

function getDriveConfig() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

  if (!email || !key || !folderId) {
    return null // Return null instead of throwing error
  }

  // Частните ключове в .env обичайно имат \n вместо реални нови редове
  const normalizedKey = key.replace(/\\n/g, '\n')

  return { email, key: normalizedKey, folderId }
}

export async function GET() {
  try {
    const config = getDriveConfig()
    
    // If Google Drive is not configured, return empty array
    if (!config) {
      return NextResponse.json({ 
        files: [],
        configured: false,
        message: 'Google Drive integration is not configured'
      })
    }

    const { email, key, folderId } = config
    const auth = new google.auth.JWT(email, undefined, key, SCOPES)
    const drive = google.drive({ version: 'v3', auth })

    const { data } = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id,name,webViewLink,thumbnailLink,createdTime,description)',
      pageSize: 100,
    })

    const files =
      data.files?.map((file) => ({
        id: file.id,
        name: file.name,
        description: file.description,
        // thumbnailLink дава малко изображение, webViewLink – преглед в Google Drive
        thumbnailUrl: file.thumbnailLink,
        viewUrl: file.webViewLink,
        createdAt: file.createdTime,
      })) ?? []

    return NextResponse.json({ files, configured: true })
  } catch (error: any) {
    console.error('Error fetching Google Drive images:', error)
    return NextResponse.json(
      {
        files: [],
        configured: false,
        error: 'Failed to fetch images from Google Drive',
        details: error?.message ?? String(error),
      },
      { status: 200 } // Return 200 instead of 500 to avoid breaking the app
    )
  }
}

