'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginPage from '@/components/auth/login/Login'

const Page = () => {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard') 
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null 
  }

  return <LoginPage />
}

export default Page