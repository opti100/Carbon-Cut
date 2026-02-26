import { ReportsTab } from '@/components/dashboard/profile/MonthlyReports'
import React from 'react'

const page = () => {
    return (
        <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans pb-10">
            <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Emission Reports</h1>
                        <p className="text-[13px] text-gray-500 mt-0.5">Reports that includes all factors of emission</p>
                    </div>
                </div>
                <ReportsTab />
            </div>
        </div>
    )
}

export default page
