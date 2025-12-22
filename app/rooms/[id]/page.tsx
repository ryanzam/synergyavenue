import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Calendar, DollarSign, MapPin, Square } from 'lucide-react'
import Link from 'next/link'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { rooms } from '@/data'
import { IRoom } from '@/interfaces'
import Image from 'next/image'

const RoomDetailPage = async ({ params }: { params: Promise<{ id: string }>; }) => {

    const { id } = await params;

    const room: IRoom = rooms.filter(r => r.id === id)[0];
    const isAvailable = room.status === "AVAILABLE";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Button */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <Button variant="outline" asChild className='hover:bg-primary/20'>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Listings
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Photo Carousel */}
                        <Carousel className="w-full" opts={{ loop: true }}>
                            <CarouselContent>
                                {room.photo.map((p, index) => (
                                    <CarouselItem key={index}>
                                        <div className="p-1">
                                            <Card>
                                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                                    <Image
                                                        src={p}
                                                        alt={room.name}
                                                        fill
                                                    />
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>

                        {/* Room Details */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-3xl text-primary">{room.name}</CardTitle>
                                        <CardDescription className="mt-2 text-base">
                                            Premium shop space in prime location
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        className={
                                            isAvailable
                                                ? 'bg-green-500'
                                                : room.status === 'OCCUPIED'
                                                    ? 'bg-red-500'
                                                    : 'bg-yellow-500'
                                        }
                                    >
                                        {room.status}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Description */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-primary">Description</h3>
                                    <p className="text-primary leading-relaxed">
                                        {room.description}
                                    </p>
                                </div>

                                <Separator />

                                {/* Key Features */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-secondary/30 rounded-lg">
                                            <Square className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Size</div>
                                            <div className="font-semibold">{room.sizeSqFt} sq ft</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-green-100 rounded-lg">
                                            <span className='font-bold text-green-500'>Rs.</span>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Monthly Rent</div>
                                            <div className="font-semibold">{room.monthyRent}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-purple-100 rounded-lg">
                                            <span className='font-bold text-purple-600'>Rs.</span>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Deposit</div>
                                            <div className="font-semibold">{room.deposit.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location (Placeholder) */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                                    <p className="text-gray-500">Map integration coming soon</p>
                                </div>
                                <p className="mt-4 text-gray-600">
                                    Conveniently located in a high-traffic area with excellent visibility and accessibility.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            {/* Pricing Card */}
                            <Card className="border-2 border-accent/50">
                                <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50">
                                    <CardTitle className="text-2xl">Pricing</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-primary">Monthly Rent</span>
                                        <span className="text-2xl font-bold text-primary">
                                            ${room.monthyRent}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-primary">Security Deposit</span>
                                        <span className="text-xl font-semibold text-primary">
                                            ${room.deposit.toLocaleString()}
                                        </span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Total Due at Signing</span>
                                        <span className="text-2xl font-bold text-secondary">
                                            ${(room.monthyRent + room.deposit).toLocaleString()}
                                        </span>
                                    </div>

                                    {isAvailable ? (
                                        <>
                                            <Button
                                                size="lg"
                                                className="w-full bg-secondary hover:bg-secondary/80 mt-4"
                                                asChild
                                            >
                                                <Link href={`/apply/${room.id}`}>
                                                    Apply Now
                                                </Link>
                                            </Button>
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="w-full"
                                                asChild
                                            >
                                                <Link href={`/schedule-viewing/${room.id}`}>
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    Schedule Viewing
                                                </Link>
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-sm font-medium text-primary">
                                                {room.status === 'OCCUPIED'
                                                    ? 'This space is currently occupied'
                                                    : 'This space is not available at the moment'}
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="w-full mt-3"
                                                asChild
                                            >
                                                <Link href="/">View Other Spaces</Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Application Process */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className='text-primary'>Application Process</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex gap-3">
                                        <div className="shrink-0 w-8 h-8 bg-secondary/30 rounded-full flex items-center justify-center text-primary font-semibold">
                                            1
                                        </div>
                                        <div>
                                            <div className="font-medium text-primary">Submit Application</div>
                                            <div className="text-sm text-gray-600">Complete our simple online form</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="shrink-0 w-8 h-8 bg-secondary/30 rounded-full flex items-center justify-center text-primary font-semibold">
                                            2
                                        </div>
                                        <div>
                                            <div className="font-medium text-primary">Review & Approval</div>
                                            <div className="text-sm text-gray-600">We review within 48 hours</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="shrink-0 w-8 h-8 bg-secondary/30 rounded-full flex items-center justify-center text-primary font-semibold">
                                            3
                                        </div>
                                        <div>
                                            <div className="font-medium text-primary">Sign & Pay</div>
                                            <div className="text-sm text-gray-600">E-sign contract and pay deposit</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="shrink-0 w-8 h-8 bg-secondary/30 rounded-full flex items-center justify-center text-primary font-semibold">
                                            4
                                        </div>
                                        <div>
                                            <div className="font-medium text-primary">Move In</div>
                                            <div className="text-sm text-gray-600">Start your business!</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoomDetailPage