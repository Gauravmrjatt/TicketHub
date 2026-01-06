import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    eventId: {
        type: String,
        required: [true, "Event ID is required"],
        uppercase: true,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
        type: String,
        trim: true,
    },
    utr: {
        type: String,
        required: [true, "UTR/Transaction ID is required"],
        trim: true,
    },
    paymentImage: {
        type: String, // Base64 encoded image
        required: [true, "Payment screenshot is required"],
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    rejectionReason: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Generate unique ticket ID
TicketSchema.statics.generateTicketId = function () {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "TKT-";
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
