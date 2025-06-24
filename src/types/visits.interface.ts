export interface Visit {
    id: number;
    category_name: string;
    user_name: string;
    collector_name: string | null;
    status: string;
    user_note: string | null;
    collector_note: string | null;
    day: string;
    time_from: string;
    time_to: string;
    collected_at: string | null;
    address: string;
    created_at: string;
}
