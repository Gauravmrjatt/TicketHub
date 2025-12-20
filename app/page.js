"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket, ArrowRight, Search, CheckCircle, User, CreditCard, FileCheck, Menu, X } from "lucide-react";

export default function HomePage() {
    const router = useRouter();
    const [ticketId, setTicketId] = useState("");
    const [isTracking, setIsTracking] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleTrack = (e) => {
        e.preventDefault();
        if (ticketId.trim()) {
            setIsTracking(true);
            router.push(`/track/${ticketId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Subtle grain texture */}
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>

            {/* Header */}
            <header className="relative z-50 border-b border-slate-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
                                <Ticket className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-medium text-slate-900 tracking-tight">TicketHub</span>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link href="/book" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
                                Book Ticket
                            </Link>
                            <Link href="/admin" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
                                Admin
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-slate-900 p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <nav className="md:hidden mt-6 pb-6 border-t border-slate-200 pt-6">
                            <div className="flex flex-col gap-4">
                                <Link href="/book" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Book Ticket</Link>
                                <Link href="/admin" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Admin</Link>
                            </div>
                        </nav>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 container mx-auto px-4 py-20 sm:py-28 md:py-32 lg:py-40">
                <div className="max-w-4xl mx-auto">
                    {/* Main Content */}
                    <div className="text-center space-y-8 mb-16">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-slate-900 leading-[1.1] tracking-tight">
                            Book tickets.
                            <br />
                            <span className="font-normal">Track instantly.</span>
                        </h1>

                        <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                            Simple three-step booking with instant confirmation.
                            <br className="hidden sm:block" />
                            No waiting. No complexity.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href="/book">
                                <Button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-base rounded-none transition-all duration-200">
                                    Start Booking
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Track Input */}
                    <div className="max-w-xl mx-auto pt-12 border-t border-slate-200">
                        <p className="text-slate-500 text-sm mb-4 text-center font-light">Track your booking</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Input
                                    type="text"
                                    placeholder="Enter ticket ID"
                                    value={ticketId}
                                    onChange={(e) => setTicketId(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && ticketId.trim()) {
                                            handleTrack(e);
                                        }
                                    }}
                                    className="h-12 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 rounded-none transition-colors"
                                />
                            </div>
                            <Button
                                onClick={handleTrack}
                                disabled={!ticketId.trim() || isTracking}
                                variant="outline"
                                className="h-12 px-6 border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none transition-colors disabled:opacity-40"
                            >
                                <Search className="h-4 w-4 mr-2" />
                                Track
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="relative z-10 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4 py-20 sm:py-28">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-light text-slate-900 mb-16 text-center">
                            How it works
                        </h2>

                        <div className="space-y-12">
                            {/* Step 1 */}
                            <div className="flex gap-8 items-start group">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 border border-slate-300 flex items-center justify-center transition-all duration-300 group-hover:border-slate-900">
                                        <User className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <h3 className="text-xl font-normal text-slate-900 mb-2">Enter your details</h3>
                                    <p className="text-slate-600 leading-relaxed font-light">
                                        Provide your basic information and journey details through our streamlined form.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-8 items-start group">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 border border-slate-300 flex items-center justify-center transition-all duration-300 group-hover:border-slate-900">
                                        <CreditCard className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <h3 className="text-xl font-normal text-slate-900 mb-2">Complete payment</h3>
                                    <p className="text-slate-600 leading-relaxed font-light">
                                        Secure payment via UPI with instant processing and confirmation.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex gap-8 items-start group">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 border border-slate-300 flex items-center justify-center transition-all duration-300 group-hover:border-slate-900">
                                        <FileCheck className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <h3 className="text-xl font-normal text-slate-900 mb-2">Receive your ticket</h3>
                                    <p className="text-slate-600 leading-relaxed font-light">
                                        Instant confirmation with downloadable ticket and tracking ID.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="relative z-10 bg-white">
                <div className="container mx-auto px-4 py-20 sm:py-28">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
                            {/* Feature 1 */}
                            <div className="text-center group">
                                <div className="mb-6 flex justify-center">
                                    <div className="w-12 h-12 border border-slate-300 flex items-center justify-center transition-all duration-300 group-hover:border-slate-900">
                                        <Ticket className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-normal text-slate-900 mb-3">Fast booking</h3>
                                <p className="text-slate-600 text-sm leading-relaxed font-light">
                                    Complete your booking in under two minutes with our streamlined process.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="text-center group">
                                <div className="mb-6 flex justify-center">
                                    <div className="w-12 h-12 border border-slate-300 flex items-center justify-center transition-all duration-300 group-hover:border-slate-900">
                                        <Search className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-normal text-slate-900 mb-3">Live tracking</h3>
                                <p className="text-slate-600 text-sm leading-relaxed font-light">
                                    Monitor your booking status in real-time with your unique ticket ID.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="text-center group">
                                <div className="mb-6 flex justify-center">
                                    <div className="w-12 h-12 border border-slate-300 flex items-center justify-center transition-all duration-300 group-hover:border-slate-900">
                                        <CheckCircle className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-normal text-slate-900 mb-3">Quick approval</h3>
                                <p className="text-slate-600 text-sm leading-relaxed font-light">
                                    Swift verification and approval process to get you ready fast.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="relative z-10 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-light text-slate-900 mb-1">10K+</div>
                            <div className="text-slate-600 text-xs tracking-wide uppercase font-light">Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-light text-slate-900 mb-1">2min</div>
                            <div className="text-slate-600 text-xs tracking-wide uppercase font-light">Avg time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-light text-slate-900 mb-1">99.9%</div>
                            <div className="text-slate-600 text-xs tracking-wide uppercase font-light">Success</div>
                        </div>
                        <div className="text-center col-span-2 md:col-span-1">
                            <div className="text-3xl md:text-4xl font-light text-slate-900 mb-1">24/7</div>
                            <div className="text-slate-600 text-xs tracking-wide uppercase font-light">Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="relative z-10 bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-12">
                    <p className="text-center text-slate-400 text-xs tracking-wide uppercase mb-8 font-light">Trusted worldwide</p>
                    <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
                        <div className="text-slate-600 text-sm tracking-wider uppercase font-light hover:text-slate-900 transition-colors cursor-pointer">Secure</div>
                        <div className="text-slate-600 text-sm tracking-wider uppercase font-light hover:text-slate-900 transition-colors cursor-pointer">UPI Payment</div>
                        <div className="text-slate-600 text-sm tracking-wider uppercase font-light hover:text-slate-900 transition-colors cursor-pointer">Verified</div>
                        <div className="text-slate-600 text-sm tracking-wider uppercase font-light hover:text-slate-900 transition-colors cursor-pointer">Instant</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 bg-slate-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col items-center text-center mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
                                    <Ticket className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xl font-medium text-slate-900 tracking-tight">TicketHub</span>
                            </div>
                            <p className="text-slate-600 text-sm mb-8 font-light max-w-md">
                                Simple, fast, and reliable ticket booking for everyone.
                            </p>
                            <div className="flex items-center gap-8 text-sm">
                                <Link href="/book" className="text-slate-600 hover:text-slate-900 transition-colors font-light">Book</Link>
                                <Link href="/admin" className="text-slate-600 hover:text-slate-900 transition-colors font-light">Admin</Link>
                                <Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors font-light">Privacy</Link>
                                <Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors font-light">Terms</Link>
                            </div>
                        </div>
                        <div className="pt-8 border-t border-slate-200 text-center">
                            <p className="text-slate-400 text-xs font-light">
                                © {new Date().getFullYear()} TicketHub. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}