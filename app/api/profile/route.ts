import { NextRequest } from 'next/server';

// ダミーのプロフィールデータ
const dummyProfile = {
  id: '1',
  name: 'テストユーザー',
  email: 'test@example.com',
  role: 'user',
  preferences: {
    theme: 'light',
    notifications: true,
  },
  stats: {
    joinedAt: '2024-01-01',
    lastLogin: '2024-03-15',
    loginCount: 42,
  },
  subscription: {
    plan: 'premium',
    status: 'active',
    validUntil: '2025-03-15',
  },
};

export async function GET(request: NextRequest) {
  try {
    // Authorization ヘッダーの検証
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // 実際のアプリケーションではここでトークンの検証を行う
    const token = authHeader.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: '無効なトークンです' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // ダミーデータを返却（実際のアプリケーションではDBから取得）
    return new Response(JSON.stringify(dummyProfile), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Profile API Error:', error);
    return new Response(JSON.stringify({ error: 'サーバーエラーが発生しました' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
