import { Button } from '@/components/ui/button'
import { Building2, Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const AdminRoomPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" className='hover:text-white'>
                                <Link href="/admin">← </Link>
                            </Button>
                            <div className="h-6 w-px bg-gray-300" />
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                <h1 className="text-[16px] font-bold text-gray-900">Manage Rooms</h1>
                            </div>
                        </div>

                        <Button asChild>
                            <Link href="/admin/rooms/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Room
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

        </div>
    )
}

export default AdminRoomPage