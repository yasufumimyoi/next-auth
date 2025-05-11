import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthService } from '@/services/auth';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
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

          return {
            id: credentials.email,
            email: credentials.email,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expired: response.expired,
          };
        } catch (error) {
          throw new Error('認証に失敗しました');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expired = user.expired;
      }

      // アクセストークンの有効期限をチェック
      const now = Math.floor(Date.now() / 1000);
      if (token.expired && now > token.expired) {
        try {
          const response = await AuthService.refreshToken(token.refreshToken as string);
          token.accessToken = response.accessToken;
          token.refreshToken = response.refreshToken;
          token.expired = response.expired;
        } catch (error) {
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST }; 