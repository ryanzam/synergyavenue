import RoomForm from '@/components/room/room-form';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Building2 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

const AdminRoomNewPage = async () => {

    const session = await auth();

    if (!session?.user?.email) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user || user.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className='hover:text-white'>
                            <Link href="/admin/rooms">← </Link>
                        </Button>
                        <div className="h-6 w-px bg-gray-300" />
                        <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            <h1 className="text-[16px] font-bold text-gray-900">Add New Room</h1>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
                <RoomForm />
            </div>
        </div>
    )
}

export default AdminRoomNewPage