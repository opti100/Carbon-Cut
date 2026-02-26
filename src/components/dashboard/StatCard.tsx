'use client';

import React from 'react';

interface Props {
  title: string;
  value?: string | number | null;
  unit?: string;
  loading?: boolean;
}

export default function StatCard({ title, value, unit, loading }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      {loading ? (
        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1" />
      ) : (
        <p className="text-2xl font-bold mt-1">
          {value ?? '—'} {unit && <span className="text-sm font-normal text-gray-500">{unit}</span>}
        </p>
      )}
    </div>
  );
}