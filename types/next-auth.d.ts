import type { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    error?: string;
  }

  interface User extends DefaultUser {
    accessToken: string;
    refreshToken: string;
    expired: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expired?: number;
    error?: string;
  }
}
