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

export interface AdminTicket {
    id: number;
    uid: string;
    subject: string;
    status: string;
    created_by: CreatedBy;
    messages: Message[];
    created_at: string;
}

export interface CreatedBy {
    id: number;
    type: string;
    name: string;
    phone: string;
}

export interface Message {
    id: number;
    content: string;
    sender: Sender;
    created_at: string;
}

export interface Sender {
    id: number;
    type: string;
    name: string;
    phone?: string;
}
