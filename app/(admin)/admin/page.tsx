import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { applications, rooms, users } from '@/data'
import { ArrowRight, Bell, Building2, DollarSign, FileText, Plus, Settings, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Badge } from '@/components/ui/badge'

const stats = {
    totalRooms: rooms.length,
    availableRooms: rooms.filter(r => r.status === 'AVAILABLE').length,
    occupiedRooms: rooms.filter(r => r.status === 'OCCUPIED').length,
    pendingApplications: 1,
    totalRevenue: 0,
    monthlyRevenue: 0
}

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

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card className="border-l-4 border-l-blue-600">
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

                    <Card className="border-l-4 border-l-yellow-600">
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

                    <Card className="border-l-4 border-l-green-600">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Occupied Rooms
                            </CardTitle>
                            <Users className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.occupiedRooms}</div>
                            <p className="text-sm text-gray-500 mt-1">
                                {Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}% occupancy
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-600">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Monthly Revenue
                            </CardTitle>
                            <DollarSign className="h-5 w-5 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                ${stats.monthlyRevenue.toLocaleString()}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">This month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="mb-8 bg-linear-to-r from-primary/80 to-default text-white">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription className="text-blue-100">
                            Common administrative tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button variant="default" className="w-full" asChild>
                                <Link href="/admin/rooms/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Room
                                </Link>
                            </Button>

                            <Button variant="default" className="w-full" asChild>
                                <Link href="/admin/applications">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Review Applications
                                </Link>
                            </Button>

                            <Button variant="default" className="w-full" asChild>
                                <Link href="/admin/invoices">
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Manage Invoices
                                </Link>
                            </Button>

                            <Button variant="default" className="w-full" asChild>
                                <Link href="/admin/users">
                                    <Users className="mr-2 h-4 w-4" />
                                    Manage Users
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Applications */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Applications</CardTitle>
                                    <CardDescription>Latest application submissions</CardDescription>
                                </div>
                                <Button variant="ghost" className='hover:text-white' size="sm" asChild>
                                    <Link href="/admin/applications">
                                        View all
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {applications.map((app) => (
                                    <div
                                        key={app.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium">{app.applicant.name}</div>
                                            <div className="text-sm text-gray-500">{app.room.name}</div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {new Date(app.submittedAt).toLocaleDateString()}
                                            </div>
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
                        </CardContent>
                    </Card>

                    {/* Recent Users */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Users</CardTitle>
                                    <CardDescription>Newly registered users</CardDescription>
                                </div>
                                <Button variant="ghost" className='hover:text-white' size="sm" asChild>
                                    <Link href="/admin/users">
                                        View all
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {users.map((u) => (
                                    <div
                                        key={u.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <Users className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{u.name}</div>
                                                <div className="text-sm text-gray-500">{u.email}</div>
                                            </div>
                                        </div>
                                        {/* use user role */}
                                        <Badge variant="outline">{u.name}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default AdminPage