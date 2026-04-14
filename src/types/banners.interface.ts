export interface Banner {
    id: number;
    title: string;
    title_ar: string;
    title_en: string;
    link: any;
    image: string;
    order: any;
    is_active: number;
    is_ad: number | null;
    ad_image: string;
    category_id: string;
}
