export interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthRequest {
    username: string;
    password: string;
}