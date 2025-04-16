interface Role {
    id: number;
    name: string;
    description: string;
}

interface User {
    email: string;
    full_name: string;
    is_active: boolean;
    role_ids: number[] | null;
    id: number;
    roles: Role[];
}

interface Comment {
    comment: string;
    id: number;
    request_id: number;
    user_id: number;
    created_at: string;
}

export interface PurchaseRequest {
    id: number;
    description: string;
    amount: number;
    status: string;
    expected_date: string;
    created_at: string;
    updated_at: string;
    user_id: number;
    supervisor_id: number | null;
    comments: Comment[];
    user: User;
}
