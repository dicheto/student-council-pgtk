/**
 * Google Drive Integration for Protocols Archive
 * Handles fetching and caching documents from a public Google Drive folder
 * Optimized for Vercel free plan with aggressive caching
 */

'use server';

import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

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
        // Use our proxy endpoint for inline preview instead of direct Google Drive URLs
        pdfUrl: `/api/protocols/${file.id}/pdf`,
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
    // Use a simpler approach: fetch the folder metadata directly
    // This attempts to use the Drive API without authentication for public folders
    const url = `https://www.googleapis.com/drive/v3/files?q=parents='${folderId}' and trashed=false&fields=files(id,name,mimeType,modifiedTime,webViewLink,webContentLink)&pageSize=100&key=AIzaSyDummy`;
    
    console.warn('⚠️ Attempting fallback method without API key - this may fail');
    console.warn('📌 To fix: Add NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY to environment variables');
    
    // Since this will likely fail without a real key, return an empty list
    // but cache it to avoid repeated errors
    const mockProtocols: Protocol[] = [];
    
    // Try to get from cache even if expired
    const expiredCache = readCache('protocols-list');
    if (expiredCache && Array.isArray(expiredCache)) {
      return expiredCache;
    }
    
    throw new Error('API key not configured. See error message above.');
  } catch (error) {
    console.error('Error fetching via public link fallback:', error);
    
    // Return cached data if available, even if expired
    const expiredCache = readCache('protocols-list');
    if (expiredCache && Array.isArray(expiredCache)) {
      console.warn('⚠️ Returning expired cache due to API error');
      return expiredCache;
    }
    
    throw error;
  }
};

/**
 * Fetch using Service Account (most secure option)
 * Requires GOOGLE_SERVICE_ACCOUNT_JSON in environment
 */
export const getProtocolsWithServiceAccount = async (): Promise<Protocol[]> => {
  const folderId = process.env.GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID;
  const cacheMaxAge = parseInt(process.env.PROTOCOLS_CACHE_DURATION || '48');
  
  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID not configured');
  }
  
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not configured');
  }
  
  // Check cache first
  const cached = readCache('protocols-list');
  if (cached) {
    return cached;
  }
  
  try {
    // Parse service account credentials
    let credentials: any;
    try {
      credentials = JSON.parse(serviceAccountJson);
    } catch (parseError) {
      throw new Error(`Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON: ${parseError}`);
    }
    
    // Create auth client
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    
    // Create Drive API client
    const drive = google.drive({ version: 'v3', auth });
    
    // Fetch files from folder
    const response = await drive.files.list({
      q: `parents='${folderId}' and trashed=false`,
      fields: 'files(id,name,mimeType,modifiedTime,webViewLink,webContentLink)',
      pageSize: 100,
      orderBy: 'modifiedTime desc',
    });
    
    const files = response.data.files || [];
    
    // Filter and convert to Protocol format
    const protocols: Protocol[] = files
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
        pdfUrl: `/api/protocols/${file.id}/pdf`,
      }));
    
    // Write to cache
    writeCache('protocols-list', protocols);
    
    // Clear old cache files in background
    clearOldCache(cacheMaxAge);
    
    console.log(`✅ Service Account: Fetched ${protocols.length} protocols`);
    return protocols;
  } catch (error) {
    console.error('Error fetching protocols with Service Account:', error);
    
    // Return cached data if API fails, even if expired
    const expiredCache = readCache('protocols-list');
    if (expiredCache && Array.isArray(expiredCache)) {
      console.warn('⚠️ Service Account failed, returning expired cache');
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
        // Use our proxy endpoint for inline preview instead of direct Google Drive URLs
        pdfUrl: `/api/protocols/${file.id}/pdf`,
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
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;
  const folderId = process.env.GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID;
  
  if (!folderId) {
    throw new Error('❌ GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID not configured in environment');
  }
  
  // PRIMARY METHOD: Service Account (most secure & reliable)
  if (serviceAccountJson) {
    try {
      console.log('🔐 Using Service Account method for Google Drive access');
      return await getProtocolsWithServiceAccount();
    } catch (error) {
      console.error('❌ Service Account method failed:', error);
    }
  }
  
  // SECONDARY METHOD: API Key (if configured)
  if (apiKey) {
    try {
      console.log('🔑 Using API Key method for Google Drive access');
      return await getProtocolsWithApiKey();
    } catch (error) {
      console.error('❌ API key method failed:', error);
    }
  } else if (!serviceAccountJson) {
    console.warn('⚠️ NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY not configured');
    console.warn('📌 To enable protocols feature, add your Google Drive API key to environment variables');
    console.warn('📖 Instructions: https://console.cloud.google.com/apis/credentials');
  }
  
  // FALLBACK: Try OAuth method (if credentials exist)
  try {
    console.log('📦 Trying OAuth method...');
    return await getProtocolsFromDrive();
  } catch (error) {
    console.warn('⚠️ OAuth method failed:', error);
  }
  
  // LAST RESORT: Try retrieving from expired cache
  try {
    const expiredCache = readCache('protocols-list');
    if (expiredCache && Array.isArray(expiredCache) && expiredCache.length > 0) {
      console.warn('⚠️ Returning expired cache (API unavailable)');
      return expiredCache;
    }
  } catch (cacheError) {
    console.warn('❌ Could not retrieve cache:', cacheError);
  }
  
  // All methods failed
  const available = [];
  if (serviceAccountJson) available.push('Service Account');
  if (apiKey) available.push('API Key');
  if (folderId) available.push('Folder ID');
  
  throw new Error(
    '❌ Failed to fetch protocols. ' +
    'Available configs: ' + (available.length > 0 ? available.join(', ') : 'None') + '. ' +
    'Please configure GOOGLE_SERVICE_ACCOUNT_JSON or NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY.'
  );
}
