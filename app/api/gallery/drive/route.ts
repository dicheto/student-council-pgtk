import { NextResponse } from 'next/server'
import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

function getDriveConfig() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

  if (!email || !key || !folderId) {
    throw new Error(
      'Google Drive не е конфигуриран. Задай GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY и GOOGLE_DRIVE_FOLDER_ID в .env.local'
    )
  }

  // Частните ключове в .env обичайно имат \n вместо реални нови редове
  const normalizedKey = key.replace(/\\n/g, '\n')

  return { email, key: normalizedKey, folderId }
}

export async function GET() {
  try {
    const { email, key, folderId } = getDriveConfig()

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

    return NextResponse.json({ files })
  } catch (error: any) {
    console.error('Error fetching Google Drive images:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch images from Google Drive',
        details: error?.message ?? String(error),
      },
      { status: 500 }
    )
  }
}

