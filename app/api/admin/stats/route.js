import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
export async function GET() {
    try {
        await dbConnect();

        const [total, pending, approved, rejected] = await Promise.all([
            Ticket.countDocuments({}),
            Ticket.countDocuments({ status: "pending" }),
            Ticket.countDocuments({ status: "approved" }),
            Ticket.countDocuments({ status: "rejected" }),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                total,
                pending,
                approved,
                rejected,
            },
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch statistics" },
            { status: 500 }
        );
    }
}
