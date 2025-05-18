'use client';

import { SessionProvider } from 'next-auth/react';

import Header from './components/Header/Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Header />
      {children}
    </SessionProvider>
  );
}
