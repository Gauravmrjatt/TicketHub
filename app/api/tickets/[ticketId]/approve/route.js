import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";

/**
 * PATCH /api/tickets/[ticketId]/approve
 * Approve a ticket
 */
export async function PATCH(request, { params }) {
    try {
        await dbConnect();

        const { ticketId } = await params;

        const ticket = await Ticket.findOneAndUpdate(
            { ticketId },
            { status: "approved", rejectionReason: "" },
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
        console.error("Error approving ticket:", error);
        return NextResponse.json(
            { success: false, error: "Failed to approve ticket" },
            { status: 500 }
        );
    }
}
