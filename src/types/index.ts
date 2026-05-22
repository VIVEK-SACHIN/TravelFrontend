export interface User {
  _id: string | { $oid: string }
  name: string
  email: string
  photo: string
  role: 'user' | 'guide' | 'lead-guide' | 'admin'
}

export interface Review {
  _id: string
  review: string
  rating: number
  user: User
}

export interface TourLocation {
  type: string
  coordinates: [number, number]
  address?: string
  description: string
  day?: number
}

export interface Booking {
  _id: string | { $oid: string }
  price: number
  paid: boolean
  createdAt?: string | Date
  tour: Tour
}

export interface Tour {
  /** Plain string after `normalizeTour`; API may send `{ $oid: string }` from Rust/Mongo. */
  _id: string | { $oid: string }
  name: string
  slug: string
  duration: number
  maxGroupSize: number
  difficulty: string
  ratingsAverage: number
  ratingsQuantity: number
  price: number
  summary: string
  description: string
  imageCover: string
  images: string[]
  startDates?: (string | Date)[]
  startLocation: { description: string }
  locations: TourLocation[]
  guides: User[]
  reviews?: Review[]
}
