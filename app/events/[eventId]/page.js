"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    Ticket,
    Loader2,
    Share2,
    Clock
} from "lucide-react";

export default function EventPage({ params }) {
    const { eventId } = use(params);
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const fetchEvent = async () => {
        try {
            const res = await fetch(`/api/events/${eventId}`);
            const data = await res.json();
            if (!data.success) {
                throw new Error(data.error || "Event not found");
            }
            setEvent(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: event.name,
                text: `Check out ${event.name} on TicketHub`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>
                <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white py-8 px-4">
                <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>
                <div className="container max-w-2xl mx-auto text-center relative">
                    <div className="w-20 h-20 mx-auto mb-6 border border-slate-300 flex items-center justify-center">
                        <Ticket className="w-10 h-10 text-slate-600" />
                    </div>
                    <h1 className="text-2xl font-light text-slate-900 mb-2">Event Not Found</h1>
                    <p className="text-slate-600 mb-6 font-light">{error}</p>
                    <Link href="/">
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12 px-8">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Events
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const isSoldOut = event.capacity > 0 && event.spotsLeft === 0;
    const isExpired = new Date(event.date) < new Date();
    const isActive = event.status === "active" && !isExpired && !isSoldOut;

    return (
        <div className="min-h-screen bg-white">
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>

            {/* Header */}
            <header className="border-b border-slate-200 relative z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                All Events
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={handleShare} className="text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Event Banner */}
            <div className="relative aspect-[21/9] sm:aspect-[3/1] bg-slate-100 border-b border-slate-200">
                {event.image ? (
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Ticket className="w-20 h-20 text-slate-300" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-6 sm:py-8 -mt-16 relative z-10">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge variant="outline" className="border-slate-300 text-slate-600 font-mono text-xs">{event.eventId}</Badge>
                                {event.status === "active" && !isExpired && (
                                    <Badge variant="outline" className="border-green-600 text-green-600 text-xs">Active</Badge>
                                )}
                                {isExpired && (
                                    <Badge variant="outline" className="border-yellow-600 text-yellow-600 text-xs">Past Event</Badge>
                                )}
                                {isSoldOut && (
                                    <Badge variant="outline" className="border-red-600 text-red-600 text-xs">Sold Out</Badge>
                                )}
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-900 mb-4">{event.name}</h1>
                        </div>

                        {/* Event Details */}
                        <Card className="border-slate-200 rounded-none shadow-none">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 border border-slate-300 flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-slate-600 text-sm font-light">Date & Time</p>
                                        <p className="text-slate-900 font-normal">{formatDate(event.date)}</p>
                                    </div>
                                </div>

                                {event.venue && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 border border-slate-300 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-slate-600 text-sm font-light">Venue</p>
                                            <p className="text-slate-900 font-normal">{event.venue}</p>
                                        </div>
                                    </div>
                                )}

                                {event.capacity > 0 && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 border border-slate-300 flex items-center justify-center flex-shrink-0">
                                            <Users className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-slate-600 text-sm font-light">Availability</p>
                                            <p className="text-slate-900 font-normal">
                                                {event.spotsLeft} spots remaining
                                                <span className="text-slate-500"> / {event.capacity} total</span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Description */}
                        {event.description && (
                            <Card className="border-slate-200 rounded-none shadow-none">
                                <CardContent className="p-6">
                                    <h2 className="text-lg font-normal text-slate-900 mb-3">About This Event</h2>
                                    <p className="text-slate-600 whitespace-pre-wrap font-light">{event.description}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar - Ticket Card */}
                    <div className="lg:col-span-1">
                        <Card className="border-slate-200 rounded-none shadow-none sticky top-6">
                            <CardContent className="p-6 space-y-4">
                                <div className="text-center">
                                    <p className="text-slate-600 text-sm font-light mb-1">Ticket Price</p>
                                    <p className="text-3xl font-light text-slate-900">
                                        {event.price > 0 ? `₹${event.price}` : "Free"}
                                    </p>
                                </div>

                                {event.stats && (
                                    <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-200">
                                        <div className="text-center">
                                            <p className="text-xl font-light text-slate-900">{event.stats.total}</p>
                                            <p className="text-slate-500 text-xs font-light">Bookings</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xl font-light text-green-600">{event.stats.approved}</p>
                                            <p className="text-slate-500 text-xs font-light">Approved</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xl font-light text-yellow-600">{event.stats.pending}</p>
                                            <p className="text-slate-500 text-xs font-light">Pending</p>
                                        </div>
                                    </div>
                                )}

                                {isActive ? (
                                    <Link href={`/events/${event.eventId}/book`} className="block">
                                        <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white text-lg rounded-none">
                                            <Ticket className="mr-2 h-5 w-5" />
                                            Book Now
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button disabled className="w-full h-12 bg-slate-100 text-slate-400 rounded-none">
                                        {isSoldOut ? "Sold Out" : isExpired ? "Event Ended" : "Not Available"}
                                    </Button>
                                )}

                                <p className="text-slate-400 text-xs text-center font-light">
                                    <Clock className="inline w-3 h-3 mr-1" />
                                    Booking closes when event starts
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
