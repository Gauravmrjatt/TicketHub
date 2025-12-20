import mongoose from "mongoose";

/**
 * Settings Schema
 * Stores application settings like UPI QR code and address
 */
const SettingsSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        upiAddress: {
            type: String,
            default: "",
        },
        qrCodeImage: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation in development
export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
