import React from 'react'
import Header from '../calculator/Header'
import SignupFormDemo from '../signup-form-demo'

const ContactCarboncutForm = () => {
    return (
        <div>
            <Header />

            <div className="relative z-10 flex flex-col  justify-start min-h-screen px-4 sm:px-6 md:px-8  pt-24 sm:pt-28 md:pt-32 lg:pt-40">
               <SignupFormDemo/>
            </div>

        </div>
    )
}

export default ContactCarboncutForm
