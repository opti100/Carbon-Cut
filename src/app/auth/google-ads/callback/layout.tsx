import { Suspense } from 'react';

export default function GoogleAdsCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}