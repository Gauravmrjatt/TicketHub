import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";

/**
 * GET /api/tickets/[ticketId]
 * Get a single ticket by ticketId
 */
export async function GET(request, { params }) {
    try {
        await dbConnect();

        const { ticketId } = await params;

        const ticket = await Ticket.findOne({ ticketId });

        if (!ticket) {
            return NextResponse.json(
                { success: false, error: "Ticket not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        console.error("Error fetching ticket:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch ticket" },
            { status: 500 }
        );
    }
}
