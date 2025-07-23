export interface AppUser {
    id: number;
    name: string;
    phone: string;
    is_active: boolean;
    has_subscription: boolean;
    renewal_date: string;
    subscription_name: string;
    image: any;
    payment: any;
    subscription: Subscription;
    created_at: string;
    deserved_money_by_recycle: number;
    all_recycle_weights: number;
}

export interface Payment {
    id: number;
    total_price: number;
    payment_verification: any;
    receiving_number: any;
    status: string;
    user_id: number;
    user_name: string;
    payment_method: null | PaymentMethod;
    created_at: string;
}

export interface PaymentMethod {
    id: number;
    name_en: string;
    name_ar: string;
    image: string;
    order: any;
    is_active: boolean;
}

export interface Subscription {
    id: number;
    uid: string;
    units: number;
    time_from: string;
    time_to: string;
    days: string[];
    status: string;
    starts_at: string;
    ends_at: string;
    created_at: string;
    district: District;
    package: Package;
    category: Category;
    address: Address;
}

export interface District {
    id: number;
    name: string;
    available_days: string[];
    available_times: string[];
}

export interface Package {
    id: number;
    name: string;
    price_per_unit: number;
    days_count: number;
}

export interface Category {
    id: number;
    name: string;
    image: string;
}

export interface Address {
    id: number;
    title: string;
    detail: any;

    created_at: string;
}

export interface Coordinates {
    lat: string;
    lng: string;
}

export interface Subject {
    id: number;
    type: string;
}

export interface Meta {
    message: any;
}
