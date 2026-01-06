import NextAuth, { type DefaultSession } from 'next-auth';
import prisma from './prisma'
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from "bcryptjs";
import { UserRole } from '@prisma/client';
declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: UserRole;
        } & DefaultSession['user'];
    }

    interface User {
        role?: UserRole
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
                    role: user.role
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
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
