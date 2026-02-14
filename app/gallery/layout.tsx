import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Галерия',
  description: 'Разгледай снимки от събития, инициативи и ежедневни моменти в ПГТК "".',
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
