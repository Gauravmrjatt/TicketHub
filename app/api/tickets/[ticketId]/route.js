import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";

// GET - Get ticket by ID with event details
export async function GET(request, { params }) {
    try {
        await dbConnect();

        const { ticketId } = await params;

        const ticket = await Ticket.findOne({ ticketId: ticketId.toUpperCase() }).lean();

        if (!ticket) {
            return NextResponse.json(
                { success: false, error: "Ticket not found" },
                { status: 404 }
            );
        }

        // Get event details
        const event = await Event.findOne({ eventId: ticket.eventId })
            .select("name date venue eventId")
            .lean();

        return NextResponse.json({
            success: true,
            data: {
                ...ticket,
                event,
            },
        });
    } catch (error) {
        console.error("Error fetching ticket:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch ticket" },
            { status: 500 }
        );
    }
}
