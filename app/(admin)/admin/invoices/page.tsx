import { requireAdmin } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge, Calendar, CreditCard, DollarSign, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const AdminInvoicesPage = async () => {

    const { user: currentUser } = await requireAdmin()

    const invoices = []

    const stats = {
        total: 0,
        paid: 0,
        pending: 0,
        overdue: 0,
        totalPaid: 11,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild className='hover:text-white text-accent'>
                            <Link href="/admin">← </Link>
                        </Button>
                        <div className="h-6 w-px bg-gray-300" />
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-purple-600" />
                            <h1 className="text-[16px] font-bold text-gray-900">My Invoices</h1>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-6xl">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total Invoices</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
                            <div className="text-sm text-gray-600">Paid</div>
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
                            <div className="text-xl font-bold text-gray-900">
                                ${stats.totalPaid.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Total Paid</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Invoices List */}
                {invoices.length === 0 ? (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Invoices Yet</h3>
                            <p className="text-gray-600">
                                Your invoices will appear here once they are generated.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {/*  {invoices.map((invoice) => (
                            <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    ${invoice.amount.toLocaleString()}
                                                </h3>
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

                                            <div className="flex gap-6 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                                                </div>
                                                {invoice.paidAt && (
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="h-4 w-4" />
                                                        <span>Paid: {new Date(invoice.paidAt).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {invoice.items && invoice.items.length > 0 && (
                                                <div className="mt-3 space-y-1">
                                                    {(invoice.items as any[]).map((item: any, index: number) => (
                                                        <div key={index} className="text-sm text-gray-600">
                                                            • {item.description}: ${item.amount.toLocaleString()}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {invoice.status !== 'PAID' && invoice.stripeInvoiceId && (
                                                <Button asChild>
                                                    <a
                                                        href={`https://invoice.stripe.com/i/${invoice.stripeInvoiceId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <CreditCard className="h-4 w-4 mr-2" />
                                                        Pay Now
                                                    </a>
                                                </Button>
                                            )}
                                            {invoice.stripeInvoiceId && (
                                                <Button variant="outline" asChild>
                                                    <a
                                                        href={`https://invoice.stripe.com/i/${invoice.stripeInvoiceId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                        View
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))} */}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminInvoicesPage