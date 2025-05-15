import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { AuthService } from '@/services/auth';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('メールアドレスとパスワードを入力してください');
        }

        try {
          const response = await AuthService.login({
            email: credentials.email,
            password: credentials.password,
          });

          if (!response.accessToken || !response.refreshToken || !response.expired) {
            throw new Error('認証情報が不完全です');
          }

          // 有効期限の検証
          const now = Math.floor(Date.now() / 1000);
          if (now > response.expired) {
            throw new Error('トークンの有効期限が切れています');
          }

          return {
            id: credentials.email,
            email: credentials.email,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expired: response.expired,
          };
        } catch (error) {
          console.error('認証エラー:', error);
          throw new Error('認証に失敗しました');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // ユーザー情報をトークンに追加
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expired = user.expired;
      }

      // アクセストークンの有効期限をチェック
      const now = Math.floor(Date.now() / 1000);
      if (token.expired && typeof token.expired === 'number' && now > token.expired) {
        try {
          const response = await AuthService.refreshToken(token.refreshToken as string);

          if (!response.accessToken || !response.refreshToken || !response.expired) {
            return { ...token, error: 'InvalidTokenError' };
          }

          // 新しいトークン情報で更新
          token.accessToken = response.accessToken;
          token.refreshToken = response.refreshToken;
          token.expired = response.expired;
        } catch (error) {
          console.error('トークンリフレッシュエラー:', error);
          return { ...token, error: 'RefreshAccessTokenError' };
        }
      }
      return token;
    },
    async session({ session, token }) {
      // セッションにトークン情報を追加
      session.accessToken = token.accessToken;
      session.error = token.error;

      // セキュリティのため、リフレッシュトークンはクライアントに送信しない
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', // エラーページを追加
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24時間
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24時間
  },
});

// GET, POSTハンドラーをexport
export const GET = async (req: Request): Promise<Response> => {
  try {
    return await handler(req);
  } catch (error) {
    console.error('GET handler error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
};

export const POST = async (req: Request): Promise<Response> => {
  try {
    return await handler(req);
  } catch (error) {
    console.error('POST handler error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
};
