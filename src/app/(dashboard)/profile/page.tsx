'use client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'

const Page = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  const { data: user, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/auth/me`, {
        withCredentials: true,
      })
      return response.data.data.user
    },
  })
  console.log('User Data:', user)
  if (isLoading) {
    return <div>Loading ...</div>
  }
  return (
    <div>
      <h1>Profile Page</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
    </div>
  )
}

export default Page
