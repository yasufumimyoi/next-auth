'use client';

import { SessionProvider } from 'next-auth/react';

type ClientLayoutProps = {
  children: React.ReactNode;
};

export function ClientLayout({ children }: ClientLayoutProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default ClientLayout;
