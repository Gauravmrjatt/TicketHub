import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

// GET - List public events
export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "active";
        const search = searchParams.get("search") || "";

        let query = { isPublic: true };

        if (status !== "all") {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { venue: { $regex: search, $options: "i" } },
                { eventId: { $regex: search, $options: "i" } },
            ];
        }

        const events = await Event.find(query)
            .select("-password -qrCodeImage")
            .sort({ date: 1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: events,
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}

// POST - Create new event
export async function POST(request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { name, description, date, venue, image, price, capacity, password, upiAddress, qrCodeImage, isPublic, userId } = body;

        // Validation
        if (!name || !date || !password || !userId) {
            return NextResponse.json(
                { success: false, error: "Name, date, password, and userId are required" },
                { status: 400 }
            );
        }

        if (password.length < 4) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 4 characters" },
                { status: 400 }
            );
        }

        // Generate unique event ID
        let eventId = Event.generateEventId();
        let existingEvent = await Event.findOne({ eventId });
        while (existingEvent) {
            eventId = Event.generateEventId();
            existingEvent = await Event.findOne({ eventId });
        }

        const event = await Event.create({
            eventId,
            createdBy: userId,
            name,
            description,
            date: new Date(date),
            venue,
            image,
            price: price || 0,
            capacity: capacity || 0,
            password,
            upiAddress,
            qrCodeImage,
            isPublic: isPublic !== false,
        });

        return NextResponse.json({
            success: true,
            data: {
                eventId: event.eventId,
                name: event.name,
                adminUrl: `/events/${event.eventId}/admin`,
                publicUrl: `/events/${event.eventId}`,
            },
        });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create event" },
            { status: 500 }
        );
    }
}
