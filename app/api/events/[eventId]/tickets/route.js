import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";

// GET - Get all tickets for an event
export async function GET(request, { params }) {
    try {
        await dbConnect();

        const { eventId } = await params;

        // Verify event exists
        const event = await Event.findOne({ eventId: eventId.toUpperCase() });
        if (!event) {
            return NextResponse.json(
                { success: false, error: "Event not found" },
                { status: 404 }
            );
        }

        const tickets = await Ticket.find({ eventId: eventId.toUpperCase() })
            .sort({ createdAt: -1 })
            .lean();

        // Get stats
        const stats = {
            total: tickets.length,
            pending: tickets.filter((t) => t.status === "pending").length,
            approved: tickets.filter((t) => t.status === "approved").length,
            rejected: tickets.filter((t) => t.status === "rejected").length,
        };

        return NextResponse.json({
            success: true,
            data: {
                tickets,
                stats,
            },
        });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch tickets" },
            { status: 500 }
        );
    }
}

// POST - Create a ticket for an event
export async function POST(request, { params }) {
    try {
        await dbConnect();

        const { eventId } = await params;
        const body = await request.json();
        const { name, email, phone, utr, paymentImage } = body;

        // Verify event exists and is active
        const event = await Event.findOne({ eventId: eventId.toUpperCase() });
        if (!event) {
            return NextResponse.json(
                { success: false, error: "Event not found" },
                { status: 404 }
            );
        }

        if (event.status !== "active") {
            return NextResponse.json(
                { success: false, error: "This event is no longer accepting bookings" },
                { status: 400 }
            );
        }

        // Check capacity
        if (event.capacity > 0) {
            const approvedCount = await Ticket.countDocuments({
                eventId: event.eventId,
                status: "approved",
            });

            if (approvedCount >= event.capacity) {
                return NextResponse.json(
                    { success: false, error: "This event is sold out" },
                    { status: 400 }
                );
            }
        }

        // Validation
        if (!name || !email || !utr || !paymentImage) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            );
        }

        // Generate unique ticket ID
        let ticketId = Ticket.generateTicketId();
        let existingTicket = await Ticket.findOne({ ticketId });
        while (existingTicket) {
            ticketId = Ticket.generateTicketId();
            existingTicket = await Ticket.findOne({ ticketId });
        }

        const ticket = await Ticket.create({
            ticketId,
            eventId: event.eventId,
            name,
            email,
            phone,
            utr,
            paymentImage,
        });

        return NextResponse.json({
            success: true,
            data: {
                ticketId: ticket.ticketId,
                eventId: ticket.eventId,
                name: ticket.name,
                status: ticket.status,
            },
        });
    } catch (error) {
        console.error("Error creating ticket:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create ticket" },
            { status: 500 }
        );
    }
}
