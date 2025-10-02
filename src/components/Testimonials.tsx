import Image from 'next/image'
import React from 'react'

const Testimonials = () => {
  return (
    <div>
     <h2 className="text-3xl lg:text-6xl lg:leading-tight max-w-7xl mx-auto text-center tracking-tight font-bold text-gray-800 mb-6">
           What Industry Leaders Say About {" "}
            <span className="text-tertiary">CarbonCut</span>
          </h2> 
    <div className='flex justify-center items-center mb-10 rounded-2xl '> 
    
      <Image src="/people/groupies.gif" alt='something' width={1000} height={500} ></Image>
    </div>
    </
    div>
  )
}

export default Testimonials
