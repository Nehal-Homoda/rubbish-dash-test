export interface PackageOffer {
    id: number;
    // name_ar: string;
    // name_en: string;
    name: string;
    price_per_unit: number;
    days_count: number;
    is_active: number;
    order: any;
    no_of_subscriptions: number;
    category:any,
    created_at: string;
}
