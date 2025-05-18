import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      if (!token) return false;

      // アクセストークンの存在チェック
      if (!token.accessToken) return false;

      // 有効期限チェック
      if (token.expired && typeof token.expired === 'number') {
        const now = Math.floor(Date.now() / 1000);
        if (now > token.expired) return false;
      }

      return true;
    },
  },
  pages: {
    signIn: '/',
  },
});

// 保護したいパスを指定
export const config = {
  matcher: [
    /*
     * 以下のパスを除外:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/* (認証関連ページ)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};
