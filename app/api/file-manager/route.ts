import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs/promises'
import * as path from 'path'
import { existsSync } from 'fs'

// Independent auth check - works in Route Handler context
async function checkAuth(request: NextRequest): Promise<{ authorized: boolean; user?: any }> {
  try {
    // Create Supabase client for Route Handler
    const { createServerClient } = await import('@supabase/ssr')
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll().map(cookie => ({
              name: cookie.name,
              value: cookie.value,
            }))
          },
          setAll(cookiesToSet) {
            // In Route Handler, we can't set cookies directly
            // This is fine for read-only operations
          },
        },
      }
    )
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      // Fallback to emergency token
      const authHeader = request.headers.get('authorization')
      const emergencyToken = process.env.FILE_MANAGER_EMERGENCY_TOKEN
      
      if (emergencyToken && authHeader === `Bearer ${emergencyToken}`) {
        return { authorized: true }
      }
      
      return { authorized: false }
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile || profile.role !== 'admin') {
      return { authorized: false }
    }

    return { authorized: true, user }
  } catch (error: any) {
    console.error('Auth check error:', error)
    
    // If Supabase fails, check for emergency access token
    const authHeader = request.headers.get('authorization')
    const emergencyToken = process.env.FILE_MANAGER_EMERGENCY_TOKEN
    
    if (emergencyToken && authHeader === `Bearer ${emergencyToken}`) {
      return { authorized: true }
    }
    
    return { authorized: false }
  }
}

// Security: Only allow access to project directory
const PROJECT_ROOT = process.cwd()
const ALLOWED_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.md', '.txt',
  '.html', '.xml', '.yml', '.yaml', '.env', '.env.local', '.env.example'
]

// Blocked directories for security
const BLOCKED_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  '.cache'
]

function isPathSafe(filePath: string): boolean {
  const resolved = path.resolve(PROJECT_ROOT, filePath)
  const relative = path.relative(PROJECT_ROOT, resolved)
  
  // Prevent directory traversal
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return false
  }
  
  // Check if path contains blocked directories
  const parts = relative.split(path.sep)
  if (parts.some(part => BLOCKED_DIRS.includes(part))) {
    return false
  }
  
  return true
}

function getFileExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase()
}

// GET - List files and directories
export async function GET(request: NextRequest) {
  try {
    // Check authentication (independent of main app)
    const auth = await checkAuth(request)
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in as admin or use emergency token.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const dirPath = searchParams.get('path') || ''

    if (!isPathSafe(dirPath)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const fullPath = path.join(PROJECT_ROOT, dirPath)
    
    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'Path does not exist' }, { status: 404 })
    }

    const stats = await fs.stat(fullPath)
    
    if (stats.isFile()) {
      // Return file content
      const content = await fs.readFile(fullPath, 'utf-8')
      return NextResponse.json({
        type: 'file',
        path: dirPath,
        content,
        size: stats.size,
        modified: stats.mtime.toISOString(),
      })
    } else {
      // Return directory listing
      const entries = await fs.readdir(fullPath, { withFileTypes: true })
      const items = await Promise.all(
        entries
          .filter(entry => {
            // Filter out blocked directories
            if (entry.isDirectory() && BLOCKED_DIRS.includes(entry.name)) {
              return false
            }
            return true
          })
          .map(async (entry) => {
            const entryPath = path.join(fullPath, entry.name)
            const relativePath = path.join(dirPath, entry.name).replace(/\\/g, '/')
            const stats = await fs.stat(entryPath)
            
            return {
              name: entry.name,
              path: relativePath,
              type: entry.isDirectory() ? 'directory' : 'file',
              size: stats.size,
              modified: stats.mtime.toISOString(),
              extension: entry.isFile() ? getFileExtension(entry.name) : null,
            }
          })
      )

      return NextResponse.json({
        type: 'directory',
        path: dirPath,
        items: items.sort((a, b) => {
          // Directories first, then files
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1
          }
          return a.name.localeCompare(b.name)
        }),
      })
    }
  } catch (error: any) {
    console.error('File manager error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create file or directory
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { action, path: filePath, content, name } = body

    if (!isPathSafe(filePath)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const fullPath = path.join(PROJECT_ROOT, filePath)

    switch (action) {
      case 'create_file': {
        const newFilePath = path.join(fullPath, name)
        if (!isPathSafe(path.relative(PROJECT_ROOT, newFilePath))) {
          return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
        }
        
        const ext = getFileExtension(name)
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          return NextResponse.json({ error: 'File extension not allowed' }, { status: 400 })
        }

        await fs.writeFile(newFilePath, content || '', 'utf-8')
        return NextResponse.json({ success: true, path: path.join(filePath, name).replace(/\\/g, '/') })
      }

      case 'create_directory': {
        const newDirPath = path.join(fullPath, name)
        if (!isPathSafe(path.relative(PROJECT_ROOT, newDirPath))) {
          return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
        }
        
        await fs.mkdir(newDirPath, { recursive: true })
        return NextResponse.json({ success: true, path: path.join(filePath, name).replace(/\\/g, '/') })
      }

      case 'save_file': {
        if (!isPathSafe(filePath)) {
          return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
        }
        
        const ext = getFileExtension(filePath)
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          return NextResponse.json({ error: 'File extension not allowed' }, { status: 400 })
        }

        await fs.writeFile(fullPath, content || '', 'utf-8')
        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('File manager error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete file or directory
export async function DELETE(request: NextRequest) {
  try {
    const auth = await checkAuth(request)
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')

    if (!filePath || !isPathSafe(filePath)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const fullPath = path.join(PROJECT_ROOT, filePath)
    
    // Prevent deletion of critical files
    const criticalFiles = [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.ts',
      '.env.local',
    ]
    
    if (criticalFiles.some(file => filePath.includes(file))) {
      return NextResponse.json({ error: 'Cannot delete critical files' }, { status: 400 })
    }

    const stats = await fs.stat(fullPath)
    
    if (stats.isDirectory()) {
      await fs.rmdir(fullPath, { recursive: true })
    } else {
      await fs.unlink(fullPath)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('File manager error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
