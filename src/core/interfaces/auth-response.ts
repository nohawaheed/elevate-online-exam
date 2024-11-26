export interface AuthResponse {
    message: string;
    token: string;
    userEmail: string;
}

export interface ErrorMessage{
    error: {
        message: string;
        code: number;
    }
}