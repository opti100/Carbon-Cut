import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

interface JWTPayload {
  userId: string
  email: string
  name: string
  iat?: number
  exp?: number
}

export async function getServerSideUser(): Promise<{
  user: JWTPayload | null
  isAuthenticated: boolean
}> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')

    if (!token) {
      return { user: null, isAuthenticated: false }
    }

    const decoded = jwt.verify(
      token.value,
      process.env.JWT_SECRET || 'your-secret-key-change-this'
    ) as JWTPayload

    return {
      user: decoded,
      isAuthenticated: true,
    }
  } catch (error) {
    console.error('Server auth error:', error)
    return { user: null, isAuthenticated: false }
  }
}
