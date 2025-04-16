export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    user_id: number;
    full_name: string;
    role_name: string;
    roles: string[];
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface User {
    id: number;
    fullName: string;
    roleName: string;
    roles: string[];
}
