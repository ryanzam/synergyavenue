import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import UserNav from '@/components/user/UserNav';
import { IUser } from '@/interfaces';
import prisma from '@/lib/prisma';
import { Badge, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const TenantDashboardPage = async ({ user }: { user: IUser }) => {

    const userId = user.id;

    const [applications, invoices, events, contracts] = await Promise.all([
        prisma.application.findMany({
            where: { applicantId: userId },
            include: { room: true },
            orderBy: { submittedAt: 'desc' },
        }),
        prisma.invoice.findMany({
            where: { tenantId: userId },
            orderBy: { createdAt: 'desc' },
            take: 5,
        }),
        prisma.logisticsEvent.findMany({
            where: {
                OR: [
                    { tenantId: userId },
                    { application: { applicantId: userId } },
                ],
                scheduledAt: { gte: new Date() },
            },
            orderBy: { scheduledAt: 'asc' },
            take: 5,
        }),
        prisma.legalDocument.findMany({
            where: { tenantId: userId },
            orderBy: { createdAt: 'desc' },
        }),
    ]);

    const activeApplication = applications.find(a => a.status === 'APPROVED' || a.status === 'PENDING');

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
               {/* Header */}
                <UserNav name={user.name}/>

                {/* Application Status */}
                {activeApplication && (
                    <Card className="mb-8 border-2 border-blue-200">
                        <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50">
                            <CardTitle>Current Application</CardTitle>
                            <CardDescription>{activeApplication.room.name}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-600">Status</div>
                                    <Badge
                                        className={
                                            activeApplication.status === 'APPROVED'
                                                ? 'bg-green-100 text-green-800 mt-1'
                                                : 'bg-yellow-100 text-yellow-800 mt-1'
                                        }
                                    >
                                        {activeApplication.status}
                                    </Badge>
                                </div>
                                <Button variant="default">
                                    <Link href="/portal/application">View Details</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Invoices */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Invoices</CardTitle>
                            <CardDescription>Your payment history</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {invoices.map((invoice) => (
                                    <div
                                        key={invoice.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div>
                                            <div className="font-medium">${invoice.amount.toLocaleString()}</div>
                                            <div className="text-sm text-gray-500">
                                                Due: {new Date(invoice.dueDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <Badge
                                            className={
                                                invoice.status === 'PAID'
                                                    ? 'bg-green-100 text-green-800'
                                                    : invoice.status === 'OVERDUE'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                            }
                                        >
                                            {invoice.status}
                                        </Badge>
                                    </div>
                                ))}
                                {invoices.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">No invoices yet</p>
                                )}
                            </div>
                            <Button variant="outline" className="w-full mt-4 hover:text-white">
                                <Link href="/portal/invoices">View All Invoices</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Upcoming Events */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Events</CardTitle>
                            <CardDescription>Scheduled viewings and appointments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-start gap-3 p-3 border rounded-lg"
                                    >
                                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="font-medium">{event.title}</div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(event.scheduledAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {events.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">No upcoming events</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contracts */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Signed Contracts</CardTitle>
                            <CardDescription>Your rental agreements</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {contracts.map((contract) => (
                                    <div
                                        key={contract.id}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <div className="font-medium">{contract.type.replace('_', ' ')}</div>
                                                <div className="text-sm text-gray-500">
                                                    {contract.signedByTenantAt && contract.signedByAdminAt
                                                        ? 'Fully Executed'
                                                        : 'Pending Signatures'}
                                                </div>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={contract.pdfUrl || '#'}>Download</Link>
                                        </Button>
                                    </div>
                                ))}
                                {contracts.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">No contracts yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default TenantDashboardPage