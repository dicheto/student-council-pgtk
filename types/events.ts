export interface Event {
  id: number
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
  category: 'meeting' | 'charity' | 'cultural' | 'sports' | 'educational' | 'other'
  imageUrl?: string
  organizer?: string
  contactEmail?: string
  contactPhone?: string
}
