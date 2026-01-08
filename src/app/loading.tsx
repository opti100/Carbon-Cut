'use client'
import { useState, useEffect } from 'react'

export default function HorizontalLoader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => setProgress(progress + 1), 30)
      return () => clearTimeout(timer)
    }
  }, [progress])

  return (
    <div className="w-full min-h-screen flex items-center  justify-center bg-[#fcfdf6]  ">
      <div className="w-[90%] ">
        {/* percentage text centered */}
        <div className="text-center mb-3 text-sm font-semibold">{progress}%</div>

        {/* progress bar */}
        <div className="relative w-full h-1  rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
