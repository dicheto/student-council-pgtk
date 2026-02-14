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

function printUsage() {
  console.log(
    [
      'Употреба:',
      '  npm run db:setup',
      '  npm run db:reset',
      '',
      'Нужно е да имаш Postgres connection string в .env.local като:',
      '  SUPABASE_DB_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?sslmode=require"',
      '',
      'Схема по подразбиране:',
      '  supabase/schema.sql',
    ].join('\n')
  )
}

const RESET_SQL = `
-- Dangerous: wipes app tables (public schema objects we create)
DO $$
BEGIN
  -- Triggers
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    EXECUTE 'DROP TRIGGER IF EXISTS update_users_updated_at ON public.users';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_news_updated_at') THEN
    EXECUTE 'DROP TRIGGER IF EXISTS update_news_updated_at ON public.news';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_events_updated_at') THEN
    EXECUTE 'DROP TRIGGER IF EXISTS update_events_updated_at ON public.events';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_custom_pages_updated_at') THEN
    EXECUTE 'DROP TRIGGER IF EXISTS update_custom_pages_updated_at ON public.custom_pages';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_links_updated_at') THEN
    EXECUTE 'DROP TRIGGER IF EXISTS update_links_updated_at ON public.links';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_team_members_updated_at') THEN
    EXECUTE 'DROP TRIGGER IF EXISTS update_team_members_updated_at ON public.team_members';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_site_settings_updated_at') THEN
    EXECUTE 'DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_gallery_albums_updated_at') THEN
    EXECUTE 'DROP TRIGGER IF EXISTS update_gallery_albums_updated_at ON public.gallery_albums';
  END IF;

  -- Function
  EXECUTE 'DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE';
END $$;

-- Tables (order matters because of FKs)
DROP TABLE IF EXISTS public.gallery_images CASCADE;
DROP TABLE IF EXISTS public.gallery_albums CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.links CASCADE;
DROP TABLE IF EXISTS public.custom_pages CASCADE;
DROP TABLE IF EXISTS public.discord_settings CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.news CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
`

async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'setup'
  const schemaPath =
    process.env.SUPABASE_SCHEMA_PATH ||
    path.join(rootDir, 'supabase', 'schema.sql')

  const dbUrl = getDbUrl()
  if (!dbUrl) {
    console.error('Липсва SUPABASE_DB_URL (или DATABASE_URL/POSTGRES_URL) в .env.local.')
    printUsage()
    process.exit(1)
  }

  const schemaSql = await fs.readFile(schemaPath, 'utf8')

  const { Client } = pg
  const client = new Client({
    connectionString: dbUrl,
    // Supabase изисква SSL. Ако URL има sslmode=require това обикновено е достатъчно,
    // но това прави връзката по-устойчива на Windows конфигурации.
    ssl: { rejectUnauthorized: false },
  })

  console.log(`Свързване към Supabase Postgres и изпълнение на: ${path.relative(rootDir, schemaPath)}`)
  await client.connect()

  try {
    if (command === 'reset') {
      if (process.env.I_UNDERSTAND_DB_RESET !== 'YES') {
        console.error(
          'Отказ: reset е разрушителен. За да продължиш, сложи I_UNDERSTAND_DB_RESET=YES в командата.'
        )
        process.exit(1)
      }
      console.log('Reset: изтриване на таблици/тригери…')
      await client.query(RESET_SQL)
    }

    console.log('Прилагане на схема…')
    await client.query(schemaSql)

    console.log('✅ Готово. Таблиците/политиките са приложени успешно.')
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error('❌ Грешка при настройка на базата:', err?.message || err)
  process.exit(1)
})

