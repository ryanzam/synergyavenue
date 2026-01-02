import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import UserNav from '@/components/user/UserNav'
import { IUser } from '@/interfaces'
import prisma from '@/lib/prisma'
import { Badge, Calendar, FileText } from 'lucide-react'
import Link from 'next/link'

const GuestDashboardPage = async ({ user }: { user: IUser }) => {

    const userId = user.id;

    const applications = await prisma.application.findMany({
        where: { applicantId: userId },
        include: { room: true },
        orderBy: { submittedAt: 'desc' },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">

                {/* Header */}
                <UserNav name={user.name}/>

                <Card className="max-w-2xl w-full">
                    <CardHeader>
                        <CardTitle>Your Applications</CardTitle>
                        <CardDescription>Track the status of your applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {applications.length > 0 ? (
                            <div className="space-y-4">
                                {applications.map((app) => (
                                    <div
                                        key={app.id}
                                        className="p-4 border rounded-lg"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium">{app.room.name}</div>
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
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">You haven't submitted any applications yet</p>
                                <Button variant='default'>
                                    <Link href="/">Browse Available Rooms</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default GuestDashboardPage