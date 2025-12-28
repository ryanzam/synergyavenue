import { Button } from '@/components/ui/button'
import { Bell, Building2, Settings } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const AdminPage = () => {
    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
                                <p className="text-sm text-gray-500">SynergyAvenue</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" className='hover:text-white' size="sm" asChild>
                                <Link href="/admin/settings">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" className="hover:text-white">
                                <Bell className="h-4 w-4" />
                                {/* implement later */}
                                {/* {recentActivity.filter(n => !n.read).length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {recentActivity.filter(n => !n.read).length}
                                    </span>
                                )} */}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default AdminPage