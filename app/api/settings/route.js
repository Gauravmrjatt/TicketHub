import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Settings from "@/models/Settings";

const SETTINGS_KEY = "payment_settings";

/**
 * GET /api/settings
 * Get payment settings (UPI QR and address)
 */
export async function GET() {
    try {
        await dbConnect();

        let settings = await Settings.findOne({ key: SETTINGS_KEY });

        // Return empty settings if none exist
        if (!settings) {
            return NextResponse.json({
                success: true,
                data: {
                    upiAddress: "",
                    qrCodeImage: "",
                },
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                upiAddress: settings.upiAddress,
                qrCodeImage: settings.qrCodeImage,
            },
        });
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/settings
 * Update payment settings (UPI QR and address)
 */
export async function POST(request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { upiAddress, qrCodeImage } = body;

        // Upsert settings
        const settings = await Settings.findOneAndUpdate(
            { key: SETTINGS_KEY },
            {
                key: SETTINGS_KEY,
                upiAddress: upiAddress || "",
                qrCodeImage: qrCodeImage || "",
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            success: true,
            data: {
                upiAddress: settings.upiAddress,
                qrCodeImage: settings.qrCodeImage,
            },
        });
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update settings" },
            { status: 500 }
        );
    }
}
