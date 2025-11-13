"use client";

import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  setCredentials,
  logout as logoutAction,
  selectUser,
  selectIsAuthenticated,
  setUser as setUserAction,
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
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  sendOTP: (email: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get(`${API_BASE}/auth/me/`);
    console.log('fetchCurrentUser response:', response.data);
    
    if (response.data.success && response.data.user) {
      return response.data.user;
    }
    return null;
  } catch (error) {
    console.error('fetchCurrentUser error:', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Fetch user on mount and when authenticated
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Update Redux when user data changes
  React.useEffect(() => {
    if (currentUser) {
      console.log('Setting user in Redux:', currentUser);
      dispatch(setUserAction(currentUser));
    }
  }, [currentUser, dispatch]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const response = await api.post('/auth/verify-otp/', { email, otp });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Login success:', data);
      if (data.success && data.user && data.auth_token) {
        dispatch(setCredentials({
          user: data.user,
          token: data.auth_token,
        }));
        // Refetch user data
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        }, 500);
      }
    },
  });

  // Send OTP mutation
  const sendOTPMutation = useMutation({
    mutationFn: async ({ email, name }: { email: string; name?: string }) => {
      const response = await api.post('/auth/send-otp/', { 
        email, 
        name, 
        isLogin: true 
      });
      return response.data;
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await api.post('/auth/logout/');
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
    onSettled: () => {
      dispatch(logoutAction());
      queryClient.clear();
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

  const value = {
    user,
    isLoading: isLoading || loginMutation.isPending,
    isAuthenticated,
    login,
    logout,
    sendOTP,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const makeRequest = async (url: string, options: RequestInit = {}) => {
  const method = options.method || 'GET';
  const axiosOptions = {
    method,
    url,
    data: options.body ? JSON.parse(options.body as string) : undefined,
    headers: options.headers ? Object.fromEntries(new Headers(options.headers)) : undefined,
  };

  const response = await api.request(axiosOptions);
  return response.data;
};