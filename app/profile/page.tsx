import { Suspense } from 'react';

import { ProfileClient } from './ProfileClient';
import { ProfileData } from './ProfileData';

// ローディングコンポーネント
function LoadingProfile() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  );
}

export default async function ProfilePage() {
  return (
    <div className="container mx-auto p-4">
      {/* Client Componentをラップ */}
      <ProfileClient />

      {/* Server Componentをラップ */}
      <Suspense fallback={<LoadingProfile />}>
        <ProfileData />
      </Suspense>
    </div>
  );
}
