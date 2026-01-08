import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export const useAuthRedirect = () => {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const redirectToLogin = (redirectPath: string = pathname) => {
    router.push(`/login?redirectTo=${encodeURIComponent(redirectPath)}`)
  }

  const redirectToSignup = (redirectPath: string = pathname) => {
    router.push(`/signup?redirectTo=${encodeURIComponent(redirectPath)}`)
  }

  return { isAuthenticated, redirectToLogin, redirectToSignup }
}
