import { Hero } from '@/components/sections/Hero'
import { LatestNews } from '@/components/sections/LatestNews'
import { UpcomingEvents } from '@/components/sections/UpcomingEvents'
import { GalleryHighlights } from '@/components/sections/GalleryHighlights'
import { TeamSection } from '@/components/sections/TeamSection'
import { Timeline } from '@/components/sections/Timeline'
import { CTASection } from '@/components/sections/CTASection'
import { StatsSection } from '@/components/sections/StatsSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ученически Съвет',
  description: 'Официален уебсайт на Ученическия Съвет на ПГТК "". Вдъхновяваме промяна, изграждаме общност, създаваме бъдеще.',
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Stats Section - Quick overview */}
      <StatsSection />

      {/* Events Section */}
      <UpcomingEvents />

      {/* News Section */}
      <LatestNews />

      {/* Timeline Section */}
      <Timeline />

      {/* Team Section */}
      <TeamSection />

      {/* Gallery Section */}
      <GalleryHighlights />

      {/* CTA Section */}
      <CTASection />
    </>
  )
}
