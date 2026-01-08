import dynamic from 'next/dynamic'
import { Suspense } from 'react'
const Signup = dynamic(() => import('../../components/auth/signup/Signup'))

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Signup />
    </Suspense>
  )
}

export default page
