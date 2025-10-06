import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { ArrowBigLeft, CircleChevronLeft, User } from 'lucide-react'
import Link from 'next/link'

const Header = () => {
    return (
        <div>
            <header
                className={`
           top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
         
        `}
            >
                <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-6 h-15">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/carboncutlogo26-9.svg"
                            alt="CarbonCut Logo"
                            width={128}
                            height={128}
                            className="w-48 h-48"
                        />
                    </div>
                    <div className='flex  items-center space-x-4'>
                        <div className="flex items-center space-x-4">
                            {/* Dropdown Container */}
                            <div className="relative group">
                                {/* Dropdown Trigger */}
                                <Button
                                    variant="ghost"
                                    size={"lg"}
                                    className="bg-black text-white px-6 py-4 text-sm font-medium hover:bg-tertiary hover:text-white rounded-sm h-9 transition-colors duration-200 cursor-pointer flex items-center gap-2"
                                >
                                    Products

                                    {/* Dropdown Arrow */}
                                    <svg
                                        className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </Button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="py-1">
                                        {/* Menu Item 1 */}
                                        <Link href="/calculator">
                                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
                                                CarbonCalculator
                                            </button>
                                        </Link>

                                        {/* Menu Item 2 */}
                                        <Link href="/">
                                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
                                                CarbonOffset
                                            </button>
                                        </Link>

                                        {/* Menu Item 3 */}
                                        <Link href="/">
                                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
                                                CarbonToken
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <Link href="/login">

                            <Button
                                variant="ghost"
                                size={"lg"}
                                className="bg-black text-white px-6 py-4 text-sm font-medium hover:bg-tertiary hover:text-white rounded-sm h-9 transition-colors duration-200 cursor-pointer" >
                                <User />   Login
                            </Button>
                        </Link>

                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Header
