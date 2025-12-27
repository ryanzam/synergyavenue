import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
}

export function requireAdmin(user: { role: string }) {
    if (user.role !== 'ADMIN') {
        throw new Error('Admin access required');
    }
}