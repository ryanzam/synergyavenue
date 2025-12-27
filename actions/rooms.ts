import z from "zod";
import { getCurrentUser, requireAdmin } from "./users";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const roomSchema = z.object({
    name: z.string().min(2, 'Room name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    sizeSqFt: z.number().int().positive('Size must be a positive number'),
    monthlyRent: z.number().positive('Monthly rent must be a positive number'),
    deposit: z.number().positive('Deposit must be a positive number'),
    status: z.enum(['AVAILABLE', 'PENDING', 'OCCUPIED', 'MAINTENANCE']).default('AVAILABLE'),
    photos: z.array(z.string().url()).default([])
});

// ============================================================================
// SERVER ACTIONS
// ============================================================================

export async function createRoom(data: z.infer<typeof roomSchema>) {
    try {
        const user = await getCurrentUser();
        requireAdmin(user);

        const validatedData = roomSchema.parse(data);

        const room = await prisma.room.create({
            data: {
                name: validatedData.name,
                description: validatedData.description,
                sizeSqFt: validatedData.sizeSqFt,
                monthlyRent: validatedData.monthlyRent,
                deposit: validatedData.deposit,
                photos: validatedData.photos,
                status: validatedData.status,
            },
        });

        // 4. Revalidate paths
        revalidatePath('/');
        revalidatePath('/admin/rooms');

        return {
            success: true,
            room,
            message: 'Room created successfully',
        };

    } catch (error) {
        console.error('Create room error:', error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: 'Validation failed',
                errors: error.message,
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create room',
        };
    }
}