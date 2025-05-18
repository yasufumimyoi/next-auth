import { getServerSession } from 'next-auth';

import { authOptions } from '../api/auth/[...nextauth]/route';

// データ取得用の関数
async function fetchProfileData(accessToken: string) {
  try {
    // APIエンドポイントを内部APIに変更
    const response = await fetch('http://localhost:3000/api/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'プロフィールデータの取得に失敗しました');
    }

    return response.json();
  } catch (error) {
    console.error('プロフィールデータ取得エラー:', error);
    throw error;
  }
}

// Server Component
export async function ProfileData() {
  const session = await getServerSession(authOptions);
  console.log('Server Session:', session); // デバッグ用ログ

  if (!session?.accessToken) {
    return <div>アクセストークンがありません</div>;
  }

  try {
    const profileData = await fetchProfileData(session.accessToken);

    return (
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">プロフィールデータ</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-md font-semibold mb-2">基本情報</h3>
              <p>名前: {profileData.name}</p>
              <p>メール: {profileData.email}</p>
              <p>役割: {profileData.role}</p>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2">設定</h3>
              <p>テーマ: {profileData.preferences.theme}</p>
              <p>通知: {profileData.preferences.notifications ? 'オン' : 'オフ'}</p>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2">統計</h3>
              <p>登録日: {profileData.stats.joinedAt}</p>
              <p>最終ログイン: {profileData.stats.lastLogin}</p>
              <p>ログイン回数: {profileData.stats.loginCount}</p>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2">サブスクリプション</h3>
              <p>プラン: {profileData.subscription.plan}</p>
              <p>ステータス: {profileData.subscription.status}</p>
              <p>有効期限: {profileData.subscription.validUntil}</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="mt-6 text-red-600">
        {error instanceof Error ? error.message : 'データの取得に失敗しました'}
      </div>
    );
  }
}
