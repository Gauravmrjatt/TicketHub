import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "TicketHub - Book Your Tickets",
    description: "A modern ticket booking platform with easy booking, tracking, and management",
    keywords: ["tickets", "booking", "events", "tickethub"],
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main className="min-h-screen bg-background">
                    {children}
                </main>
            </body>
        </html>
    );
}
