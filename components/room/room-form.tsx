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
        amenities: string[];
        photos: string[];
        status: string;
    };
}

type LocalActionState = { success?: boolean; error?: string } | null;

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
    const [photos, setPhotos] = useState<string[]>(room?.photos || []);
    const [uploading, setUploading] = useState(false);

    const action = room ? updateRoom : createRoom;
    const [state, formAction] = useActionState(action as any, null) as [LocalActionState, any, boolean];

    useEffect(() => {
        if (state?.success) {
            toast.success(room ? 'Room updated successfully' : 'Room created successfully')
            router.push('/admin/rooms');
        } else if (state?.error) {
            toast.error("Error adding/updating room.")
        }
    }, [state, router, toast, room]);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        // Simulate upload - in real app, use Uploadthing
        // For now, create object URLs
        const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
        setPhotos(prev => [...prev, ...newPhotos]);

        setUploading(false);

        toast.success('Photos uploaded');
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <form action={formAction} className="space-y-6">
            {room && <input type="hidden" name="id" value={room.id} />}

            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle className='text-primary'>Basic Information</CardTitle>
                    <CardDescription className='text-primary'>Enter the room details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="name" className='text-primary'>Room Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={room?.name}
                            placeholder="e.g., Room 1, Corner Shop Space"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description" className='text-primary'>Description *</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={room?.description}
                            placeholder="Describe the room, its features, and ideal use cases..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="sizeSqFt" className='text-primary'>Size (sq ft) *</Label>
                            <Input
                                id="sizeSqFt"
                                name="sizeSqFt"
                                type="number"
                                defaultValue={room?.sizeSqFt}
                                placeholder="e.g., 250"
                                required
                                min="1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="monthlyRent" className='text-primary'>Monthly Rent ($) *</Label>
                            <Input
                                id="monthlyRent"
                                name="monthlyRent"
                                type="number"
                                defaultValue={room?.monthlyRent}
                                placeholder="e.g., 1500"
                                required
                                min="1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="deposit" className='text-primary'>Security Deposit ($) *</Label>
                            <Input
                                id="deposit"
                                name="deposit"
                                type="number"
                                defaultValue={room?.deposit}
                                placeholder="e.g., 1500"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="status" className='text-primary'>Status *</Label>
                        <select className='border ml-2 p-2 rounded-md' name="status" defaultValue={room?.status || 'AVAILABLE'}>
                            <option value="AVAILABLE">Available</option>
                            <option value="OCCUPIED">Occupied</option>
                            <option value="PENDING">Pending</option>
                            <option value="MAINTENANCE">Maintenance</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Photos */}
            <Card>
                <CardHeader>
                    <CardTitle className='text-primary'>Photos</CardTitle>
                    <CardDescription className='text-primary'>Upload room photos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label
                            htmlFor="photo-upload"
                            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                        >
                            <div className="text-center">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <span className="text-sm text-gray-600">
                                    {uploading ? 'Uploading...' : 'Click to upload photos'}
                                </span>
                            </div>
                        </Label>
                        <Input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handlePhotoUpload}
                            disabled={uploading}
                        />
                    </div>

                    {photos.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {photos.map((photo, index) => (
                                <div key={index} className="relative group">
                                    <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={photo}
                                            alt={`Room photo ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removePhoto(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    {index === 0 && (
                                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                            Cover
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <input
                        type="hidden"
                        name="photos"
                        value={JSON.stringify(photos)}
                    />
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