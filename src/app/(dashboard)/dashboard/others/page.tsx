'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/contexts/AuthContext';
import PeriodSelector from '@/components/dashboard/PeriodSelector';
import StatCard from '@/components/dashboard/StatCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Layers, AlertCircle } from 'lucide-react';

export default function OthersPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const analytics = useQuery({
    queryKey: ['others-analytics', month, year],
    queryFn: () =>
      api.get('/web/analytics/', { params: { month, year } }).then(r => r.data.data),
  });

  const otherSources =
    analytics.data?.source_breakdown?.filter(
      (s: any) =>
        ![
          'cloud_aws',
          'cloud_gcp',
          'cloud_azure',
          'cdn',
          'cdn_data_transfer',
          'workforce',
          'workforce_office',
          'onprem_servers',
          'onprem_server',
          'travel',
          'travel_flight',
          'internet_ads',
        ].includes(s.source_type)
    ) || [];

  const totalOtherEmissions = otherSources.reduce(
    (a: number, s: any) => a + (s.total_kg || 0),
    0
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Other Emission Sources</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Miscellaneous emissions from oil & gas, lubricants, and other sources
          </p>
        </div>
        <PeriodSelector month={month} year={year} setMonth={setMonth} setYear={setYear} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Other Emissions"
          value={totalOtherEmissions.toFixed(2)}
          unit="kg CO₂"
          loading={analytics.isLoading}
        />
        <StatCard title="Sources" value={otherSources.length} loading={analytics.isLoading} />
      </div>

      {/* Loading State */}
      {analytics.isLoading && (
        <Card>
          <CardContent className="p-16 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      )}

      {/* Table with Data */}
      {!analytics.isLoading && otherSources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Miscellaneous Sources
            </CardTitle>
            <CardDescription>
              Emissions from sources not categorized in standard categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead className="text-right">Emissions (kg)</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherSources.map((s: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium capitalize">
                      {s.source_type?.replace(/_/g, ' ') || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{s.scope || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {s.total_kg?.toFixed(2) || '0.00'}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {s.percentage?.toFixed(1) || '0.0'}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!analytics.isLoading && otherSources.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold mb-2">
                No additional emission sources recorded
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Oil & Gas, Lubricants, and other sources will appear here when data is
                submitted for this period.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}