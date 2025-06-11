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
    meta: {
        message: null | string;
    };
}


