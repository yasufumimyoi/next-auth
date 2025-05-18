import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { authOptions } from './api/auth/[...nextauth]/route';
import { LoginForm } from './components/loginForm/LoginForm';

export default async function SignIn() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">ログイン</h2>
        </div>
        {session ? <Link href="/profile">プロフィールページへ</Link> : <LoginForm />}
      </div>
    </div>
  );
}
