import NextAuth, { type NextAuthOptions , User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { AuthService } from '@/services/auth';

const authOptions: NextAuthOptions = {
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
            console.error('不完全な認証レスポンス:', response);
            throw new Error('認証情報が不完全です');
          }

          // 有効期限の検証
          const now = Math.floor(Date.now() / 1000);
          if (now > response.expired) {
            console.error('トークン有効期限切れ:', { now, expired: response.expired });
            throw new Error('トークンの有効期限が切れています');
          }

          const user = {
            id: credentials.email,
            email: credentials.email,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expired: response.expired,
          } as User;

          console.log('認証成功:', { email: user.email });
          return user;
        } catch (error) {
          console.error('認証エラーの詳細:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          console.log('JWTコールバック - ユーザー情報の追加:', { email: user.email });
          // ユーザー情報をトークンに追加
          token.accessToken = (user as User).accessToken;
          token.refreshToken = (user as User).refreshToken;
          token.expired = (user as User).expired;
        }

        // アクセストークンの有効期限をチェック
        const now = Math.floor(Date.now() / 1000);
        if (token.expired && typeof token.expired === 'number' && now > token.expired) {
          console.log('トークンリフレッシュ開始');
          try {
            const response = await AuthService.refreshToken(token.refreshToken as string);

            if (!response.accessToken || !response.refreshToken || !response.expired) {
              console.error('不完全なリフレッシュレスポンス:', response);
              return { ...token, error: 'InvalidTokenError' };
            }

            console.log('トークンリフレッシュ成功');
            // 新しいトークン情報で更新
            token.accessToken = response.accessToken;
            token.refreshToken = response.refreshToken;
            token.expired = response.expired;
          } catch (error) {
            console.error('トークンリフレッシュエラーの詳細:', error);
            return { ...token, error: 'RefreshAccessTokenError' };
          }
        }
        return token;
      } catch (error) {
        console.error('JWTコールバックエラー:', error);
        throw error;
      }
    },
    async session({ session, token }) {
      try {
        console.log('セッションコールバック開始');
        // セッションにトークン情報を追加
        if (session) {
          session.accessToken = token.accessToken;
          session.error = token.error;

          console.log('セッション更新完了:', {
            hasAccessToken: !!session.accessToken,
            hasError: !!session.error,
          });
        }

        // セキュリティのため、リフレッシュトークンはクライアントに送信しない
        return session;
      } catch (error) {
        console.error('セッションコールバックエラー:', error);
        throw error;
      }
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
  debug: true, // 開発時のデバッグログを有効化
};

const handler = NextAuth(authOptions);

// App Router用のハンドラー
export const GET = handler;
export const POST = handler;
