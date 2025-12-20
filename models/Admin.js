import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Admin Schema
 * Stores admin credentials for authentication
 * Only one admin (root) can be registered
 */
const AdminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
        isRoot: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Hash password before saving
 */
AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Compare password method
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} - True if password matches
 */
AdminSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Prevent model recompilation in development
export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
