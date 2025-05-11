import { getSession } from 'next-auth/react';
import { AuthService } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export class ApiService {
  static async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const session = await getSession();

    if (!session?.accessToken) {
      throw new Error('認証が必要です');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // 認証エラーの場合、リフレッシュトークンを使用して新しいトークンを取得
    if (response.status === 401) {
      try {
        // リフレッシュトークンを使用して新しいトークンを取得
        const refreshResult = await AuthService.refreshToken(session.refreshToken as string);
        
        // 新しいアクセストークンで再リクエスト
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${refreshResult.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!retryResponse.ok) {
          throw new Error('APIリクエストに失敗しました');
        }

        return retryResponse.json();
      } catch (error) {
        console.error('トークンのリフレッシュに失敗:', error);
        throw new Error('セッションの更新に失敗しました');
      }
    }

    if (!response.ok) {
      throw new Error('APIリクエストに失敗しました');
    }

    return response.json();
  }

  // APIエンドポイントの例
  static async getUserProfile(): Promise<any> {
    return this.fetch('/api/user/profile');
  }
} 