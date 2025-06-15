export interface District {
  id: number;
  name: string;
  available_days: string[];
  available_times: string[];
}

export interface Visit {
  id: number;
  status: string;
  collector_note: string | null;
  user_note: string | null;
  day: string;
  address: string;
}

export interface Collector {
  id: number;
  name: string;
  phone: string;
  Image: string | null;
  title: string | null;
  current_lat: string;
  current_lng: string;
  is_active: boolean;
  count_collected: number;
  count_not_collected: number;
  districts: District[];
  visits: Visit[];
}

export interface Region{
  id: number;
  name_ar: string;
  name_en: string;
  available_days: string[];
  available_times: string[];
  is_active: boolean;
  order: any;
  no_of_subscriptions: number;
  collector: Collector[];
  created_at: string;
}
