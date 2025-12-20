import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";

/**
 * POST /api/admin/login
 * Admin login
 */
export async function POST(request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: "Username and password are required" },
                { status: 400 }
            );
        }

        // Find admin by username
        const admin = await Admin.findOne({ username: username.toLowerCase() });

        if (!admin) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Compare password
        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                username: admin.username,
                isRoot: admin.isRoot,
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json(
            { success: false, error: "Failed to login" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/admin/login
 * Check if admin exists (for registration flow)
 */
export async function GET() {
    try {
        await dbConnect();

        const adminExists = await Admin.exists({});

        return NextResponse.json({
            success: true,
            data: {
                adminExists: !!adminExists,
            },
        });
    } catch (error) {
        console.error("Error checking admin:", error);
        return NextResponse.json(
            { success: false, error: "Failed to check admin status" },
            { status: 500 }
        );
    }
}
