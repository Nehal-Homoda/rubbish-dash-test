// import { Category } from "./categories.interface";
// import { District } from "./collectors.interface";
import { PackageOffer } from "./packagesOffer.interface";
// import { Payment } from "./payment.interface";

export interface AuthResponse {
    data: {
        message: string;
        admin: User;
        token: string;
    };
    success: boolean;
}

export interface User {
    name: string;
    email: string;
}

// export interface Users {
//     id: number;
//     name: string;
//     phone: string;
//     is_active: boolean;
//     image?: string;
//     password?: string;
//     has_subscription?: boolean;
//     subscription_name?: string;
//     renewal_date?: any;
//     created_at?: string;
// }

export interface AuthResposeError {
    error: {
        message: string;
        status_code: string;
        code: any;
        payload: any;
    };
    success: boolean;
}

export interface LogoutResponse {
    meta: {
        message: string;
    };
    success: boolean;
}

export interface Users {
    id: number;
    name: string;
    phone: string;
    is_active: boolean;
    has_subscription: boolean;
    renewal_date: string;
    subscription_name: string;
    image: any;
    payment: Payment;
    subscription: Subscription2;
    created_at: string;
}

export interface Payment {
    id: number;
    total_price: number;
    payment_verification: any;
    receiving_number: any;
    status: string;
    user_id: number;
    user_name: string;
    payment_method: PaymentMethod;
    created_at: string;
    subscription: Subscription;
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
    coordinates: Coordinates;
    subject: Subject;
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

export interface Subscription2 {
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
    district: District2;
    package: Package2;
    category: Category2;
    address: Address2;
}

export interface District2 {
    id: number;
    name: string;
    available_days: string[];
    available_times: string[];
}

export interface Package2 {
    id: number;
    name: string;
    price_per_unit: number;
    days_count: number;
}

export interface Category2 {
    id: number;
    name: string;
    image: string;
}

export interface Address2 {
    id: number;
    title: string;
    detail: any;
    coordinates: Coordinates2;
    subject: Subject2;
    created_at: string;
}

export interface Coordinates2 {
    lat: string;
    lng: string;
}

export interface Subject2 {
    id: number;
    type: string;
}
