"use client"
import { Label } from '@radix-ui/react-label';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react'
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useFormStatus } from 'react-dom';
import { createRoom, updateRoom } from '@/actions/rooms';
import { toast } from 'sonner';
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
                            defaultValue={room?.name}
                            placeholder="e.g., Room 1, Corner Shop Space"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={room?.description}
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
                                defaultValue={room?.sizeSqFt}
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
                                defaultValue={room?.monthlyRent}
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
                                defaultValue={room?.deposit}
                                placeholder="e.g., 1500"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <div>
                            <Label htmlFor="status">Status *</Label>
                            <select defaultValue={room?.status} name="status" id="" className='border p-2 ml-2'>
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
                                defaultValue={room?.photo}
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
                    className='hover:text-white'
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