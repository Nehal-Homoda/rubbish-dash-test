import { Collector } from "@/types/collectors.interface"




export interface District {
  id: number
  name_en: string
  name_ar: string
  available_days: string[]
  available_times: string[]
  order: number
  is_active: boolean
  no_of_subscriptions: number
  collector: Collector[]
  created_at: string
}


