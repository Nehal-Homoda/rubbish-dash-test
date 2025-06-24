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

export interface Users {
    id: number;
    name: string;
    phone: string;
    is_active: boolean;
    has_subscription: boolean;
    subscription_name:string;
    renewal_date: any;
    image?: string;
    created_at: string;
}

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
