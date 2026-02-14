// lib/actions/storage.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function uploadFile(
  file: Buffer,
  fileName: string,
  bucket: 'news-images' | 'event-images'
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Unauthorized' }
    }

    const filePath = `${user.id}/${Date.now()}-${fileName}`

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: 'image/*',
        upsert: false,
      })

    if (error) {
      return { error: error.message }
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath)

    return { url: publicUrl, success: true }
  } catch (error) {
    return { error: String(error) }
  }
}

export async function deleteFile(filePath: string, bucket: 'news-images' | 'event-images') {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Unauthorized' }
    }

    const { error } = await supabaseAdmin.storage.from(bucket).remove([filePath])

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { error: String(error) }
  }
}
