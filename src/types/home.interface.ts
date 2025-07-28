import { Collector } from "./collectors.interface";

export interface Statistics {
    no_of_subscriptions: number;
    no_of_none_subscriptions: number;
    completed_visited: number;
    not_collected_visited: number;
    total_visits_count: number;
    [key: string]: number;
}
export interface HomeCollector {
    notes_visit: any[];
    collectors: Collector[];
}

// export interface HomePayment {
//     payments: Payment[];
// }

export interface Payment {
    id: number;
    total_price: number;
    status: string;
    user_id: number;
    user_name: string;
    payment_method_image: string;
    created_at: string;
}

export interface UserListWithRecycle {
    id: number;
    name: string;
    all_recycle_weights: number;
    deserved_money_by_recycle: number;
}

export interface ChartData {
    statsCategory: StatsCategory[];
    statsPackage: StatsPackage[];
}

export interface StatsCategory {
    category: string;
    no_of_subscriptions: number;
    month: number;
    year: number;
}

export interface StatsPackage {
    package: string;
    no_of_subscriptions: number;
    category_id: number;
}
