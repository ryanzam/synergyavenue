import { requireAdmin } from '@/actions/auth'
import { deleteRoom, getRooms } from '@/actions/rooms'
import Loading from '@/components/loading/Loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Building2, DollarSign, Edit, Eye, Maximize2, Plus, Search, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import RoomStatusBadge from '@/components/room/room-status-badge'
import { RoomStatus } from '@/enums'
import RoomDeleteBtn from '@/components/room/room-delete-btn'

const AdminRoomPage = async ({
    searchParams
}: {
    searchParams: Promise<{ status?: string; search?: string }>
}) => {

    await requireAdmin()

    const { search, status } = await searchParams

    const { success, rooms } = await getRooms({ status });

    if (!success) return <Loading />

    const stats = {
        total: rooms ? rooms.length : 0,
        available: rooms ? rooms.filter(r => r.status === 'AVAILABLE').length : null,
        occupied: rooms ? rooms.filter(r => r.status === 'OCCUPIED').length : null,
        pending: rooms ? rooms.filter(r => r.status === 'PENDING').length : null,
        maintenance: rooms ? rooms.filter(r => r.status === 'MAINTENANCE').length : null,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm"
                                className='hover:text-white'>
                                <Link href="/admin">← </Link>
                            </Button>
                            <div className="h-6 w-px bg-gray-300" />
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                <h1 className="text-[16px] font-bold text-gray-900">Manage Rooms</h1>
                            </div>
                        </div>

                        <Button
                            asChild
                            className='hover:text-white'>
                            <Link href="/admin/rooms/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Room
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total Rooms</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                            <div className="text-sm text-gray-600">Available</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-blue-600">{stats.occupied}</div>
                            <div className="text-sm text-gray-600">Occupied</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                            <div className="text-sm text-gray-600">Pending</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-orange-600">{stats.maintenance}</div>
                            <div className="text-sm text-gray-600">Maintenance</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search rooms..."
                                    //defaultValue={searchParams}
                                    className="pl-10"
                                    name="search"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    variant={!status || status === 'ALL' ? 'default' : 'outline'}
                                    size="sm"
                                    asChild
                                    className='hover:text-white'
                                >
                                    <Link href="/admin/rooms?status=ALL">All</Link>
                                </Button>
                                <Button
                                    variant={status === 'AVAILABLE' ? 'default' : 'outline'}
                                    size="sm"
                                    asChild
                                    className='hover:text-white'
                                >
                                    <Link href="/admin/rooms?status=AVAILABLE">Available</Link>
                                </Button>
                                <Button
                                    variant={status === 'OCCUPIED' ? 'default' : 'outline'}
                                    size="sm"
                                    asChild
                                    className='hover:text-white'
                                >
                                    <Link href="/admin/rooms?status=OCCUPIED">Occupied</Link>
                                </Button>
                                <Button
                                    variant={status === 'PENDING' ? 'default' : 'outline'}
                                    size="sm"
                                    asChild
                                    className='hover:text-white'
                                >
                                    <Link href="/admin/rooms?status=PENDING">Pending</Link>
                                </Button>
                                <Button
                                    variant={status === 'MAINTENANCE' ? 'default' : 'outline'}
                                    size="sm"
                                    asChild
                                    className='hover:text-white'
                                >
                                    <Link href="/admin/rooms?status=MAINTENANCE">Maintenance</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Rooms Grid */}
                {rooms && rooms.length === 0 ? (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No rooms found</h3>
                            <p className="text-gray-600 mb-4">
                                {search || status
                                    ? 'Try adjusting your filters'
                                    : 'Get started by adding your first room'}
                            </p>
                            <Button
                                asChild
                                className='hover:text-white'>
                                <Link href="/admin/rooms/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Room
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms && rooms.map((room) => (
                            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Room Image */}
                                <div className="relative h-48 bg-gray-200">
                                    {room.photo ? (
                                        <Image
                                            src={room?.photo || '/placeholder-image.png'}
                                            alt={room?.name || 'Room image'}
                                            fill
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <Building2 className="h-16 w-16 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        {room && <RoomStatusBadge status={room.status as RoomStatus} />}
                                    </div>
                                </div>

                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>{room.name}</span>
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {room.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Maximize2 className="h-4 w-4" />
                                                <span>{room.sizeSqFt} sq ft</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                                <DollarSign className="h-4 w-4" />
                                                <span>${room.monthlyRent.toLocaleString()}/mo</span>
                                            </div>
                                        </div>

                                        {room.currentTenant && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                                <Users className="h-4 w-4 text-blue-600" />
                                                <span className="font-medium">Tenant:</span>
                                                <span>{room.currentTenant.name}</span>
                                            </div>
                                        )}

                                        {/* {room.applications.length > 0 && (
                                            <div className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                                                {room.applications.length} pending application(s)
                                            </div>
                                        )} */}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1 hover:text-white" asChild>
                                            <Link href={`/rooms/${room.id}`}>
                                                <Eye className="h-4 w-4 mr-2" />
                                                View
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 hover:text-white" asChild>
                                            <Link href={`/admin/rooms/edit/${room.id}`}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Link>
                                        </Button>

                                        <RoomDeleteBtn roomId={room.id} roomName={room.name} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminRoomPage