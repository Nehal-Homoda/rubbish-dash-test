export interface ResponseError {
    error: {
        message: string;
        status_code: string;
        code: any;
        payload: any;
    };
    success: boolean;
}

export interface ResponseData<T> {
    data: T;
    success: boolean;
    links: ResponseLinks;
    meta: Meta;
}


export interface ResponseLinks {
    first: string;
    last: string;
    prev: any;
    next: any;
}

export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    links: ResponseLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
    message: any;
}

export interface ResponseLink {
    url?: string;
    label: string;
    active: boolean;
}
