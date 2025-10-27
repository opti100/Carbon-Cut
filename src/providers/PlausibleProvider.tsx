"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { init, track } from '@plausible-analytics/tracker';

interface PlausibleContextType {
  trackEvent: (eventName: string, props?: Record<string, any>) => void;
  trackRevenue: (eventName: string, amount: number, currency?: string, props?: Record<string, any>) => void;
  isInitialized: boolean;
}

const PlausibleContext = createContext<PlausibleContextType | undefined>(undefined);

export const usePlausible = () => {
  const context = useContext(PlausibleContext);
  if (!context) {
    throw new Error('usePlausible must be used within PlausibleProvider');
  }
  return context;
};

interface PlausibleProviderProps {
  children: React.ReactNode;
}

export const PlausibleProvider: React.FC<PlausibleProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    init({
      domain: 'carboncut.co',
      endpoint: 'http://127.0.0.1:8000/api/v1/events/',
      autoCapturePageviews: true,
      captureOnLocalhost: true, 
      logging: true,
      outboundLinks: true,
      fileDownloads: true,
      formSubmissions: true,
      hashBasedRouting: false,
      customProperties: (eventName) => ({
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        window_size: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
      }),
      transformRequest: (request) => {
        // Add session ID and additional CarbonCut specific data
        const sessionId = getOrCreateSessionId();
        const deviceInfo = getDeviceInfo();
        
        return {
          ...request,
          session_id: sessionId,
          device_info: deviceInfo,
          carbon_cut_version: '1.0.0',
          app_type: 'web',
        };
      }
    });

    setIsInitialized(true);
  }, []);

  const trackEvent = (eventName: string, props: Record<string, any> = {}) => {
    if (!isInitialized) return;
    
    track(eventName, {
      props: {
        ...props,
        tracked_at: new Date().toISOString(),
      }
    });
  };

  const trackRevenue = (eventName: string, amount: number, currency: string = 'USD', props: Record<string, any> = {}) => {
    if (!isInitialized) return;
    
    track(eventName, {
      props,
      revenue: {
        amount,
        currency
      }
    });
  };

  return (
    <PlausibleContext.Provider value={{ trackEvent, trackRevenue, isInitialized }}>
      {children}
    </PlausibleContext.Provider>
  );
};

// Helper functions
function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem('carboncut_session_id');
  if (!sessionId) {
    sessionId = `cc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('carboncut_session_id', sessionId);
  }
  return sessionId;
}

function getDeviceInfo() {
  const ua = navigator.userAgent;
  let deviceType = 'desktop';
  let devicePower = 85; // Default watts

  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'tablet';
    devicePower = 15;
  } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
    deviceType = 'mobile';
    devicePower = 6;
  }

  return {
    type: deviceType,
    power_consumption: devicePower,
    user_agent: ua,
    platform: navigator.platform,
    language: navigator.language,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    window_width: window.innerWidth,
    window_height: window.innerHeight,
  };
}