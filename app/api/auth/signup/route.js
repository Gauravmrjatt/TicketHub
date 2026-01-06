import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// POST - Register new user
export async function POST(request) {
    try {
        await dbConnect();

        const { name, email, password } = await request.json();

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "Email already registered" },
                { status: 400 }
            );
        }

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
        });

        return NextResponse.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to register" },
            { status: 500 }
        );
    }
}
