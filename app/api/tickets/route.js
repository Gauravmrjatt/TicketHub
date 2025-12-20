import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";

/**
 * POST /api/tickets
 * Create a new ticket
 */
export async function POST(request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { name, email, utr, paymentImage } = body;

        // Validate required fields
        if (!name || !email || !utr || !paymentImage) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Generate unique ticket ID
        const ticketId = `TKT-${uuidv4().slice(0, 8).toUpperCase()}`;

        // Create ticket
        const ticket = await Ticket.create({
            ticketId,
            name,
            email,
            utr,
            paymentImage,
            status: "pending",
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    ticketId: ticket.ticketId,
                    status: ticket.status,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating ticket:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create ticket" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/tickets
 * Get all tickets (for admin)
 */
export async function GET() {
    try {
        await dbConnect();

        const tickets = await Ticket.find({}).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: tickets,
        });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch tickets" },
            { status: 500 }
        );
    }
}
