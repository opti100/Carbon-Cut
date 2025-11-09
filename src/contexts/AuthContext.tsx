"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  setCredentials,
  setLoading,
  logout as logoutAction,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectIsLoading,
  setUser as setUserAction,
  setToken as setTokenAction,
} from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hook';

interface User {
  id: string;
  email: string;
  name: string;
  companyName: string;
  phoneNumber: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  sendOTP: (email: string, name?: string) => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE = 'http://localhost:8000/api/v1';

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
    if (cookieName === name && cookieValue) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const makeRequest = async (url: string, options: RequestInit = {}) => {
  const token = getCookie('auth-token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

const fetchCurrentUser = async (): Promise<User | null> => {
  const token = getCookie('auth-token');
  if (!token) return null;

  const data = await makeRequest(`${API_BASE}/auth/me/`);
  return data.success && data.user ? data.user : null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const isLoading = useAppSelector(selectIsLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const { data: currentUser, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    enabled: !!getCookie('auth-token'),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (currentUser) {
      dispatch(setUserAction(currentUser));
    }
  }, [currentUser, dispatch]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      return makeRequest(`${API_BASE}/auth/verify-otp/`, {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
    },
    onSuccess: (data) => {
      if (data.success && data.user && data.auth_token) {
        dispatch(setCredentials({
          user: data.user,
          token: data.auth_token,
        }));
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      }
    },
  });

  const sendOTPMutation = useMutation({
    mutationFn: async ({ email, name }: { email: string; name?: string }) => {
      return makeRequest(`${API_BASE}/auth/send-otp/`, {
        method: 'POST',
        body: JSON.stringify({ email, name, isLogin: true }),
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return makeRequest(`${API_BASE}/auth/logout/`, {
        method: 'POST',
      }).catch(() => ({}));
    },
    onSettled: () => {
      dispatch(logoutAction());
      deleteCookie('auth-token');
      queryClient.clear();
    },
  });

  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      return makeRequest(`${API_BASE}/auth/refresh-token/`, {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      if (data.token) {
        dispatch(setTokenAction(data.token));
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      }
    },
  });

  const login = async (email: string, otp: string) => {
    await loginMutation.mutateAsync({ email, otp });
  };

  const sendOTP = async (email: string, name?: string) => {
    await sendOTPMutation.mutateAsync({ email, name });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      await refreshTokenMutation.mutateAsync();
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const handleFocus = () => {
      if (getCookie('auth-token')) {
        refetch();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const authToken = getCookie('auth-token');
      if (!authToken) {
        dispatch(logoutAction());
        queryClient.clear();
      }
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, dispatch, queryClient]);

  const value = {
    user,
    token,
    isLoading: isLoading || loginMutation.isPending,
    isAuthenticated,
    login,
    logout,
    sendOTP,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};