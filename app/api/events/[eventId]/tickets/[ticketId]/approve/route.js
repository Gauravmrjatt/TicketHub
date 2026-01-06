import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";

// PATCH - Approve ticket
export async function PATCH(request, { params }) {
    try {
        await dbConnect();

        const { eventId, ticketId } = await params;

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

        ticket.status = "approved";
        ticket.rejectionReason = undefined;
        await ticket.save();

        return NextResponse.json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        console.error("Error approving ticket:", error);
        return NextResponse.json(
            { success: false, error: "Failed to approve ticket" },
            { status: 500 }
        );
    }
}
