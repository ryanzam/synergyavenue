"use client"

import { logoutUser } from '@/actions/auth'
import { auth } from '@/lib/auth'
import { User2 } from 'lucide-react'
import React, { useState } from 'react'

const UserNav = ({ name }: { name: string }) => {

    const [showMenu, setShowMenu] = useState(false)

    return (
        <div className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-bold text-gray-900">{name.toUpperCase()}'s Portal</h1>
                <p className="mt-2 text-gray-600">Manage your shop space and applications</p>
            </div>

            <div className="relative group">
                <button className="flex items-center space-x-3 focus:outline-none cursor-pointer">
                    <span className='border-2 border-gray-300 p-1 rounded-full'>
                        <User2 />
                    </span>
                    <svg className="h-5 w-5 group-hover:text-gray-900 transition" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out origin-top-right transform scale-95 group-hover:scale-100">
                    <div className="py-1" role="menu" aria-orientation="vertical">

                        <div className="px-4 py-3 border-b border-gray-200">
                            <p className="text-sm font-medium text-gray-900">{name}</p>
                            {/*                             <p className="text-xs text-gray-500">john@example.com</p>
 */}                        </div>

                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition" role="menuitem">My Profile</a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition" role="menuitem">Settings</a>
                        <div className="border-t border-gray-200"></div>

                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition" role="menuitem" onClick={logoutUser}>Sign out</a>
                    </div>
                </div>

            </div>


        </div>
    )
}

export default UserNav