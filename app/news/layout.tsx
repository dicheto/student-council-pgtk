import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Новини',
  description: 'Последните новини и актуалности от Ученическия Съвет на ПГТК "".',
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
