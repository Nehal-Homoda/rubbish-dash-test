import { PaymentMethod } from "./user.interface";

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
}
