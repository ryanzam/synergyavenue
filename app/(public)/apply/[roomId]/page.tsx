import { rooms } from '@/data';
import { IRoom } from '@/interfaces';
import { notFound } from 'next/navigation';
import ApplicationForm from './application-form';

const ApplyPage = async ({ params }: { params: Promise<{ roomId: string }>; }) => {

    const { roomId } = await params;

    // implement room fetching logic here
    const id = parseInt(roomId, 10);
    const room: IRoom = rooms.filter(r => r.id === roomId)[0];

    if (!room) {
        notFound();
    }

    if (room.status !== 'AVAILABLE') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Room Not Available
                    </h1>
                    <p className="text-gray-600 mb-6">
                        This room is currently {room.status.toLowerCase()} and not accepting applications.
                    </p>
                    <a
                        href="/"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        View Available Rooms
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <ApplicationForm room={room} />
            </div>
        </div>
    )
}

export default ApplyPage