import UserDashboard from '@/components/dashboard/UserDashboard';
import React, { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserDashboard />
    </Suspense>
  );
}
