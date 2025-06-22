export interface Collector {
  id: number
  name: string
  phone: string
  image?: string
  title: any
  current_lat?: string
  current_lng?: string
  is_active: boolean
  count_collected: number
  count_not_collected: number
  districts: District[]
  visits: Visit[]
}

export interface District {
  id: number
  name: string
  available_days: string[]
  available_times: string[]
}


export interface Visit {
  id: number
  status: string
  collector_note?: string
  user_note?: string
  day: string
  address: string
}