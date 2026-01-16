'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import {
  setCredentials,
  logout as logoutAction,
  selectUser,
  selectIsAuthenticated,
  setUser as setUserAction,
} from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'

interface User {
  id: string
  email: string
  name: string
  companyName: string
  phoneNumber: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  sendOTP: (email: string, name?: string) => Promise<void>
  refetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could trigger logout
      console.log('Unauthorized request detected')
    }
    return Promise.reject(error)
  }
)

// Fetch current user from /auth/me endpoint
const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get('/auth/me/')

    // Handle different response structures
    // if (response.data?.success && response.data?.user) {
    //   return response.data.data.user;
    // }
    // console.log("Response Data:", response.data.data.user);
    if (response.data.data.user) {
      return response.data.data.user
    }

    if (response.data?.id && response.data?.email) {
      return response.data
    }

    return null
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Don't log 401 as errors - it's expected when not authenticated
      if (error.response?.status !== 401) {
        console.error('fetchCurrentUser error:', error.message)
      }
    }
    return null
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  // Fetch user data with optimized settings
  const {
    data: currentUser,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false
      }
      return failureCount < 2
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  // Update Redux store when user data changes
  useEffect(() => {
    if (currentUser) {
      dispatch(setUserAction(currentUser))
    }
  }, [currentUser, dispatch])

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const response = await api.post('/auth/verify-otp/', { email, otp })
      return response.data
    },
    onSuccess: (data) => {
      if (data.success && data.user) {
        dispatch(
          setCredentials({
            user: data.user,
            token: data.auth_token || data.token,
          })
        )

        // Refetch user data after successful login
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        }, 300)
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message
        console.error('Login failed:', message)
        throw new Error(message)
      }
    },
  })

  // Send OTP mutation
  const sendOTPMutation = useMutation({
    mutationFn: async ({ email, name }: { email: string; name?: string }) => {
      const response = await api.post('/auth/send-otp/', {
        email,
        name,
        isLogin: true,
      })
      return response.data
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message
        console.error('Send OTP failed:', message)
        throw new Error(message)
      }
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await api.post('/auth/logout/')
      } catch (error) {
        // Continue with logout even if API call fails
        console.error('Logout API call failed:', error)
      }
    },
    onSettled: () => {
      // Clear all state
      dispatch(logoutAction())
      queryClient.clear()
    },
  })

  // Public methods
  const login = async (email: string, otp: string) => {
    await loginMutation.mutateAsync({ email, otp })
  }

  const sendOTP = async (email: string, name?: string) => {
    await sendOTPMutation.mutateAsync({ email, name })
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
  }

  const handleRefetchUser = async () => {
    await refetchUser()
  }

  const value: AuthContextType = {
    user,
    isLoading: isLoading || loginMutation.isPending,
    isAuthenticated,
    login,
    logout,
    sendOTP,
    refetchUser: handleRefetchUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { api }

export const makeRequest = async (
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    data?: any
    headers?: Record<string, string>
  } = {}
) => {
  const { method = 'GET', data, headers } = options

  const response = await api.request({
    url: endpoint,
    method,
    data,
    headers,
  })

  return response.data
}
