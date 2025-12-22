// generate room data
import { RoomStatus } from "@/enums";
import { IRoom } from "@/interfaces";
export const rooms: IRoom[] = [
    {
        id: "1",
        name: "Corner Shop",
        description: "A prime corner location with high foot traffic.",
        sizeSqFt: 144,
        monthyRent: 12000,
        deposit: 12000,
        status: RoomStatus.AVAILABLE,
        photo: ["https://images.pexels.com/photos/803908/pexels-photo-803908.jpeg", "https://images.pexels.com/photos/3935340/pexels-photo-3935340.jpeg"]
    },
    {
        id: "2",
        name: "Main Street Store",
        description: "Located on the main street with excellent visibility.",
        sizeSqFt: 84,
        monthyRent: 8000,
        deposit: 8000,
        status: RoomStatus.MAINTENANCE,
        photo: ["https://images.pexels.com/photos/271649/pexels-photo-271649.jpeg"]
    },
    {
        id: "3",
        name: "Mall Location",
        description: "In a bustling mall with diverse customer base.",
        sizeSqFt: 144,
        monthyRent: 10000,
        deposit: 10000,
        status: RoomStatus.AVAILABLE,
        photo: ["https://images.pexels.com/photos/5872378/pexels-photo-5872378.jpeg", "https://images.pexels.com/photos/30747177/pexels-photo-30747177.jpeg"]
    }
];