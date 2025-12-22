import { RoomStatus } from "@/enums";

export interface IRoom {
    id: string;
    name: string;
    description: string;
    sizeSqFt: number;
    monthyRent: number;
    deposit: number;
    status: RoomStatus
    photo: string[];
}