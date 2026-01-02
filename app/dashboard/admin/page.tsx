import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import UserNav from '@/components/user/UserNav';
import { applications, rooms } from '@/data';
import { IUser } from '@/interfaces';
import prisma from '@/lib/prisma';
import { Building2, DollarSign, FileText, Users } from 'lucide-react'
import Link from 'next/link';
import React from 'react'

const AdminDashboardPage = async ({ user }: { user: IUser }) => {

    const [applications, rooms, tenants, invoices] = await Promise.all([
        prisma.application.findMany({
            include: {
                applicant: true,
                room: true,
            },
            orderBy: { submittedAt: 'desc' },
            take: 10,
        }),
        prisma.room.findMany({
            include: {
                currentTenant: true,
            },
        }),
        prisma.user.findMany({
            where: { role: 'TENANT' },
        }),
        prisma.invoice.findMany({
            where: { status: 'PAID' },
        }),
    ]);

    const stats = {
        totalRooms: rooms.length,
        availableRooms: rooms.filter(r => r.status === 'AVAILABLE').length,
        occupiedRooms: rooms.filter(r => r.status === 'OCCUPIED').length,
        pendingApplications: applications.filter(a => a.status === 'PENDING').length,
        totalRevenue: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <UserNav name={user.name} />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Rooms
                            </CardTitle>
                            <Building2 className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.totalRooms}</div>
                            <p className="text-sm text-gray-500 mt-1">
                                {stats.availableRooms} available
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Pending Applications
                            </CardTitle>
                            <FileText className="h-5 w-5 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.pendingApplications}</div>
                            <p className="text-sm text-gray-500 mt-1">Awaiting review</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Active Tenants
                            </CardTitle>
                            <Users className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{2}</div>
                            <p className="text-sm text-gray-500 mt-1">
                                {stats.occupiedRooms} occupied rooms
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-5 w-5 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                ${stats.totalRevenue.toLocaleString()}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">From paid invoices</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Applications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Applications</CardTitle>
                            <CardDescription>Latest applications awaiting review</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {applications.slice(0, 5).map((app) => (
                                    <div
                                        key={app.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium">{app.applicant.name}</div>
                                            <div className="text-sm text-gray-500">{app.room.name}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                className={
                                                    app.status === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : app.status === 'APPROVED'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                }
                                            >
                                                {app.status}
                                            </Badge>
                                            <Button size="sm" asChild>
                                                <Link href={`/admin/applications/${app.id}`}>Review</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {applications.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">No applications yet</p>
                                )}
                            </div>
                            <Button variant="outline" className="w-full mt-4" asChild>
                                <Link href="/admin/applications">View All Applications</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Room Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Room Status</CardTitle>
                            <CardDescription>Overview of all shop spaces</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {rooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div>
                                            <div className="font-medium">{room.name}</div>
                                            <div className="text-sm text-gray-500">
                                                ${8000}/mo
                                            </div>
                                        </div>
                                        <Badge
                                            className={
                                                room.status === 'AVAILABLE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : room.status === 'OCCUPIED'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                            }
                                        >
                                            {room.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-4" asChild>
                                <Link href="/admin/rooms">Manage Rooms</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}

export default AdminDashboardPage