import { useEffect, useCallback } from 'react';

declare global {
  interface Window {
    CarbonCutAnalytics: {
      trackEvent: (eventName: string, props?: Record<string, any>) => void;
      trackConversion: (conversionType: string, value?: number, currency?: string) => void;
      trackUserAction: (action: string, category?: string) => void;
      sessionId: string;
      deviceInfo: any;
    };
    plausible: (eventName: string, options?: { props?: Record<string, any> }) => void;
  }
}

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName: string, props: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && window.CarbonCutAnalytics) {
      window.CarbonCutAnalytics.trackEvent(eventName, props);
    }
  }, []);

  const trackConversion = useCallback((conversionType: string, value?: number, currency: string = 'USD') => {
    if (typeof window !== 'undefined' && window.CarbonCutAnalytics) {
      window.CarbonCutAnalytics.trackConversion(conversionType, value, currency);
    }
  }, []);

  const trackUserAction = useCallback((action: string, category: string = 'user_interaction') => {
    if (typeof window !== 'undefined' && window.CarbonCutAnalytics) {
      window.CarbonCutAnalytics.trackUserAction(action, category);
    }
  }, []);

  const trackPageView = useCallback((pageName?: string) => {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('pageview', {
        props: {
          page_name: pageName || window.location.pathname
        }
      });
    }
  }, []);

  const trackCarbonCalculation = useCallback((data: {
    campaignType?: string;
    emissions?: number;
    cost?: number;
  }) => {
    trackEvent('Carbon Calculation', {
      campaign_type: data.campaignType,
      emissions_kg: data.emissions,
      cost_usd: data.cost
    });
  }, [trackEvent]);

  const trackOffsetPurchase = useCallback((data: {
    amount: number;
    projectType: string;
    cost: number;
  }) => {
    trackConversion('Offset Purchase', data.cost);
    trackEvent('Offset Purchase', {
      offset_amount: data.amount,
      project_type: data.projectType,
      cost_usd: data.cost
    });
  }, [trackEvent, trackConversion]);

  const trackCertificationRequest = useCallback((data: {
    reportType: string;
    cost?: number;
  }) => {
    trackConversion('Certification Request', data.cost);
    trackEvent('Certification Request', {
      report_type: data.reportType,
      cost_usd: data.cost
    });
  }, [trackEvent, trackConversion]);

  return {
    trackEvent,
    trackConversion,
    trackUserAction,
    trackPageView,
    trackCarbonCalculation,
    trackOffsetPurchase,
    trackCertificationRequest
  };
};