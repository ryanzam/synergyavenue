"use client"

import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { deleteRoom } from '@/actions/rooms'
import { toast } from 'sonner'

const RoomDeleteBtn = ({ roomId, roomName }: { roomId: string, roomName: string }) => {

    const handleDelete = async () => {
        const result = await deleteRoom(roomId);

        if (result.success) {
            toast.success(`${roomName} deleted`)
            window.location.reload();
        } else {
            toast.error("Error deleting room")
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}

export default RoomDeleteBtn