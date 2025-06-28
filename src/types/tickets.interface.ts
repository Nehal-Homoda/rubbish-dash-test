export interface Ticket {
    id: number;
    uid: string;
    subject: string;
    status: string;
    created_by: {
        id: any;
        type: string;
        name: any;
        phone: any;
    };
    created_at: string;
}
