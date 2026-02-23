import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import pg from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

dotenv.config({ path: path.join(rootDir, '.env.local') })

function getDbUrl() {
  return (
    process.env.SUPABASE_DB_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    ''
  )
}

async function main() {
  const dbUrl = getDbUrl()
  if (!dbUrl) {
    console.error('❌ Липсва SUPABASE_DB_URL в .env.local')
    process.exit(1)
  }

  const { Client } = pg
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  })

  console.log('🔗 Свързване към Supabase Postgres…')
  await client.connect()

  try {
    console.log('🗑️  Очистване на календара…')
    
    // Delete all timeline milestones
    await client.query('DELETE FROM public.timeline_milestones')
    
    // Re-insert only the new calendar events
    const migrationSql = `
    INSERT INTO public.timeline_milestones (title, description, month, year, icon, color, is_highlighted, display_order)
    VALUES
      (
        '{"bg": "Свети Валентин / Трифон Зарезан", "en": "Saint Valentine''s Day / Trifon Zarezzan Day"}'::jsonb,
        '{"bg": "Честване на любовта и традиционния ден на винарите - Трифон Зарезан.", "en": "Celebration of love and the traditional day of winemakers - Trifon Zarezzan."}'::jsonb,
        'Февруари',
        '2025',
        'Heart',
        'from-pink-500 to-rose-500',
        false,
        1
      ),
      (
        '{"bg": "Ден без насилие", "en": "Day Without Violence"}'::jsonb,
        '{"bg": "Каминия за наличието на насилие и насърчаване на мирна и безопасна среда в училище.", "en": "Campaign to raise awareness about violence and promote a peaceful and safe school environment."}'::jsonb,
        'Февруари',
        '2025',
        'Sparkles',
        'from-blue-500 to-cyan-500',
        false,
        2
      ),
      (
        '{"bg": "Баба Марта", "en": "Grandma Marta Day"}'::jsonb,
        '{"bg": "Традиционен празник, начало на пролетта и разпространение на брателки (мартеници).", "en": "Traditional celebration marking the arrival of spring and the exchange of martenitsas."}'::jsonb,
        'Март',
        '2025',
        'Sparkles',
        'from-red-500 to-yellow-500',
        false,
        3
      ),
      (
        '{"bg": "Ден на Освобождението", "en": "Liberation Day"}'::jsonb,
        '{"bg": "Народен празник, честване на освобождението на България от османско владичество.", "en": "National holiday celebrating Bulgaria''s liberation from Ottoman rule."}'::jsonb,
        'Март',
        '2025',
        'Flag',
        'from-red-500 to-white',
        true,
        4
      ),
      (
        '{"bg": "Ден на жената", "en": "International Women''s Day"}'::jsonb,
        '{"bg": "Международен ден за честване на жените и техния принос в обществото.", "en": "International day celebrating women and their contributions to society."}'::jsonb,
        'Март',
        '2025',
        'Heart',
        'from-purple-500 to-pink-500',
        false,
        5
      ),
      (
        '{"bg": "Великденски базар", "en": "Easter Bazaar"}'::jsonb,
        '{"bg": "Традиционен базар с ръчно изработени пасхални украшения, писанки и деликатеси.", "en": "Traditional bazaar featuring handmade Easter decorations, painted eggs, and delicacies."}'::jsonb,
        'Април',
        '2025',
        'PartyPopper',
        'from-yellow-500 to-orange-500',
        true,
        6
      ),
      (
        '{"bg": "Ден на земята", "en": "Earth Day"}'::jsonb,
        '{"bg": "Международен ден за защита на окръжающата среда и насърчаване на екологичны дейности.", "en": "International day for environmental protection and promotion of ecological initiatives."}'::jsonb,
        'Април',
        '2025',
        'Zap',
        'from-green-500 to-emerald-500',
        false,
        7
      ),
      (
        '{"bg": "Ден на народните будители", "en": "Day of Bulgarian Enlighteners"}'::jsonb,
        '{"bg": "Честване на великите български просветители и техния вклад в развитието на нацията.", "en": "Celebration of great Bulgarian enlighteners and their contribution to national development."}'::jsonb,
        'Май',
        '2025',
        'Star',
        'from-blue-500 to-indigo-500',
        false,
        8
      ),
      (
        '{"bg": "Посрещане на новата учебна година", "en": "Welcome to the New School Year"}'::jsonb,
        '{"bg": "Официално comenzване на новата учебна година с приветствие от ученическия съвет.", "en": "Official start of the new school year with greetings and welcome events from the student council."}'::jsonb,
        'Септември',
        '2025',
        'GraduationCap',
        'from-blue-500 to-cyan-500',
        true,
        9
      ),
      (
        '{"bg": "Коледен базар", "en": "Christmas Bazaar"}'::jsonb,
        '{"bg": "Tradicиен коледен базар със сладки, подаръци и коледно настроение.", "en": "Traditional Christmas bazaar with treats, gifts and festive holiday atmosphere."}'::jsonb,
        'Декември',
        '2025',
        'Sparkles',
        'from-green-500 to-emerald-500',
        true,
        10
      );
    `
    
    await client.query(migrationSql)
    
    console.log('✅ Календарът е очистен и преинициализиран успешно!')
  } catch (error) {
    console.error('❌ Грешка при очистване на календара:', error?.message || error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
