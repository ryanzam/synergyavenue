import { IRoom } from '@/interfaces'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { DollarSign, MapPin, Square } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '../ui/badge';

interface RoomCardProps {
    room: IRoom
}

const RoomCard = ({ room }: RoomCardProps) => {
    const primaryPhoto = room.photo[0] ? '/placeholder-room.jpg' : '/placeholder-room.jpg';

    return (
        <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            {/* Room Image */}
            <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                <Image
                    src={primaryPhoto}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <Badge className="absolute top-4 right-4 bg-green-500">
                    Available
                </Badge>
            </div>

            <CardHeader>
                <CardTitle className="text-2xl text-primary">{room.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-accent">
                    {room.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Room Details */}
                <div className="flex items-center gap-2 text-gray-600">
                    <Square className="h-4 w-4" />
                    <span className="text-sm">{room.sizeSqFt} sq ft</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Prime Location</span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-sm text-primary font-medium">
                        NPR
                    </span>
                    <span className="text-3xl font-bold text-primary">
                        {room.monthyRent}
                    </span>
                    <span className="text-primary">/month</span>
                </div>

            </CardContent>

            <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1 hover:bg-primary/40" asChild>
                    <Link href={`/rooms/${room.id}`}>View Details</Link>
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90" asChild>
                    <Link href={`/apply/${room.id}`}>Apply Now</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default RoomCard