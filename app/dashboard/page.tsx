import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AdminDashboardPage from './admin/page';
import GuestDashboardPage from './guest/page';
import TenantDashboardPage from './tenant/page';

const DashboardPage = async () => {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        redirect('/login');
    }

    // Route to appropriate dashboard based on role
    if (user.role === 'ADMIN') {
        return <AdminDashboardPage user={user} />;
    } else if (user.role === 'TENANT') {
        return <TenantDashboardPage user={user} />;
    } else {
        return <GuestDashboardPage user={user} />;
    }
}

export default DashboardPage