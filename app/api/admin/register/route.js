import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";

/**
 * POST /api/admin/register
 * Register root admin (one-time only)
 */
export async function POST(request) {
    try {
        await dbConnect();

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({});
        if (existingAdmin) {
            return NextResponse.json(
                { success: false, error: "Admin already exists. Registration is closed." },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: "Username and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Create root admin
        const admin = await Admin.create({
            username: username.toLowerCase(),
            password,
            isRoot: true,
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    username: admin.username,
                    isRoot: admin.isRoot,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering admin:", error);

        // Handle duplicate username error
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: "Username already exists" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to register admin" },
            { status: 500 }
        );
    }
}
