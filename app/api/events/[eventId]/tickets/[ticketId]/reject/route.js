import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";

// PATCH - Reject ticket
export async function PATCH(request, { params }) {
    try {
        await dbConnect();

        const { eventId, ticketId } = await params;
        const { reason } = await request.json();

        const ticket = await Ticket.findOne({
            ticketId: ticketId.toUpperCase(),
            eventId: eventId.toUpperCase(),
        });

        if (!ticket) {
            return NextResponse.json(
                { success: false, error: "Ticket not found" },
                { status: 404 }
            );
        }

        ticket.status = "rejected";
        ticket.rejectionReason = reason || "No reason provided";
        await ticket.save();

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
