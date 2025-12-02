import { useState, useEffect, useCallback } from 'react';
import { ActivityData } from '@/types/types';
import { CHANNELS } from '@/constants/data';

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

export function useEmissionsCalculator() {
  const [calculatingEmissions, setCalculatingEmissions] = useState<Record<number | string, boolean>>({});
  const [emissionResults, setEmissionResults] = useState<Record<number | string, number>>({});

  const calcCO2AI = useCallback(
    async (activity: ActivityData): Promise<number> => {
      const activityId = activity.id;

      if (activity.quantities && Object.keys(activity.quantities).length > 0) {
        let totalEmissions = 0;

        for (const [unitKey, data] of Object.entries(activity.quantities)) {
          const individualActivityId = `${activityId}_${unitKey}`;

          if (
            calculatingEmissions[individualActivityId] ||
            emissionResults[individualActivityId] !== undefined
          ) {
            if (emissionResults[individualActivityId] !== undefined) {
              totalEmissions += emissionResults[individualActivityId];
            }
            continue;
          }

          try {
            setCalculatingEmissions((prev) => ({ ...prev, [individualActivityId]: true }));

            const authToken = getCookie('auth-token');
            if (!authToken) {
              throw new Error('Authentication required');
            }

            const requestBody = {
              userInput: {
                activityType: data.label,
                channel: activity.channel,
                market: activity.market,
                quantity: data.value,
                unit: unitKey,
                scope: activity.scope || 3,
                date: activity.date || new Date().toISOString().split('T')[0],
                campaign: activity.campaign,
              },
            };

             const BASE_URL = process.env.NEXT_PUBLIC_API_URL ;
            const response = await fetch(`${BASE_URL}/inventory/calculate-carbon/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error('API request failed');

            const result = await response.json();
            const emission = result.data?.totalEmissions || 0;

            setEmissionResults((prev) => ({ ...prev, [individualActivityId]: emission }));
            totalEmissions += emission;
          } catch (error) {
            console.error('Error calculating emissions:', error);
            const emission = data.value * 0.5;
            setEmissionResults((prev) => ({ ...prev, [individualActivityId]: emission }));
            totalEmissions += emission;
          } finally {
            setCalculatingEmissions((prev) => ({ ...prev, [individualActivityId]: false }));
          }
        }

        return totalEmissions;
      }

      return 0;
    },
    [calculatingEmissions, emissionResults]
  );

  const getDisplayCO2 = useCallback(
    (activity: ActivityData): number => {
      if (activity.quantities && Object.keys(activity.quantities).length > 0) {
        let total = 0;
        for (const unitKey of Object.keys(activity.quantities)) {
          const individualId = `${activity.id}_${unitKey}`;
          total += emissionResults[individualId] || 0;
        }
        return total;
      }
      return emissionResults[activity.id] || 0;
    },
    [emissionResults]
  );

  return {
    calculatingEmissions,
    emissionResults,
    calcCO2AI,
    getDisplayCO2,
  };
}
