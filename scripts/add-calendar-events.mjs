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

  const sqlPath = path.join(rootDir, 'supabase', 'migration_calendar_events.sql')
  const migrationSql = await fs.readFile(sqlPath, 'utf8')

  const { Client } = pg
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  })

  console.log('🔗 Свързване към Supabase Postgres…')
  await client.connect()

  try {
    console.log('📅 Добавяне на calendario события…')
    await client.query(migrationSql)
    console.log('✅ Успешно добавени календарни събития!')
  } catch (error) {
    console.error('❌ Грешка при добавяне на събитията:', error?.message || error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
