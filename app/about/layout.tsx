import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'За нас',
  description: 'Научете повече за Ученическия Съвет на ПГТК "" - нашата мисия, ценности и екип.',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
