import { redirect } from 'next/navigation'
import React from 'react'

const page = () => {
  redirect('/dashboard/campaigns')
}

export default page
