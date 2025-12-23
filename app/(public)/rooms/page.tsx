import RoomCard from '@/components/room/RoomCard'
import { rooms } from '@/data'
import React from 'react'

const RoomsPage = () => {
    return (
        <div className="min-h-screen dark:bg-black">
            <section className="py-12 bg-foreground/5">
                <div className="container mx-auto sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-primary">All Spaces</h2>
                        <p className="mt-4 text-xl text-accent">
                            Choose from our selection of spaces
                        </p>
                    </div>

                    {rooms.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-500">No rooms available at the moment.</p>
                            <p className="mt-2 text-gray-400">Check back soon for new listings!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            {rooms.map((room) => (
                                <RoomCard key={room.id} room={room} />
                            ))}
                        </div>
                    )}
                </div>
            </section >
        </div >
    )
}

export default RoomsPage