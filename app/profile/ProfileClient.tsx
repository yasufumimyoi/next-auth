'use client';

import { useSession } from 'next-auth/react';

export function ProfileClient() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[20vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
        <p>このページを表示するにはログインが必要です。</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h1 className="text-2xl font-bold mb-4">プロフィール</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">ユーザー情報</h2>
        <p>メールアドレス: {session?.user?.email}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">アクセストークン</h2>
        <p className="break-all">
          {session?.accessToken
            ? `${session.accessToken.substring(0, 20)}...`
            : 'アクセストークンがありません'}
        </p>
      </div>
      {session?.error && (
        <div className="text-red-600">
          <p>エラー: {session.error}</p>
        </div>
      )}
    </div>
  );
}
