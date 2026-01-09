import React from 'react'
import { Props } from './Cdn'
import FloatingInput from '../ui/FloatingInput'
import Dropdown from '../ui/dropdown'
import state from 'country-state-city/lib/state'
import city from 'country-state-city/lib/city'
import country from 'country-state-city/lib/country'
import { Country } from 'country-state-city'

const OnPrem = ({ onBack, onNext }: Props) => {
    
  return (
    <div>
       <FloatingInput placeholder="name" size="small"/>
       <FloatingInput placeholder="CPU cores" size="small"/>
       <FloatingInput placeholder="RAM (GB)" size="small"/>
       <FloatingInput placeholder="Storage (TB)" size="small"/>
       <FloatingInput placeholder="Storage (TB)" size="small"/>
       <FloatingInput placeholder="AVG CPU Utilization" size="small"/>
       <FloatingInput placeholder="Hours/Day" size="small"/>
   
    </div>
  )
}

export default OnPrem
