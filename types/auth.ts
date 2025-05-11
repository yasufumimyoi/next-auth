export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expired: number;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthError {
  error: string;
  message: string;
  statusCode: number;
} 