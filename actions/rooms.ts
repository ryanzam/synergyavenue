import z from "zod";
import { getCurrentUser, requireAdmin } from "./users";
import prisma from "@/lib/prisma";
import { RoomStatus } from "@/enums";

const roomSchema = z.object({
    name: z.string().min(2, 'Room name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    sizeSqFt: z.number().int().positive('Size must be a positive number'),
    monthlyRent: z.number().positive('Monthly rent must be a positive number'),
    deposit: z.number().positive('Deposit must be a positive number'),
    status: z.enum(['AVAILABLE', 'PENDING', 'OCCUPIED', 'MAINTENANCE']).default('AVAILABLE'),
    photos: z.array(z.string().url()).default([])
});

const updateRoomSchema = roomSchema.partial().extend({
    id: z.string().min(1),
});

// types
type UpdateData = { success: boolean; error: string; room?: undefined; message?: undefined; }
    | { success: boolean; room: z.infer<typeof roomSchema>; message: string; error?: undefined; }
    | null

type CreateData = { name: string; description: string; sizeSqFt: number; monthlyRent: number; deposit: number; status: RoomStatus; photos: string[] } | z.infer<typeof roomSchema>;

// ============================================================================
// SERVER ACTIONS
// ============================================================================

export async function createRoom(data: CreateData) {
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

export async function updateRoom(data: UpdateData) {
    try {
        const user = await getCurrentUser();
        requireAdmin(user);

        const validatedData = updateRoomSchema.parse(data);
        const { id, ...updateData } = validatedData;

        const existingRoom = await prisma.room.findUnique({
            where: { id },
        });

        if (!existingRoom) {
            return {
                success: false,
                error: 'Room not found',
            };
        }

        const room = await prisma.room.update({
            where: { id },
            data: updateData,
        });

        return {
            success: true,
            room,
            message: 'Room updated successfully',
        };

    } catch (error) {
        console.error('Update room error:', error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: 'Validation failed',
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update room',
        };
    }
}

export async function deleteRoom(roomId: string) {
    try {
        const user = await getCurrentUser();
        requireAdmin(user);

        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: {
                applications: {
                    where: {
                        status: {
                            in: ['PENDING', 'APPROVED'],
                        },
                    },
                },
            },
        });

        if (!room) {
            return {
                success: false,
                error: 'Room not found',
            };
        }

        if (room.applications.length > 0) {
            return {
                success: false,
                error: 'Cannot delete room with active applications',
            };
        }

        if (room.status === 'OCCUPIED') {
            return {
                success: false,
                error: 'Cannot delete occupied room',
            };
        }

        await prisma.room.delete({
            where: { id: roomId },
        });

        return {
            success: true,
            message: 'Room deleted successfully',
        };

    } catch (error) {
        console.error('Delete room error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete room',
        };
    }
}

export async function getRooms(filters?: {
    status?: string;
    minRent?: number;
    maxRent?: number;
    minSize?: number;
}) {
    try {
        const where: any = {};

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.minRent || filters?.maxRent) {
            where.monthlyRent = {};
            if (filters.minRent) where.monthlyRent.gte = filters.minRent;
            if (filters.maxRent) where.monthlyRent.lte = filters.maxRent;
        }

        if (filters?.minSize) {
            where.sizeSqFt = { gte: filters.minSize };
        }

        const rooms = await prisma.room.findMany({
            where,
            include: {
                currentTenant: {
                    select: {
                        name: true,
                        businessName: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        return {
            success: true,
            rooms,
        };

    } catch (error) {
        console.error('Get rooms error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get rooms',
        };
    }
}

export async function getRoom(roomId: string) {
    try {
        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: {
                currentTenant: {
                    select: {
                        name: true,
                        businessName: true,
                    },
                },
                applications: {
                    where: {
                        status: 'PENDING',
                    },
                    select: {
                        id: true,
                        applicant: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!room) {
            return {
                success: false,
                error: 'Room not found',
            };
        }

        return {
            success: true,
            room,
        };

    } catch (error) {
        console.error('Get room error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get room',
        };
    }
}

export async function updateRoomStatus(
    roomId: string,
    status: 'AVAILABLE' | 'PENDING' | 'OCCUPIED' | 'MAINTENANCE'
) {
    try {
        const user = await getCurrentUser();
        requireAdmin(user);

        const room = await prisma.room.update({
            where: { id: roomId },
            data: { status },
        });

        return {
            success: true,
            room,
            message: `Room status updated to ${status}`,
        };

    } catch (error) {
        console.error('Update room status error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update room status',
        };
    }
}

export async function addRoomPhotos(roomId: string, photoUrls: string[]) {
    try {
        const user = await getCurrentUser();
        requireAdmin(user);

        const room = await prisma.room.findUnique({
            where: { id: roomId },
        });

        if (!room) {
            return {
                success: false,
                error: 'Room not found',
            };
        }

        const updatedRoom = await prisma.room.update({
            where: { id: roomId },
            data: {
                photos: [...room.photos, ...photoUrls],
            },
        });

        return {
            success: true,
            room: updatedRoom,
            message: 'Photos added successfully',
        };

    } catch (error) {
        console.error('Add room photos error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to add photos',
        };
    }
}

export async function removeRoomPhoto(roomId: string, photoUrl: string) {
    try {
        const user = await getCurrentUser();
        requireAdmin(user);

        const room = await prisma.room.findUnique({
            where: { id: roomId },
        });

        if (!room) {
            return {
                success: false,
                error: 'Room not found',
            };
        }

        const updatedRoom = await prisma.room.update({
            where: { id: roomId },
            data: {
                photos: room.photos.filter(p => p !== photoUrl),
            },
        });

        return {
            success: true,
            room: updatedRoom,
            message: 'Photo removed successfully',
        };

    } catch (error) {
        console.error('Remove room photo error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to remove photo',
        };
    }
}