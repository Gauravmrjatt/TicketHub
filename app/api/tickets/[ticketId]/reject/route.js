import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";

/**
 * PATCH /api/tickets/[ticketId]/reject
 * Reject a ticket with optional reason
 */
export async function PATCH(request, { params }) {
    try {
        await dbConnect();

        const { ticketId } = await params;
        const body = await request.json();
        const { reason } = body;

        const ticket = await Ticket.findOneAndUpdate(
            { ticketId },
            { status: "rejected", rejectionReason: reason || "" },
            { new: true }
        );

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
        console.error("Error rejecting ticket:", error);
        return NextResponse.json(
            { success: false, error: "Failed to reject ticket" },
            { status: 500 }
        );
    }
}
