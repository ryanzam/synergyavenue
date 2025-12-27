"use server"

import { success, z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// schemas for auth actions
const registerSchema = z.object({
    name: z.string().min(3, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Phone number is required'),
    homeAddress: z.string().min(5, 'Home address is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const updateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    businessName: z.string().optional(),
    businessType: z.string().optional(),
    avatarUrl: z.string().url().optional(),
});

// server actions
export async function registerUser(prevState: any, formData: FormData) {
    try {
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            homeAddress: formData.get('homeAddress') as string,
            password: formData.get('password') as string,
        };

        const validateData = registerSchema.parse(data);

        const existingUser = await prisma.user.findUnique({
            where: { email: validateData.email },
        });

        if (existingUser) {
            return {
                success: false,
                error: "User with this email already exists.",
            }
        }

        const hashedPassword = await bcrypt.hash(validateData.password, 10);

        const user = await prisma.user.create({
            data: {
                name: validateData.name,
                phone: validateData.phone,
                email: validateData.email,
                homeAddress: validateData.homeAddress,
                password: hashedPassword,
                role: 'GUEST',
            }
        });

        return {
            success: true,
            message: "Registration successful. Please log in.",
        }
    }
    catch (error) {
        console.error('Registration error:', error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: "Validation failed"
            }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create account'
        }
    }
}

export async function loginUser(data: z.infer<typeof loginSchema>) {
    try {
        const validateData = loginSchema.parse(data);

        const result = await signIn('credentials', {
            email: validateData.email,
            password: validateData.password,
            redirect: false,
        });

        if (result?.error) {
            return {
                success: false,
                error: "Invalid email or password.",
            }
        }

        return {
            success: true,
            message: "Sign in successful.",
        }
    } catch (error) {
        console.error('Login user error:', error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: "Validation failed"
            }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to sign in'
        }
    }
}

export async function logoutUser() {
    try {
        await signOut({ redirect: false });

        return {
            success: true,
            message: "Sign out successful.",
        }
    } catch (error) {
        console.error('Logout user error:', error);

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to sign out'
        }
    }
}

export async function getCurrentSession() {
    try {
        const session = await auth();

        if (!session?.user.email) {
            return {
                success: false,
                error: "Not authenticated."
            }
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                businessName: true,
                businessType: true,
                createdAt: true,
            }
        });

        if (!user) {
            return {
                success: false,
                error: "User not found."
            }
        }

        return {
            success: true,
            user,
        }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get session'
        }
    }
}

export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
    try {
        // 1. Get current user
        const session = await auth();

        if (!session?.user?.email) {
            return {
                success: false,
                error: 'Not authenticated',
            };
        }

        // 2. Validate input
        const validatedData = updateProfileSchema.parse(data);

        // 3. Update user
        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: validatedData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                businessName: true,
                businessType: true,
            },
        });

        // 4. Revalidate paths
        revalidatePath('/dashboard');
        revalidatePath('/portal');

        return {
            success: true,
            user,
            message: 'Profile updated successfully',
        };

    } catch (error) {
        console.error('Update profile error:', error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: 'Validation failed'
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update profile',
        };
    }
}

export async function changePassword(currentPassword: string, newPassword: string) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return {
                success: false,
                error: 'Not authenticated',
            };
        }

        if (newPassword.length < 8) {
            return {
                success: false,
                error: 'New password must be at least 8 characters',
            };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        return {
            success: true,
            message: 'Password changed successfully',
        };

    } catch (error) {
        console.error('Change password error:', error);
        return {
            success: false,
            error: 'Failed to change password',
        };
    }
}

export async function updateUserRole(
    userId: string,
    role: 'ADMIN' | 'TENANT' | 'GUEST'
) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return {
                success: false,
                error: 'Not authenticated',
            };
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!currentUser || currentUser.role !== 'ADMIN') {
            return {
                success: false,
                error: 'Admin access required',
            };
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        revalidatePath('/admin/users');

        return {
            success: true,
            user,
            message: `User role updated to ${role}`,
        };

    } catch (error) {
        console.error('Update user role error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update user role',
        };
    }
}

export async function getAllUsers(filters?: {
    role?: string;
    search?: string;
}) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return {
                success: false,
                error: 'Not authenticated',
            };
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!currentUser || currentUser.role !== 'ADMIN') {
            return {
                success: false,
                error: 'Admin access required',
            };
        }

        const where: any = {};

        if (filters?.role) {
            where.role = filters.role;
        }

        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
                { businessName: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                businessName: true,
                businessType: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            success: true,
            users,
        };

    } catch (error) {
        console.error('Get all users error:', error);
        return {
            success: false,
            error: 'Failed to get users',
        };
    }
}