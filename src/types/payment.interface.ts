export interface Payment {
  id: number
  name_en: string
  name_ar: string
  image: string
  order?: number
  is_active: boolean
}