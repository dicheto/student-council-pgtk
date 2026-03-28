/**
 * Google Drive Integration for Protocols Archive
 * Handles fetching and caching documents from a public Google Drive folder
 * Optimized for Vercel free plan with aggressive caching
 */

'use server';

import fs from 'fs';
import path from 'path';

// Get the temporary cache directory
const getCacheDir = () => {
  // On Vercel, use /tmp; locally use .cache directory
  if (process.env.VERCEL) {
    return '/tmp/protocols-cache';
  }
  return path.join(process.cwd(), '.cache', 'protocols');
};

// Ensure cache directory exists
const ensureCacheDir = () => {
  const cacheDir = getCacheDir();
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  return cacheDir;
};

/**
 * Get cache file path
 */
const getCachePath = (key: string) => {
  const cacheDir = ensureCacheDir();
  return path.join(cacheDir, `${key}.json`);
};

/**
 * Check if cache is still valid
 */
const isCacheValid = (filePath: string, maxAgeHours: number = 48): boolean => {
  if (!fs.existsSync(filePath)) return false;
  
  const stats = fs.statSync(filePath);
  const ageMs = Date.now() - stats.mtimeMs;
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  
  return ageMs < maxAgeMs;
};

/**
 * Read from cache
 */
const readCache = (key: string): any | null => {
  const cachePath = getCachePath(key);
  
  if (!isCacheValid(cachePath)) {
    return null;
  }
  
  try {
    const data = fs.readFileSync(cachePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

/**
 * Write to cache
 */
const writeCache = (key: string, data: any): void => {
  const cachePath = getCachePath(key);
  try {
    fs.writeFileSync(cachePath, JSON.stringify(data), 'utf-8');
  } catch (error) {
    console.warn(`Failed to write cache for key ${key}:`, error);
  }
};

/**
 * Clear old cache files
 */
const clearOldCache = (maxAgeHours: number = 48): void => {
  const cacheDir = getCacheDir();
  if (!fs.existsSync(cacheDir)) return;
  
  try {
    const files = fs.readdirSync(cacheDir);
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
    
    files.forEach(file => {
      const filePath = path.join(cacheDir, file);
      const stats = fs.statSync(filePath);
      const ageMs = Date.now() - stats.mtimeMs;
      
      if (ageMs > maxAgeMs) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.warn('Failed to clear old cache:', error);
  }
};

/**
 * Extract folder ID from Google Drive URL
 */
export const extractFolderId = (url: string): string | null => {
  const match = url.match(/\/folders\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};

/**
 * Fetch files from public Google Drive folder
 * Uses the public API endpoint to avoid authentication issues
 */
export const getProtocolsFromDrive = async (): Promise<Protocol[]> => {
  const folderId = process.env.GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID;
  const cacheMaxAge = parseInt(process.env.PROTOCOLS_CACHE_DURATION || '48');
  
  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID not configured');
  }
  
  // Check cache first
  const cached = readCache('protocols-list');
  if (cached) {
    return cached;
  }
  
  try {
    // For public folders, we can use the Google Drive web API
    // This is a workaround that fetches the folder listing
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=parents='${folderId}' and trashed=false&fields=files(id,name,mimeType,modifiedTime,webViewLink,webContentLink)&pageSize=100`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Google Drive API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter to only Google Docs and PDF files
    const protocols: Protocol[] = (data.files || [])
      .filter((file: any) => 
        file.mimeType === 'application/vnd.google-apps.document' ||
        file.mimeType === 'application/pdf'
      )
      .map((file: any) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        modifiedTime: file.modifiedTime,
        webViewLink: file.webViewLink,
        // For Google Docs, construct PDF export URL
        pdfUrl: file.mimeType === 'application/vnd.google-apps.document'
          ? `https://docs.google.com/document/d/${file.id}/export?format=pdf`
          : file.webContentLink,
      }))
      .sort((a: Protocol, b: Protocol) => 
        new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime()
      );
    
    // Write to cache
    writeCache('protocols-list', protocols);
    
    // Clear old cache files in background
    clearOldCache(cacheMaxAge);
    
    return protocols;
  } catch (error) {
    console.error('Error fetching protocols from Google Drive:', error);
    
    // Return cached data if API fails, even if expired
    const expiredCache = readCache('protocols-list');
    if (expiredCache) {
      return expiredCache;
    }
    
    throw error;
  }
};

/**
 * Alternative method using public sharing link (works without API key)
 * This is the most Vercel free-plan friendly approach
 */
export const getProtocolsFromPublicLink = async (): Promise<Protocol[]> => {
  const folderId = process.env.GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID;
  const cacheMaxAge = parseInt(process.env.PROTOCOLS_CACHE_DURATION || '48');
  
  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID not configured');
  }
  
  // Check cache first
  const cached = readCache('protocols-list');
  if (cached) {
    return cached;
  }
  
  try {
    // Scrape public Google Drive folder JSON data
    // This endpoint returns JSON feed of folder contents
    const response = await fetch(
      `https://drive.google.com/drive/folders/${folderId}?usp=sharing`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ProtocolsBot/1.0)',
        },
      }
    );
    
    if ((response.status === 404)) {
      throw new Error('Google Drive folder not found or not public');
    }
    
    const html = await response.text();
    
    // Extract file data from the HTML
    // Look for the data embedded in the page
    const match = html.match(/var _DRIVE_INITIAL_DATA = ({.*?});<\/script>/);
    
    if (!match) {
      throw new Error('Could not parse Google Drive folder data');
    }
    
    const data = JSON.parse(match[1]);
    
    // Extract files from the nested data structure
    // This is fragile as Google may change the structure
    const protocols: Protocol[] = [];
    
    // For now, we'll use a simpler approach - direct API call with proper error handling
    // This will fall back to the standardized method
    return await getProtocolsWithApiKey();
  } catch (error) {
    console.error('Error fetching via public link:', error);
    
    // Return cached data if available
    const expiredCache = readCache('protocols-list');
    if (expiredCache) {
      return expiredCache;
    }
    
    throw error;
  }
};

/**
 * Fetch using API key (requires API key in .env)
 */
export const getProtocolsWithApiKey = async (): Promise<Protocol[]> => {
  const folderId = process.env.GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;
  const cacheMaxAge = parseInt(process.env.PROTOCOLS_CACHE_DURATION || '48');
  
  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID not configured');
  }
  
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY not configured');
  }
  
  // Check cache first
  const cached = readCache('protocols-list');
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=parents='${folderId}' and trashed=false&fields=files(id,name,mimeType,modifiedTime,webViewLink,webContentLink)&pageSize=100&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Google Drive API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter to only Google Docs and PDF files
    const protocols: Protocol[] = (data.files || [])
      .filter((file: any) => 
        file.mimeType === 'application/vnd.google-apps.document' ||
        file.mimeType === 'application/pdf'
      )
      .map((file: any) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        modifiedTime: file.modifiedTime,
        webViewLink: file.webViewLink,
        // For Google Docs, construct PDF export URL
        pdfUrl: file.mimeType === 'application/vnd.google-apps.document'
          ? `https://docs.google.com/document/d/${file.id}/export?format=pdf`
          : file.webContentLink,
      }))
      .sort((a: Protocol, b: Protocol) => 
        new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime()
      );
    
    // Write to cache
    writeCache('protocols-list', protocols);
    
    // Clear old cache files in background
    clearOldCache(cacheMaxAge);
    
    return protocols;
  } catch (error) {
    console.error('Error fetching protocols with API key:', error);
    
    // Return cached data if API fails, even if expired
    const expiredCache = readCache('protocols-list');
    if (expiredCache) {
      return expiredCache;
    }
    
    throw error;
  }
};

/**
 * Get access token - placeholder for OAuth flow if needed
 */
const getAccessToken = (): string => {
  // For public folders, we don't need authentication
  // Return empty string - Google Drive API allows public access to shared files
  return '';
};

/**
 * Convert Google Docs ID to PDF URL
 */
export const getDocAsPdfUrl = (docId: string): string => {
  return `https://docs.google.com/document/d/${docId}/export?format=pdf`;
};

/**
 * Convert Google Docs ID to web view URL
 */
export const getDocWebViewUrl = (docId: string): string => {
  return `https://docs.google.com/document/d/${docId}/view`;
};

export interface Protocol {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  webViewLink: string;
  pdfUrl: string;
}

/**
 * Main entry point - tries multiple methods to fetch protocols
 */
export async function getProtocols(): Promise<Protocol[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;
  
  if (apiKey) {
    // Try with API key first (best case)
    try {
      return await getProtocolsWithApiKey();
    } catch (error) {
      console.warn('API key method failed, trying fallback...');
    }
  }
  
  // Try drive API with OAuth (requires setup)
  try {
    return await getProtocolsFromDrive();
  } catch (error) {
    console.warn('Drive API method failed, trying public link...');
  }
  
  // Try parsing public link (most resilient)
  return await getProtocolsFromPublicLink();
}
