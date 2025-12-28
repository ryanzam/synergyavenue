import { RoomStatus } from "@/enums";
import { ApplicationStatus } from "@prisma/client";

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

export interface IUser {
    id: string;
    email: string;
    name: string;
}

export interface IApplication {
    id: string;
    applicant: IUser;
    room: IRoom;
    status: ApplicationStatus;
    submittedAt: string;
}