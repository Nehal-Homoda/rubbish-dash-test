import { Subscription2 } from "./auth.interface";

export interface Payment {
    id: number;
    total_price: number;
    payment_verification?: string;
    receiving_number?: string;
    status: string;
    user_id: number;
    user_name: string;
    payment_method: PaymentMethod;
    created_at: string;
    subscription: Subscription2 | null;
}


export interface PaymentMethod {
  id: number
  name_en: string
  name_ar: string
  image: string
  order?: number
  is_active: boolean
}