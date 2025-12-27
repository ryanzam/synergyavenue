import NextAuth, { type DefaultSession } from 'next-auth';
import prisma from './prisma'
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from "bcryptjs";
declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: 'ADMIN' | 'GUEST' | 'TENANT';
        } & DefaultSession['user'];
    }
}

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(credentials.password as string, user.password);

                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                //token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as 'ADMIN' | 'TENANT' | 'GUEST';
            }
            return session;
        },
    },
    secret: process.env.AUTH_SECRET
});

/**
 * Check if user is authenticated
 */
export async function requireAuth() {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }
    return session;
}

/**
 * Check if user has admin role
 */
export async function requireAdmin() {
    const session = await requireAuth();
    if (session.user.role !== 'ADMIN') {
        throw new Error('Admin access required');
    }
    return session;
}

/**
 * Check if user has tenant or admin role
 */
export async function requireTenant() {
    const session = await requireAuth();
    if (session.user.role !== 'TENANT' && session.user.role !== 'ADMIN') {
        throw new Error('Tenant access required');
    }
    return session;
}