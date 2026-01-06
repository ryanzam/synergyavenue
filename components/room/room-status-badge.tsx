import { RoomStatus } from '@/enums';
import { Badge } from '../ui/badge';

interface RoomStatusBadgeProps {
    status: RoomStatus
}

const RoomStatusBadge = ({ status }: RoomStatusBadgeProps) => {

    const isAvailable = status === "AVAILABLE";

    return (
        <Badge
            className={
                isAvailable
                    ? 'bg-green-500'
                    : status === 'OCCUPIED'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
            }
        >
            {status}
        </Badge>
    )
}

export default RoomStatusBadge