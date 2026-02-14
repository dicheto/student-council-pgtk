import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Функционалности',
  description: 'Открийте функциите и възможностите на нашия модерен уебсайт.',
}

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
