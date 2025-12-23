import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

const RoomLoading = () => {
    return (
        <div className='container mx-auto px-6'>
            <Card className="overflow-hidden">
                <div className="h-56 w-full bg-gray-200 animate-pulse" />
                <CardHeader>
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse mt-2" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                </CardContent>
                <CardFooter className="flex gap-2">
                    <div className="h-10 bg-gray-200 rounded animate-pulse flex-1" />
                    <div className="h-10 bg-gray-200 rounded animate-pulse flex-1" />
                </CardFooter>
            </Card>
        </div>
    )
}

export default RoomLoading