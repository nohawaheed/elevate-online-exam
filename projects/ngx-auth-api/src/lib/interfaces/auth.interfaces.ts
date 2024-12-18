export interface RegisterRequest {
    username:string;
    firstName:string;
    lastName:string;
    email: string;
    password: string;
    rePassword: string;
    phone: string;
}
export interface RegisterResponse {
    message: string;
    token: string;
    user: {
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        role: string;
        isVerified: boolean;
        _id: string;
        createdAt: string;
    }  
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    userEmail: string;
}

export interface ErrorMessage {
    error: {
        message: string;
        code: number;
    }
}

export interface RecoverPasswordRequest {
email: string;
}

export interface RecoverPasswordResponse {
  message: string;
  info: string;
}

export interface VerifyCodeRequest {
  resetCode: string;
}

export interface VerifyCodeResponse {
  status: string;
}

export interface ResetPasswordRequest {
    email: string;
    newPassword: string;
}
export interface ResetPasswordResponse {
    message: string;
    token: string;
}
export interface LogoutResponse {
    message: string;
}
