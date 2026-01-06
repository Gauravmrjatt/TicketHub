import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

// POST - Event admin login
export async function POST(request, { params }) {
    try {
        await dbConnect();

        const { eventId } = await params;
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { success: false, error: "Password is required" },
                { status: 400 }
            );
        }

        const event = await Event.findOne({ eventId: eventId.toUpperCase() });

        if (!event) {
            return NextResponse.json(
                { success: false, error: "Event not found" },
                { status: 404 }
            );
        }

        const isMatch = await event.comparePassword(password);

        if (!isMatch) {
            return NextResponse.json(
                { success: false, error: "Invalid password" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                eventId: event.eventId,
                name: event.name,
            },
        });
    } catch (error) {
        console.error("Error during event login:", error);
        return NextResponse.json(
            { success: false, error: "Login failed" },
            { status: 500 }
        );
    }
}
