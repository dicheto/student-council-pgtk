import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Протоколи',
  description: 'Архив с протоколи от заседания на Ученическия съвет.',
}

export default function ProtocolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
