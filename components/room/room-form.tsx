"use client"
import { Label } from '@radix-ui/react-label';
import { Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useActionState, useEffect, useState, useMemo } from 'react'
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useFormStatus } from 'react-dom';
import { createRoom, updateRoom } from '@/actions/rooms';
import { toast } from 'sonner';
import Image from 'next/image';
interface RoomFormClientProps {
    room?: {
        id: string;
        name: string;
        description: string;
        sizeSqFt: number;
        monthlyRent: number;
        deposit: number;
        photo: string;
        status: string;
    };
}

const SubmitButton = ({ isEdit }: { isEdit: boolean }) => {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? 'Saving...' : isEdit ? 'Update Room' : 'Create Room'}
        </Button>
    );
}

const RoomForm = ({ room }: RoomFormClientProps) => {

    const router = useRouter();
    const [photos, setPhotos] = useState<string>(room?.photo || "");
    const [uploading, setUploading] = useState(false);

    const action = room ? updateRoom : createRoom;
    const [state, formAction] = useActionState(action, null);

    useEffect(() => {
        if (state?.success) {
            toast.success(room ? 'Room updated successfully' : 'Room created successfully')
            router.push('/admin/rooms');
        } else if (state?.error) {
            toast.error("Error saving room.")
        }
    }, [state, router, toast, room]);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        toast.success('Photos uploaded');
    };

    const removePhoto = (index: number) => {
        setPhotos("");
    };

    return (
        <form action={formAction} className="space-y-6">
            {room && <input type="hidden" name="id" value={room.id} />}

            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Enter the room details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="name">Room Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            value={room?.name}
                            placeholder="e.g., Room 1, Corner Shop Space"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={room?.description}
                            minLength={10}
                            placeholder="Describe the room, its features, and ideal use cases..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="sizeSqFt">Size (sq ft) *</Label>
                            <Input
                                id="sizeSqFt"
                                name="sizeSqFt"
                                type="number"
                                value={room?.sizeSqFt}
                                placeholder="e.g., 250"
                                required
                                min="1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="monthlyRent">Monthly Rent ($) *</Label>
                            <Input
                                id="monthlyRent"
                                name="monthlyRent"
                                type="number"
                                value={room?.monthlyRent}
                                placeholder="e.g., 1500"
                                required
                                min="1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="deposit">Security Deposit ($) *</Label>
                            <Input
                                id="deposit"
                                name="deposit"
                                type="number"
                                value={room?.deposit}
                                placeholder="e.g., 1500"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <div>
                            <Label htmlFor="status">Status *</Label>
                            <select name="status" id="" className='border p-2 ml-2'>
                                <option value="AVAILABLE">Available</option>
                                <option value="OCCUPIED">Occupied</option>
                                <option value="PENDING">Pending</option>
                                <option value="MAINTENANCE">Maintenance</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="photo">Photo Url</Label>
                            <Input
                                id="photo"
                                name="photo"
                                value={room?.photo}
                                placeholder="https://roomimage.com"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <SubmitButton isEdit={!!room} />
            </div>
        </form>
    )
}

export default RoomForm