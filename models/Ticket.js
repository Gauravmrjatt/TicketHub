import mongoose from "mongoose";

/**
 * Ticket Schema
 * Stores all ticket booking information
 */
const TicketSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
        },
        utr: {
            type: String,
            required: [true, "UTR number is required"],
            trim: true,
        },
        paymentImage: {
            type: String,
            required: [true, "Payment screenshot is required"],
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        rejectionReason: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation in development
export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
