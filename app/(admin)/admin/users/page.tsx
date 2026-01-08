import { getAllUsers, requireAdmin } from '@/actions/auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import UserUpdateRoleBtn from '@/components/user/user-updaterole-btn'
import { Users, Search, Mail, Phone, Shield } from 'lucide-react'
import Link from 'next/link'

const AdminUserPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ role?: string; search?: string }>;
}) => {

    const { user: currentUser } = await requireAdmin()

    const { role, search } = await searchParams

    const { success, users } = await getAllUsers({ role, search })

    const stats = {
        total: users?.length,
        admin: users?.filter(u => u.role === 'ADMIN').length,
        tenant: users?.filter(u => u.role === 'TENANT').length,
        guest: users?.filter(u => u.role === 'GUEST').length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild className='hover:text-white'>
                            <Link href="/admin">←</Link>
                        </Button>
                        <div className="h-6 w-px bg-gray-300" />
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            <h1 className="text-xl font-bold text-gray-900">Manage Users</h1>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total Users</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-purple-600">{stats.admin}</div>
                            <div className="text-sm text-gray-600">Admins</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-blue-600">{stats.tenant}</div>
                            <div className="text-sm text-gray-600">Tenants</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-green-600">{stats.guest}</div>
                            <div className="text-sm text-gray-600">Guests</div>
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
                                    placeholder="Search by name or email..."
                                    defaultValue={search}
                                    className="pl-10"
                                    name="search"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    variant={!role || role === 'ALL' ? 'default' : 'outline'}
                                    size="sm"
                                    asChild
                                    className='hover:text-white'
                                >
                                    <Link href="/admin/users?role=ALL">All</Link>
                                </Button>
                                <Button
                                    variant={role === 'ADMIN' ? 'default' : 'outline'}
                                    size="sm"
                                    asChild
                                    className='hover:text-white'
                                >
                                    <Link href="/admin/users?role=ADMIN">Admins</Link>
                                </Button>
                                <Button
                                    variant={role === 'TENANT' ? 'default' : 'outline'}
                                    size="sm"
                                    asChild
                                    className='hover:text-white'
                                >
                                    <Link href="/admin/users?role=TENANT">Tenants</Link>
                                </Button>
                                <Button
                                    variant={role === 'GUEST' ? 'default' : 'outline'}
                                    size="sm"
                                    asChild
                                    className='hover:text-white'
                                >
                                    <Link href="/admin/users?role=GUEST">Guests</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                {users?.length === 0 ? (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                            <p className="text-gray-600">
                                {search || role
                                    ? 'Try adjusting your filters'
                                    : 'No users in the system yet'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Users ({users?.length})</CardTitle>
                            <CardDescription>Manage user accounts and roles</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Stats</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users?.map((user) => (
                                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{user.name}</div>
                                                            {user.id === currentUser.id && (
                                                                <Badge variant="outline" className="text-xs">You</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Mail className="h-3 w-3" />
                                                            {user.email}
                                                        </div>
                                                        {user.phone && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Phone className="h-3 w-3" />
                                                                {user.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge
                                                        className={
                                                            user.role === 'ADMIN'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : user.role === 'TENANT'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-green-100 text-green-800'
                                                        }
                                                    >
                                                        {user.role === 'ADMIN' && <Shield className="h-3 w-3 mr-1" />}
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    {/* <div className="text-sm text-gray-600">
                                                        {user.applications.length} app(s), {user.invoices.length} invoice(s)
                                                    </div> */}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="text-sm text-gray-600">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    {user.id !== currentUser.id && (
                                                        <UserUpdateRoleBtn userId={user.id} currentRole={user.role} userName={user.name} />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default AdminUserPage