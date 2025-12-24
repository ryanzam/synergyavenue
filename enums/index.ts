export enum RoomStatus {
    AVAILABLE = "AVAILABLE",   // Room is ready for applications
    PENDING = "PENDING",     // Application approved, awaiting payment/move-in
    OCCUPIED = "OCCUPIED",    // Currently rented
    MAINTENANCE = "MAINTENANCE" // Temporarily unavailable
}
