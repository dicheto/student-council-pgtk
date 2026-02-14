import { EventsCalendar } from '@/components/events/EventsCalendar'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Събития',
  description: 'Разгледай предстоящите инициативи и добави най-важните в своя календар.',
}

export default function EventsPage() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0b0d12] py-20">
      <div className="pointer-events-none absolute inset-0 bg-apple-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.04]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 apple-glass">
            <span className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-200">
              Календар
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Всички събития на едно място.
          </h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Разгледай предстоящите инициативи и добави най‑важните в своя календар.
          </p>
        </header>

        <div className="apple-glass p-4 sm:p-6 lg:p-8">
          <EventsCalendar />
        </div>
      </div>
    </div>
  )
}
