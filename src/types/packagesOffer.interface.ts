export interface PackageOffer {
    id: number;
    name_ar: string;
    name_en: string;
    price_per_unit: string;
    days_count: string;
    is_active: any;
    order: number | null;
    no_of_subscriptions: number;
    category: string | null;
    area: string | null;
   district: District;
    days: string[];
    created_at: string;
    discounts: PackageDiscount[];
}
export interface District {
  id: number
  name_ar: string
  name_en: string
  available_days: string[]
}

export interface PackageDiscount {
    min_units: number;
    max_units: number | string;
    discount_rate: string;
}