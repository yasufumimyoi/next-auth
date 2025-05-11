import { AuthResponse, Credentials, AuthError } from '../types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export class AuthService {
  static async login(credentials: Credentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error: AuthError = await response.json();
        throw new Error(error.message);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  static async refreshToken(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error: AuthError = await response.json();
        throw new Error(error.message);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
} 