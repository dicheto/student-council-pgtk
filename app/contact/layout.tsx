import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Контакти',
  description: 'Свържете се с Ученическия Съвет на ПГТК "" - адрес, телефон, email и контактна форма.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
