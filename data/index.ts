// generate room data
import { Room } from "@/interfaces";
export const rooms: Room[] = [
    {
        id: "1",
        name: "Corner Shop",
        description: "A prime corner location with high foot traffic.",
        sizeSqFt: 144,
        monthyRent: 12000,
        deposit: 12000,
        photo: ["/images/shop1.jpg"]
    },
    {
        id: "2",
        name: "Main Street Store",
        description: "Located on the main street with excellent visibility.",
        sizeSqFt: 84,
        monthyRent: 8000,
        deposit: 8000,
        photo: ["/images/shop2.jpg"]
    },
    {
        id: "3",
        name: "Mall Location",
        description: "In a bustling mall with diverse customer base.",
        sizeSqFt: 144,
        monthyRent: 10000,
        deposit: 10000,
        photo: ["/images/shop3.jpg"]
    }
];