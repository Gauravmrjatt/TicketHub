import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import Ticket from "@/models/Ticket";

// GET - Get event details
export async function GET(request, { params }) {
    try {
        await dbConnect();

        const { eventId } = await params;

        const event = await Event.findOne({ eventId: eventId.toUpperCase() })
            .select("-password")
            .lean();

        if (!event) {
            return NextResponse.json(
                { success: false, error: "Event not found" },
                { status: 404 }
            );
        }

        // Get ticket stats
        const ticketStats = await Ticket.aggregate([
            { $match: { eventId: event.eventId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const stats = {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
        };

        ticketStats.forEach((stat) => {
            stats[stat._id] = stat.count;
            stats.total += stat.count;
        });

        return NextResponse.json({
            success: true,
            data: {
                ...event,
                stats,
                spotsLeft: event.capacity > 0 ? Math.max(0, event.capacity - stats.approved) : null,
            },
        });
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch event" },
            { status: 500 }
        );
    }
}

// PATCH - Update event
export async function PATCH(request, { params }) {
    try {
        await dbConnect();

        const { eventId } = await params;
        const body = await request.json();

        const event = await Event.findOne({ eventId: eventId.toUpperCase() });

        if (!event) {
            return NextResponse.json(
                { success: false, error: "Event not found" },
                { status: 404 }
            );
        }

        // Update allowed fields
        const allowedFields = ["name", "description", "date", "venue", "image", "price", "capacity", "upiAddress", "qrCodeImage", "isPublic", "status"];

        allowedFields.forEach((field) => {
            if (body[field] !== undefined) {
                event[field] = body[field];
            }
        });

        await event.save();

        return NextResponse.json({
            success: true,
            data: event,
        });
    } catch (error) {
        console.error("Error updating event:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update event" },
            { status: 500 }
        );
    }
}
